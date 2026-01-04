# mdLaTeX2Word

一个将 Markdown 文件（支持 LaTeX 公式）转换为 Word 文档的全栈 Web 应用。

## 技术栈

**后端 (Backend)**
- Node.js + Express - Web 服务器框架
- Multer - 文件上传处理
- Markdown-it + markdown-it-texmath - Markdown 和 LaTeX 解析
- KaTeX - LaTeX 公式渲染
- docx - Word 文档生成
- Winston - 日志记录

**前端 (Frontend)**
- Vue 3 - 前端框架
- Vite - 构建工具
- Tailwind CSS - 样式框架（深色主题）
- Axios - HTTP 客户端

## 项目结构

```
mdLaTeX2Word
├── backend/                  # 后端服务
│   ├── app.js               # Express 应用入口
│   ├── config.js            # 配置文件
│   ├── controller/          # 控制器
│   │   └── index.js         # 请求处理器
│   ├── model/               # 模型
│   │   └── index.js         # Markdown 转换逻辑
│   ├── routes/              # 路由
│   │   └── index.js         # API 路由定义
│   ├── utils/               # 工具函数
│   │   └── index.js         # 日志、文件清理等
│   ├── uploads/             # 上传文件临时存储（自动创建）
│   ├── outputs/             # 转换后的文件（自动创建）
│   └── logs/                # 日志文件（自动创建）
├── frontend/                # 前端应用
│   ├── src/
│   │   ├── assets/
│   │   │   └── styles/
│   │   │       └── main.css # 全局样式
│   │   ├── components/      # Vue 组件
│   │   │   ├── FileUpload.vue        # 文件上传组件
│   │   │   ├── ConversionStatus.vue  # 转换状态组件
│   │   │   └── DownloadButton.vue    # 下载按钮组件
│   │   ├── App.vue          # 主应用组件
│   │   └── main.js          # 应用入口
│   ├── index.html           # HTML 模板
│   ├── vite.config.js       # Vite 配置
│   ├── tailwind.config.js   # Tailwind 配置
│   └── package.json         # 前端依赖
├── package.json             # 根项目配置
└── README.md
```

## 安装与运行

### 1. 安装依赖

```bash
# 安装所有依赖（前端 + 后端）
npm run install-all

# 或者分别安装
cd backend && npm install
cd ../frontend && npm install
```

### 2. 运行项目

**启动后端服务器：**
```bash
npm run server
# 后端将运行在 http://localhost:3000
```

**启动前端开发服务器：**
```bash
npm run dev
# 前端将运行在 http://localhost:5173
```

### 3. 使用应用

1. 打开浏览器访问 `http://localhost:5173`
2. 拖拽或点击上传 Markdown 文件（支持 .md, .markdown, .tex）
3. 点击"Upload & Convert"按钮
4. 等待转换完成
5. 点击"Download"按钮下载 Word 文档

## API 文档

### 上传文件
```
POST /api/upload
Content-Type: multipart/form-data

参数:
- file: Markdown 或 LaTeX 文件

响应:
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "example_1234567890_abc123.md",
    "originalName": "example.md",
    "size": 1024,
    "path": "/path/to/uploads/example_1234567890_abc123.md"
  }
}
```

### 转换文件
```
POST /api/convert
Content-Type: application/json

参数:
{
  "filename": "example_1234567890_abc123.md"
}

响应:
{
  "success": true,
  "message": "File converted successfully",
  "data": {
    "outputFilename": "example_1234567890_xyz789.docx",
    "downloadUrl": "/api/download/example_1234567890_xyz789.docx"
  }
}
```

### 下载文件
```
GET /api/download/:filename

响应: Word 文档文件流
```

### 健康检查
```
GET /api/health

响应:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-04T02:11:13.000Z"
}
```

## 功能特性

- ✅ 支持 Markdown 文件上传（.md, .markdown, .tex）
- ✅ 支持 LaTeX 数学公式（行内公式 `$...$` 和块级公式 `$$...$$`）
- ✅ 拖拽上传文件
- ✅ 实时转换状态显示
- ✅ 自动文件清理（1小时后删除临时文件）
- ✅ 完整的日志记录
- ✅ 深色主题 UI
- ✅ 响应式设计

## LaTeX 支持示例

支持的 LaTeX 公式示例：

```markdown
# 示例文档

这是一个行内公式：$E=mc^2$

这是一个块级公式：

$$
\int_0^1 x^2 dx = \frac{1}{3}
$$

更复杂的公式：

$$
\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$
```

## 配置说明

### 后端配置 (backend/config.js)

- `port`: 服务器端口（默认 3000）
- `maxFileSize`: 最大文件大小（默认 10MB）
- `allowedExtensions`: 允许的文件扩展名
- `fileMaxAge`: 文件保留时间（默认 1 小时）

### 前端配置 (frontend/vite.config.js)

- 开发服务器端口：5173
- API 代理：自动代理 `/api` 请求到后端

## 注意事项

1. **文件大小限制**：上传文件最大 10MB
2. **文件自动清理**：上传和转换的文件会在 1 小时后自动删除
3. **无需数据库**：所有数据通过日志记录，无需配置数据库
4. **LaTeX 渲染**：LaTeX 公式在 Word 中以斜体文本显示（Word 的 MathML 支持较复杂）

## 开发说明

### 添加新功能

1. **后端**：在 `backend/controller/index.js` 添加新的请求处理器
2. **前端**：在 `frontend/src/components/` 创建新的 Vue 组件

### 日志查看

日志文件位置：
- 所有日志：`backend/logs/combined.log`
- 错误日志：`backend/logs/error.log`
- 控制台：实时彩色输出

## 许可证

MIT
 