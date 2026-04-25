# 🔑 GitHub 推送认证 - 快速解决

当前无法推送到 GitHub，因为需要认证。请选择以下任一方法：

---

## 方法 1：使用 GitHub CLI 重新登录（推荐）

**在命令行执行：**

```bash
# 清除环境变量（临时）
set GITHUB_TOKEN=

# 重新登录
gh auth login -h github.com -p https -w
```

这会打开浏览器让你登录，完成后即可推送。

---

## 方法 2：手动添加 SSH Key

**步骤：**

1. 访问：https://github.com/settings/keys
2. 点击 **"New SSH key"**
3. Title: `QwenPaw-PC`
4. Key: 复制下面的内容：
   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEPfUZYgg9UWDj0nwEcQcyg4Q743VlsqzTdj2ErSKiU7
   ```
5. 点击 **"Add SSH key"**
6. 回到命令行执行：
   ```bash
   cd D:\QwenPawOut001\projects\ShiGuang-Flow
   git push -u origin master
   ```

---

## 方法 3：使用 Personal Access Token

**步骤：**

1. 访问：https://github.com/settings/tokens
2. 点击 **"Generate new token (classic)"**
3. Note: `QwenPaw-Deploy`
4. 勾选：✅ `repo`、✅ `workflow`
5. 点击 **"Generate token"**
6. 复制 Token
7. 执行：
   ```bash
   cd D:\QwenPawOut001\projects\ShiGuang-Flow
   git remote set-url origin https://你的用户名:你的Token@github.com/Dlume/shiguang-flow.git
   git push -u origin master
   ```

---

## 方法 4：使用 GitHub Desktop

1. 下载：https://desktop.github.com/
2. 安装并登录
3. Clone `Dlume/shiguang-flow`
4. 把本地代码复制进去
5. Commit & Push

---

**推荐方法 2（SSH Key）**，配置一次永久使用！
