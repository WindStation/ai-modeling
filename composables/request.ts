import { ApiClient, BaseHttpRequest, CancelablePromise, type OpenAPIConfig } from "~/api";
import axios from "axios";
import type { ApiRequestOptions } from "~/api/core/ApiRequestOptions";
import { request as __request } from "~/api/core/request";

export class HttpRequestInterceptor extends BaseHttpRequest {
    axiosInstance = axios.create()

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
                console.error(`Request error`);
                console.error(error)

                return Promise.reject(error);
            }
        )

        this.axiosInstance.interceptors.response.use(
            response => response,
            error => {
                console.error(`Response error`);
                console.error(error)
                if (error.response?.status === 401 && error.response?.data["detail"] == "Full authentication is required to access this resource") {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        )
    }

    public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
        console.log(`Request interceptor: ${JSON.stringify(options)}`);
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