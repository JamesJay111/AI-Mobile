#!/bin/bash
# 同步远程更改并推送本地提交

set -e

cd "$(dirname "$0")"

echo "🔄 步骤 1: 拉取远程更改..."
echo ""

# 尝试使用代理（如果有）
if [[ -f "proxy.env" ]]; then
  set -a
  source ./proxy.env
  set +a
  echo "🌐 使用代理配置..."
  git config --global http.https://github.com.proxy "$HTTP_PROXY" 2>/dev/null || true
  git config --global https.https://github.com.proxy "$HTTPS_PROXY" 2>/dev/null || true
fi

# 拉取远程更改
if git fetch origin main; then
  echo "✅ 成功拉取远程更改"
else
  echo "❌ 拉取失败，可能是网络问题"
  echo "请尝试："
  echo "  1. 检查网络连接"
  echo "  2. 配置 VPN 或代理"
  echo "  3. 或手动在 GitHub 网页上解决冲突"
  exit 1
fi

echo ""
echo "🔄 步骤 2: 合并远程更改..."
echo ""

# 使用 rebase 保持历史干净（推荐）
if git rebase origin/main; then
  echo "✅ 成功合并远程更改"
else
  echo ""
  echo "⚠️  Rebase 遇到冲突，正在尝试 merge..."
  git rebase --abort 2>/dev/null || true
  
  # 如果 rebase 失败，使用 merge
  if git merge origin/main --no-edit; then
    echo "✅ 成功合并远程更改（使用 merge）"
  else
    echo ""
    echo "❌ 合并冲突！需要手动解决："
    echo ""
    echo "冲突文件："
    git status --short | grep "^UU\|^AA\|^DD" || git diff --name-only --diff-filter=U
    echo ""
    echo "解决步骤："
    echo "  1. 打开冲突文件，查找 <<<<<<< HEAD 标记"
    echo "  2. 手动解决冲突"
    echo "  3. 运行: git add <冲突文件>"
    echo "  4. 运行: git rebase --continue 或 git commit"
    echo "  5. 然后重新运行此脚本"
    exit 1
  fi
fi

echo ""
echo "📤 步骤 3: 推送到远程..."
echo ""

if git push origin main; then
  echo ""
  echo "✅ 成功推送到 GitHub！"
  echo ""
  echo "🎉 代码已同步，GitHub Actions 将自动触发部署"
else
  echo ""
  echo "❌ 推送失败"
  echo ""
  echo "如果网络问题持续，可以尝试："
  echo "  1. 使用代理脚本: ./git-push-with-proxy.sh origin main"
  echo "  2. 或配置 SSH: git remote set-url origin git@github.com:JamesJay111/AI-Mobile.git"
  exit 1
fi
