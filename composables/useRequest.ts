import { ApiClient, BaseHttpRequest, CancelablePromise, type OpenAPIConfig } from "~/api";
import axios from "axios";
import type { ApiRequestOptions } from "~/api/core/ApiRequestOptions";
import { request as __request } from "~/api/core/request";

// 创建不会引用apiClient的refresh方法
const refreshTokenApiCall = async (refreshToken: string, config: OpenAPIConfig): Promise<any> => {
    console.log('[Token Refresh] 开始进行独立refresh token调用');
    try {
        const response = await axios.post(
            `${config.BASE}/api/auth/refresh`,
            refreshToken,
            {
                headers: {
                    'Content-Type': 'text/plain',
                },
                withCredentials: true
            }
        );
        console.log('[Token Refresh] refresh token调用成功', response.data);
        return response.data;
    } catch (error) {
        console.error('[Token Refresh] refresh token调用失败');
        console.error(error);
        throw error;
    }
};

export class HttpRequestInterceptor extends BaseHttpRequest {
    axiosInstance = axios.create()
    isRefreshing = false
    failedQueue: Array<{
        resolve: (value: unknown) => void;
        reject: (reason?: any) => void;
        config: any;
    }> = []

    constructor(config: OpenAPIConfig) {
        super(config)
        this.axiosInstance.defaults.withCredentials = true;
        this.axiosInstance.interceptors.request.use(
            config => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers["Authorization"] = `Bearer ${token}`;
                } else {
                    config.headers.delete("Authorization");
                }

                // 如果是UML生成接口，需要额外设置
                if (config.url!.includes("uml/generate")) {
                    config.responseType = "blob"
                }
                return config
            },
            error => {
                console.error(`[请求错误]`, error);
                return Promise.reject(error);
            }
        )

        this.axiosInstance.interceptors.response.use(
            response => response,
            async error => {
                console.error(`[响应错误] 状态码: ${error.response?.status}`, {
                    url: error.config?.url,
                    detail: error.response?.data?.detail
                });

                const originalConfig = error.config;

                // 没有响应或配置，不能重试
                if (!error.response || !originalConfig) {
                    console.log('[响应错误] 无响应或配置，无法重试');
                    return Promise.reject(error);
                }

                // 处理401错误 - 检查多种可能的错误信息格式
                if (error.response.status === 401) {
                    console.log('[响应错误] 收到401错误，详情:', error.response.data);

                    // 检查是否已经重试过
                    if (originalConfig._retry) {
                        console.log('[响应错误] 已尝试重试，放弃并跳转到登录页');
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/login';
                        return Promise.reject(error);
                    }

                    // 如果已经在刷新，将请求加入队列
                    if (this.isRefreshing) {
                        console.log('[响应错误] Token正在刷新中，将请求加入队列');
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({
                                resolve,
                                reject,
                                config: originalConfig
                            });
                        });
                    }

                    // 标记请求已重试，开始刷新Token
                    originalConfig._retry = true;
                    this.isRefreshing = true;
                    console.log('[响应错误] 开始刷新Token');

                    try {
                        // 获取refreshToken
                        const refreshToken = localStorage.getItem('refreshToken');
                        if (!refreshToken) {
                            console.error('[响应错误] 没有刷新令牌可用');
                            throw new Error('No refresh token available');
                        }

                        // 调用refresh接口刷新token (使用独立方法避免循环依赖)
                        console.log('[响应错误] 调用refresh接口', { refreshToken: refreshToken });
                        const result = await refreshTokenApiCall(refreshToken, this.config);

                        // 更新localStorage中的token
                        console.log('[响应错误] 刷新token成功，更新存储');
                        localStorage.setItem('token', result.accessToken);
                        localStorage.setItem('refreshToken', result.refreshToken);

                        // 为原始请求设置新token
                        originalConfig.headers["Authorization"] = `Bearer ${result.accessToken}`;

                        // 处理队列中的请求
                        console.log('[响应错误] 处理队列中的请求', this.failedQueue.length);
                        this.processQueue(null);

                        // 重新发送原始请求
                        console.log('[响应错误] 重新发送原始请求', originalConfig.url);
                        return this.axiosInstance.request(originalConfig);
                    } catch (refreshError) {
                        console.error('[响应错误] 刷新token失败');
                        console.error(refreshError);

                        // 刷新token失败，处理队列中的请求（全部拒绝）
                        this.processQueue(refreshError);

                        // 清除token并跳转到登录页
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/login';

                        return Promise.reject(refreshError);
                    } finally {
                        console.log('[响应错误] 刷新token流程结束');
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        )
    }

    processQueue(error: any) {
        console.log(`[处理队列] 处理${this.failedQueue.length}个等待的请求`);
        this.failedQueue.forEach((prom, index) => {
            console.log(`[处理队列] 处理第${index + 1}个请求, URL: ${prom.config.url}`);
            if (error) {
                console.log(`[处理队列] 拒绝请求`);
                prom.reject(error);
            } else {
                console.log(`[处理队列] 重试请求`);
                // 确保每个重试请求都使用最新的token
                const token = localStorage.getItem('token');
                if (token) {
                    prom.config.headers["Authorization"] = `Bearer ${token}`;
                }
                prom.resolve(this.axiosInstance.request(prom.config));
            }
        });

        this.failedQueue = [];
    }

    public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
        console.log(`[请求] 发起请求: ${options.method} ${options.url}`);
        return __request(this.config, options, this.axiosInstance)
    }
}

export const apiClient = new ApiClient({
    WITH_CREDENTIALS: true,
    BASE: "http://localhost:8080",
}, HttpRequestInterceptor)

export const apiService = {
    httpRequest: apiClient.request
}