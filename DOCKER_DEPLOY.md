# Docker 部署文档

本文档介绍如何使用 Docker 部署 mdLaTeX2Word 项目。

## 准备工作

确保您的服务器已安装：
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 部署步骤

### 1. 构建并启动容器

在项目根目录下，运行以下命令：

```bash
docker-compose up -d --build
```

此命令将：
- 构建后端镜像
- 构建前端镜像并运行编译步骤
- 启动 Nginx 服务提供前端页面
- 将前端的 `/api` 请求转发到后端

### 2. 访问应用

部署完成后，您可以通过以下地址访问应用：

- 前端界面: `http://<服务器IP>:8080`
- 后端 API (内部): `http://backend:3000`

### 3. 查看日志

如果需要查看服务的运行日志，可以使用：

```bash
# 查看所有服务的日志
docker-compose logs -f

# 仅查看后端日志
docker-compose logs -f backend

# 仅查看前端日志
docker-compose logs -f frontend
```

### 4. 停止服务

```bash
docker-compose down
```

## 单独构建镜像

如果您需要分别打包前后端镜像，可以在各自的目录下（或在根目录下指定上下文）运行以下命令：

### 后端镜像单独打包

```bash
# 在项目根目录下执行
docker build -t mdlatex2word-backend ./backend
```

### 前端镜像单独打包

```bash
# 在项目根目录下执行
docker build -t mdlatex2word-frontend ./frontend
```

## 注意事项

- **持久化**: 容器内上传的文件和输出文件分别挂载在宿主机的 `backend/uploads` 和 `backend/outputs` 目录下。
- **端口配置**: 默认前端映射到宿主机的 `8080` 端口。如果需要更改，请修改 `docker-compose.yml` 中的 `ports` 配置。
- **配置优化**: 生产环境下建议通过反向代理（如 Nginx）统一管理端口和 SSL 证书。
