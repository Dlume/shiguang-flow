# 🔧 启用 GitHub Pages - 解决部署错误

**错误信息**: Failed to create deployment (status: 404)  
**原因**: GitHub Pages 未启用  
**解决**: 2 分钟手动启用

---

## 📋 操作步骤

### 步骤 1：打开 Pages 设置

**访问**: https://github.com/Dlume/shiguang-flow/settings/pages

### 步骤 2：找到 Build and deployment

向下滚动页面，找到 **"Build and deployment"** 部分

### 步骤 3：配置 Source

在 **"Source"** 选项：
- 点击下拉框
- 选择：**GitHub Actions** ✅

**注意**: 不要选择 "Deploy from a branch"

### 步骤 4：保存

点击 **Save** 按钮

---

## 🔄 保存后重新部署

保存后，部署会自动触发，或者手动触发：

1. 访问：https://github.com/Dlume/shiguang-flow/actions
2. 点击 **"Deploy to GitHub Pages"**
3. 点击 **"Run workflow"**
4. 选择 **master**
5. 点击 **"Run workflow"**

---

## ✅ 部署成功标志

- Actions 页面显示 🟢 绿色勾
- 可以访问：https://dlume.github.io/shiguang-flow/
- 手机浏览器测试通过

---

## 📞 完成后

启用 GitHub Pages 后回复我，我会帮你：
1. 重新触发部署
2. 监控部署状态
3. 验证网站访问

---

*九子智囊系统 · 部署指南*
