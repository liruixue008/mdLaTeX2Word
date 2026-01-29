# mdLaTeX2Word

一个将 Markdown 文件（支持 LaTeX 公式）转换为 Word 文档的全栈 Web 应用。

## 技术栈

**后端 (Backend)**
- Python + FastAPI - Web 服务器框架
- Markdown-it + markdown-it-texmath - Markdown 和 LaTeX 解析
- KaTeX - LaTeX 公式渲染
- python-docx - Word 文档生成

**前端 (Frontend)**
- Vue 3 - 前端框架
- Vue Router 4 - 路由管理
- Vite - 构建工具
- Tailwind CSS - 样式框架（支持深色/浅色主题）
- Axios - HTTP 客户端
- Markdown-it + markdown-it-texmath - 实时预览解析
- KaTeX - 实时预览公式渲染
- Turndown - HTML 到 Markdown 转换（智能粘贴）

## 项目结构

```
mdLaTeX2Word
├── backend/                  # 后端服务
│   ├── app.py               # FastAPI 应用入口
│   ├── uploads/             # 上传文件临时存储（自动创建）
│   └── outputs/             # 转换后的文件（自动创建）
├── frontend/                # 前端应用
│   ├── src/
│   │   ├── assets/
│   │   │   └── styles/
│   │   │       └── main.css # 全局样式
│   │   ├── components/      # Vue 组件
│   │   │   ├── FileUpload.vue        # 文件上传组件
│   │   │   ├── ConversionStatus.vue  # 转换状态组件
│   │   │   └── ThemeToggle.vue       # 主题切换组件
│   │   ├── router/          # 路由配置
│   │   │   └── index.js
│   │   ├── views/           # 页面视图
│   │   │   ├── HomeView.vue          # 首页
│   │   │   └── EditorView.vue        # 在线编辑器（支持智能粘贴）
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

**后端依赖：**
```bash
cd backend
pip install -r requirements.txt
```

**前端依赖：**
```bash
cd frontend
npm install
```

### 2. 运行项目

**启动后端服务器：**
```bash
cd backend
python app.py
# 后端将运行在 http://localhost:8000
```

**启动前端开发服务器：**
```bash
cd frontend
npm run dev
# 前端将运行在 http://localhost:5173
```

### 3. 使用应用

1. 打开浏览器访问 `http://localhost:5173`
2. **选择功能**：
   - **离线转换**：点击首页的上传区域，拖拽或上传 Markdown 文件（支持 .md, .markdown），点击 "Upload & Convert"。
   - **在线编辑**：点击首页的 "Try Online Editor" 或导航栏中的 "Online Editor"，进入实时预览编辑器。
3. **导出文件**：在编辑器中完成编辑后，点击右上角的 "Export to Word" 按钮即可下载生成的 .docx 文件。

## 功能特性

### 核心功能

- ✅ 支持 Markdown 文件上传（.md, .markdown）
- ✅ 支持 LaTeX 数学公式（行内公式 `$...$` 和块级公式 `$$...$$`）
- ✅ **在线实时预览编辑器**（左右分栏，实时渲染）
- ✅ **在线编辑内容直接导出为 Word**
- ✅ 拖拽上传文件
- ✅ 实时转换状态显示
- ✅ 深色/浅色主题切换
- ✅ 响应式设计（支持移动端）
- ✅ 同步滚动（编辑器与预览联动）

### ⭐ 智能粘贴功能

在线编辑器支持智能粘贴，能够自动检测剪贴板内容并进行适当处理：

#### 工作原理

1. **检测 LaTeX 公式**
   - 自动检测剪贴板中的 HTML 内容是否包含 LaTeX 公式
   - 支持多种 LaTeX 格式：`$...$`、`$$...$$`、`\(...\)`、`\[...\]`、MathML 标签
   - 识别常见 LaTeX 命令：`\frac`、`\sqrt`、`\int`、`\sum`、`\begin{equation}` 等

2. **智能处理策略**
   - **不含 LaTeX**：直接粘贴纯文本，忽略所有 HTML 格式
   - **包含 LaTeX**：将 HTML 转换为 Markdown 格式，保留公式和基本格式

3. **自动修复转义问题**
   - 修复双重转义的反斜杠：`\\sqrt` → `\sqrt`
   - 修复被转义的方括号：`\[` → `[`、`\]` → `]`
   - 确保 LaTeX 公式在编辑器中正确显示

#### 支持的场景

✅ **从 Word/Google Docs 复制包含公式的内容**
```
输入：二次方程 $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
粘贴后：二次方程 $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
```

✅ **区间表示**
```
输入：$\exists x \in [-1, 3]$
粘贴后：$\exists x \in [-1, 3]$
```

✅ **矩阵和复杂公式**
```
输入：$A = [a_{ij}]_{m \times n}$
粘贴后：$A = [a_{ij}]_{m \times n}$
```

✅ **块级公式**
```
输入：$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$
粘贴后：$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$
```

#### 技术细节

- **HTML 转 Markdown**：使用 Turndown 库进行转换
- **LaTeX 检测**：正则表达式匹配多种 LaTeX 模式
- **转义修复**：后处理阶段修复 Markdown 转义导致的问题
- **性能优化**：轻量级处理，不影响编辑体验

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

区间表示：

$\exists x \in [-1, 3]$

矩阵：

$$
A = \begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$
```

## API 文档

### 上传文件
```
POST /api/upload
Content-Type: multipart/form-data

参数:
- file: Markdown 文件

响应:
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "example_1234567890.md",
    "originalName": "example.md"
  }
}
```

### 转换文件
```
POST /api/convert
Content-Type: application/json

参数:
{
  "filename": "example_1234567890.md"
}

响应:
{
  "success": true,
  "message": "File converted successfully",
  "data": {
    "outputFilename": "example_1234567890.docx",
    "downloadUrl": "/api/download/example_1234567890.docx"
  }
}
```

### 直接内容转换
```
POST /api/convert-content
Content-Type: application/json

参数:
{
  "content": "# Markdown Content",
  "filename": "output.docx"
}

响应:
{
  "success": true,
  "message": "Content converted successfully",
  "data": {
    "outputFilename": "output_1234567890.docx",
    "downloadUrl": "/api/download/output_1234567890.docx"
  }
}
```

### 下载文件
```
GET /api/download/:filename

响应: Word 文档文件流
```

## 使用技巧

### 在线编辑器

1. **实时预览**：左侧编辑，右侧实时预览渲染效果
2. **同步滚动**：编辑器和预览区域自动同步滚动位置
3. **智能粘贴**：
   - 从 Word/Google Docs 复制内容时，自动检测并处理 LaTeX 公式
   - 不含公式的富文本会自动转为纯文本
   - 公式中的特殊字符自动修复（反斜杠、方括号等）
4. **主题切换**：点击右上角的主题按钮切换深色/浅色模式
5. **导出 Word**：编辑完成后点击 "Export to Word" 直接下载

### 粘贴最佳实践

- **复制包含公式的内容**：直接从 Word、Google Docs 等富文本编辑器复制，智能粘贴会自动处理
- **复制纯文本**：从代码编辑器或纯文本编辑器复制，会保持原样
- **复制格式化文本（无公式）**：会自动转为纯文本，去除所有格式

## 注意事项

1. **文件大小限制**：上传文件最大 10MB
2. **LaTeX 渲染**：LaTeX 公式在 Word 中会被转换为文本格式
3. **浏览器兼容性**：建议使用 Chrome、Firefox、Edge 等现代浏览器
4. **粘贴权限**：首次粘贴时浏览器可能会请求剪贴板访问权限

## 开发说明

### 添加新功能

1. **后端**：在 `backend/app.py` 添加新的 API 端点
2. **前端**：在 `frontend/src/components/` 创建新的 Vue 组件

### 调试智能粘贴

在浏览器控制台中可以查看粘贴处理的详细信息：
```javascript
// 查看剪贴板内容
navigator.clipboard.read().then(items => {
  items.forEach(item => {
    console.log(item.types)
  })
})
```

## 更新日志

### v1.1.0 (2026-01-29)
- ✨ 新增智能粘贴功能
- ✨ 自动检测和处理 LaTeX 公式
- 🐛 修复 LaTeX 公式中反斜杠双重转义问题
- 🐛 修复方括号在 LaTeX 公式中被错误转义的问题
- 💄 优化编辑器同步滚动体验
- 💄 改进主题切换功能

### v1.0.0
- 🎉 初始版本发布
- ✨ 支持 Markdown 转 Word
- ✨ 支持 LaTeX 公式渲染
- ✨ 在线编辑器
- ✨ 实时预览

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题或建议，请通过 GitHub Issues 联系。
