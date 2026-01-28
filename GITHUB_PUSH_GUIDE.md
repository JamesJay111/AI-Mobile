# GitHub 推送指南

## 当前状态
- 本地仓库：`AI聚合器开发方式Two`
- 目标仓库：`https://github.com/JamesJay111/AI-Mobile`
- GitHub Token：已配置

## 问题
当前遇到网络连接问题，代理服务器 `23.95.150.145:6114` 无法连接。

## 解决方案

### 方案 1：修复代理连接后推送

1. **检查代理是否可用**（将 `USER:PASS@HOST:PORT` 换成你的代理）：
```bash
curl -I --proxy http://USER:PASS@HOST:PORT https://github.com
```

2. **如果代理可用，使用以下命令推送**（将 `YOUR_GITHUB_TOKEN` 换成你的 PAT）：
```bash
cd "/Users/niyutong/Desktop/AI聚合器开发方式Two"
git push https://YOUR_GITHUB_TOKEN@github.com/JamesJay111/AI-Mobile.git main:main
```

### 方案 2：临时禁用代理推送

如果代理不可用，可以临时禁用代理：

```bash
cd "/Users/niyutong/Desktop/AI聚合器开发方式Two"

# 方法 A：使用环境变量覆盖（YOUR_GITHUB_TOKEN 换成你的 PAT）
NO_PROXY=github.com git -c http.proxy= -c https.proxy= push https://YOUR_GITHUB_TOKEN@github.com/JamesJay111/AI-Mobile.git main:main

# 方法 B：修改本地 git 配置（如果权限允许）
git config --local --unset http.https://github.com.proxy
git config --local --unset https.https://github.com.proxy
git push https://YOUR_GITHUB_TOKEN@github.com/JamesJay111/AI-Mobile.git main:main
```

### 方案 3：使用 SSH 方式（推荐，如果已配置 SSH key）

1. **检查是否已有 SSH key**：
```bash
ls -la ~/.ssh/id_*.pub
```

2. **如果没有，生成 SSH key**：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

3. **添加 SSH key 到 GitHub**：
   - 复制公钥：`cat ~/.ssh/id_ed25519.pub`
   - 在 GitHub 设置中添加 SSH key

4. **修改远程仓库 URL 为 SSH**：
```bash
cd "/Users/niyutong/Desktop/AI聚合器开发方式Two"
git remote set-url origin git@github.com:JamesJay111/AI-Mobile.git
git push -u origin main
```

### 方案 4：使用 GitHub CLI

如果安装了 GitHub CLI：

```bash
gh auth login --with-token <<< "YOUR_GITHUB_TOKEN"
cd "/Users/niyutong/Desktop/AI聚合器开发方式Two"
git push origin main
```

## 当前代码状态

- 最新提交：`3ea0089 chore: initial project + Firebase (add workflow via GitHub UI)`
- 分支：`main`
- 未跟踪文件：`.github/`, `push-to-github.sh`

## 注意事项

1. **Token 安全**：GitHub token 已包含在命令中，推送成功后建议：
   - 在 GitHub 上撤销旧 token
   - 生成新 token
   - 使用更安全的方式（SSH 或 credential helper）

2. **代理配置**：如果经常需要推送，建议：
   - 确保代理服务器稳定可用
   - 或配置 SSH 方式避免代理问题

3. **未跟踪文件**：如果需要提交未跟踪的文件：
```bash
git add .
git commit -m "Add untracked files"
git push ...
```
