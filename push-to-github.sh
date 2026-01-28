#!/bin/bash

# 设置代理（如需要，将 USER:PASS@HOST:PORT 换成你的代理）
# export https_proxy=http://USER:PASS@HOST:PORT
# export http_proxy=http://USER:PASS@HOST:PORT

# GitHub token（勿提交真实 token）用法: GITHUB_TOKEN=ghp_xxx ./push-to-github.sh
TOKEN="${GITHUB_TOKEN:-}"
REPO_URL="https://github.com/JamesJay111/AI-Mobile.git"
[[ -z "$TOKEN" ]] && echo "请设置 GITHUB_TOKEN，例如: GITHUB_TOKEN=ghp_xxx ./push-to-github.sh" && exit 1

# 切换到项目目录
cd "/Users/niyutong/Desktop/AI聚合器开发方式Two"

# 添加所有未跟踪的文件（可选）
echo "检查未跟踪的文件..."
git status

# 使用 token 推送
echo "正在推送到 GitHub..."
git push "https://${TOKEN}@github.com/JamesJay111/AI-Mobile.git" main:main

# 如果上面的命令失败，尝试不使用代理
if [ $? -ne 0 ]; then
    echo "使用代理推送失败，尝试不使用代理..."
    unset https_proxy
    unset http_proxy
    git push "https://${TOKEN}@github.com/JamesJay111/AI-Mobile.git" main:main
fi

echo "完成！"
