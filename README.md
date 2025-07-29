## AI Modeling Server

> 后端工程地址：[AI Modeling Backend](https://github.com/WindStation/AiModelingServer)

### 项目说明 Introduction

**AI Modeling**是一款利用 *LLM能力* 和 *PlantUML* 构建的软件建模辅助工具，为开发者提供一个“需求→自动建模→预览→优化→管理”的完整工作流。若您对PlantUML很熟悉，也可以手动编辑代码。

### 前端工程详情 Frontend (this repo)

本仓库存储了AI Modeling的前端代码。


#### 环境、依赖 Env/Deps

- node v20+ (npm v10+)

#### 构建 Build

1. LLM相关配置。本项目利用了在线大模型服务，需要配置环境变量（详见`nuxt.config.ts`文件）。 
> 例如，使用DeepSeek官方的API Key，则在环境变量中存储`NUXT_DS_APIKEY_OFFICIAL`，并修改`server/api/chat.post.ts`(Line 13)使用指定的环境变量值作为API Key。

> 涉及到Nuxt与环境变量的内容，请详阅[文档](https://nuxt.com/docs/3.x/guide/going-further/runtime-config)。

2. 下载依赖。
```bash
npm install
```

3. 启动项目。**请注意，本项目使用的`Nuxt UI Pro`框架需要购买License才能用于生产环境。** 详阅：[Nuxt UI License](https://ui.nuxt.com/getting-started/license)
```bash
npm run dev
```
