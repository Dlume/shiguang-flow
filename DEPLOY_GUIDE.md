# 🚀 拾光·心流 - 上线部署指南

**版本**: v2.0  
**日期**: 2026-04-25  
**状态**: ✅ 构建完成，等待部署

---

## 📦 构建结果

### 生产构建
```
✅ 构建成功 (303ms)
✅ 文件已生成到 dist/ 目录
✅ 体积优化完成
```

### 文件清单
```
dist/
├── index.html          (0.65 kB)
├── assets/
│   ├── index-C21w1yIz.css   (30.32 kB / gzip: 6.13 kB)
│   └── index-DWD8phQg.js    (222.64 kB / gzip: 71.40 kB)
├── favicon.svg
├── icons.svg
└── logo.svg
```

---

## 🌐 部署方案

### 方案一：GitHub Pages（推荐）✅

**优点**: 免费、自动 HTTPS、自定义域名支持  
**缺点**: 需要配置 GitHub Token

#### 步骤 1：生成 GitHub Personal Access Token

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选权限：
   - ✅ `repo` (Full control)
   - ✅ `workflow` (Manage GitHub Actions)
4. 点击 "Generate token"
5. **复制 Token**（只显示一次！）

#### 步骤 2：配置 Git

```bash
cd D:\QwenPawOut001\projects\ShiGuang-Flow

# 设置用户名和邮箱
git config user.name "你的 GitHub 用户名"
git config user.email "你的 GitHub 邮箱"

# 使用 Token 推送
git remote set-url origin https://你的用户名:你的Token@github.com/Dlume/shiguang-flow.git
git push -u origin master
```

#### 步骤 3：启用 GitHub Pages

1. 访问 https://github.com/Dlume/shiguang-flow/settings/pages
2. 在 "Source" 中选择 "GitHub Actions"
3. 等待自动部署完成（约 2-3 分钟）
4. 访问你的网站：https://dlume.github.io/shiguang-flow/

---

### 方案二：Vercel（最简单）🚀

**优点**: 一键部署、自动 HTTPS、全球 CDN  
**缺点**: 免费版有构建限制

#### 步骤 1：安装 Vercel CLI

```bash
npm install -g vercel
```

#### 步骤 2：部署

```bash
cd D:\QwenPawOut001\projects\ShiGuang-Flow

# 登录 Vercel
vercel login

# 部署
vercel --prod
```

#### 步骤 3：获取链接

部署完成后会显示类似：
```
https://shiguang-flow-xxxx.vercel.app
```

---

### 方案三：Netlify（推荐）🌐

**优点**: 免费、拖拽部署、自动 HTTPS  
**缺点**: 免费版有流量限制

#### 方法 A：拖拽部署（最简单）

1. 访问 https://app.netlify.com/drop
2. 将 `dist` 文件夹拖拽到页面
3. 立即获得访问链接！

#### 方法 B：CLI 部署

```bash
npm install -g netlify-cli

cd D:\QwenPawOut001\projects\ShiGuang-Flow

# 登录
netlify login

# 部署
netlify deploy --prod --dir=dist
```

---

### 方案四：本地预览（临时）📱

**优点**: 最快、无需部署  
**缺点**: 仅限本地访问

#### 方法 A：使用 Python

```bash
cd D:\QwenPawOut001\projects\ShiGuang-Flow\dist
python -m http.server 8080
```

然后访问：http://localhost:8080

#### 方法 B：使用 Node.js

```bash
cd D:\QwenPawOut001\projects\ShiGuang-Flow
npx serve dist -l 8080
```

然后访问：http://localhost:8080

#### 手机访问

在同一 WiFi 网络下，手机访问：
```
http://你的电脑IP:8080
```

查看你的电脑 IP：
```bash
ipconfig | findstr IPv4
```

---

## 📱 手机访问配置

### 方案 A：局域网访问（推荐测试）

1. 确保手机和电脑在同一 WiFi
2. 获取电脑 IP：`ipconfig | findstr IPv4`
3. 手机浏览器访问：`http://电脑IP:端口`

### 方案 B：公网访问（推荐上线）

使用以下任一服务：
- **GitHub Pages**: https://dlume.github.io/shiguang-flow/
- **Vercel**: https://shiguang-flow.vercel.app
- **Netlify**: https://shiguang-flow.netlify.app

### 方案 C：Ngrok 隧道（临时公网）

```bash
# 下载 Ngrok
https://ngrok.com/download

# 启动本地服务
npx serve dist -l 8080

# 创建隧道
ngrok http 8080
```

获得公网链接：`https://xxxx.ngrok.io`

---

## 🔧 部署后验证

### 1. 检查清单

- [ ] 网站能正常访问
- [ ] 页面加载速度 < 3 秒
- [ ] 移动端适配正常
- [ ] 所有功能正常工作
- [ ] HTTPS 证书有效
- [ ] Logo 和图标显示正常

### 2. 手机测试

```bash
# 使用浏览器开发者工具模拟手机
# 或直接用手机浏览器访问
```

### 3. 性能测试

访问 https://pagespeed.web.dev/ 输入你的网址测试

---

## 🎯 推荐方案

### 快速上线（5 分钟）
👉 **Netlify 拖拽部署**  
1. 打开 https://app.netlify.com/drop
2. 拖拽 `dist` 文件夹
3. 获得链接，手机访问！

### 长期稳定（推荐）
👉 **GitHub Pages**  
1. 配置 GitHub Token
2. 推送代码
3. 启用 GitHub Actions 部署
4. 获得永久链接

### 最快预览（1 分钟）
👉 **本地预览**  
```bash
cd D:\QwenPawOut001\projects\ShiGuang-Flow\dist
python -m http.server 8080
```
手机访问：`http://电脑IP:8080`

---

## 📞 需要帮助？

如果遇到部署问题，请提供：
1. 使用的部署方案
2. 错误信息截图
3. 控制台输出

我会帮你解决！

---

*九子智囊系统 · 部署指南*  
*生成时间：2026-04-25*  
*状态：✅ 构建完成，等待部署*
