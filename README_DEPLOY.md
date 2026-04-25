# 🎉 拾光·心流 v2.0 - 部署到 GitHub Pages

**状态**: ⏳ 等待启用 GitHub Actions  
**最后更新**: 2026-04-25 22:40

---

## 📊 部署进度

```
████████████████████░░░░░░░░ 60%

✅ 代码构建完成
✅ 代码推送到 GitHub
✅ SSH Key 配置完成
✅ 部署 Workflow 创建
⏳ 等待启用 GitHub Actions
⏳ 等待部署完成
⏳ 网站上线
```

---

## 🚀 立即完成部署（2 分钟）

### 步骤 1：打开 GitHub Actions 页面

**点击这里**: https://github.com/Dlume/shiguang-flow/actions/workflows/deploy.yml

### 步骤 2：触发部署

在打开的页面上：

1. 找到右侧的 **"Run workflow"** 按钮
2. 点击它
3. 确认 branch 是 **master**
4. 再次点击 **"Run workflow"**

### 步骤 3：等待部署完成

- ⏱️ 预计时间：2-3 分钟
- 🟡 黄色 = 运行中
- 🟢 绿色 = 成功
- 🔴 红色 = 失败（查看日志）

### 步骤 4：访问你的网站

部署成功后访问：
```
https://dlume.github.io/shiguang-flow/
```

---

## 📱 手机访问

部署完成后，用手机浏览器打开：
```
https://dlume.github.io/shiguang-flow/
```

测试以下功能：
- ✅ 页面加载
- ✅ 创建笔记
- ✅ 查看笔记（按周/月分组）
- ✅ 编辑/删除笔记
- ✅ 数据导出/导入
- ✅ 每日卦象显示

---

## 🔍 检查部署状态

### 方法 1：Actions 页面
https://github.com/Dlume/shiguang-flow/actions

查看最新的 workflow 运行状态。

### 方法 2：API 查询
```bash
curl -s https://api.github.com/repos/Dlume/shiguang-flow/actions/runs?per_page=1
```

### 方法 3：直接访问网站
https://dlume.github.io/shiguang-flow/

如果能看到页面，说明部署成功！

---

## ⚙️ 配置 Pages（可选，推荐）

除了手动触发，还可以配置自动部署：

1. 打开：https://github.com/Dlume/shiguang-flow/settings/pages
2. **Source**: 选择 **GitHub Actions**
3. 保存

这样每次 `git push` 都会自动部署！

---

## 📦 本地预览（临时）

在等待部署时，可以用本地预览：

```bash
cd D:\QwenPawOut001\projects\ShiGuang-Flow\dist
npx serve . -l 8080
```

访问：
- 电脑：http://localhost:8080
- 手机：http://192.168.1.4:8080

---

## 🎯 快速链接

| 用途 | 链接 |
|------|------|
| GitHub 仓库 | https://github.com/Dlume/shiguang-flow |
| Actions 页面 | https://github.com/Dlume/shiguang-flow/actions |
| 触发部署 | https://github.com/Dlume/shiguang-flow/actions/workflows/deploy.yml |
| Pages 设置 | https://github.com/Dlume/shiguang-flow/settings/pages |
| 部署后访问 | https://dlume.github.io/shiguang-flow/ |
| 本地预览 | http://192.168.1.4:8080 |

---

## 📞 需要帮助？

如果遇到问题：

1. **部署失败**: 查看 Actions 日志
2. **404 错误**: 等待 2 分钟缓存刷新
3. **空白页面**: 检查浏览器控制台错误
4. **无法访问**: 清除浏览器缓存

---

## ✅ 部署检查清单

- [ ] 代码已推送 ✅
- [ ] 打开 Actions 页面
- [ ] 点击 "Run workflow"
- [ ] 等待部署完成（2-3 分钟）
- [ ] 访问 https://dlume.github.io/shiguang-flow/
- [ ] 手机测试通过

---

*九子智囊系统 · 部署指南*  
*生成时间：2026-04-25T22:40:00+08:00*  
*状态：等待启用 GitHub Actions*
