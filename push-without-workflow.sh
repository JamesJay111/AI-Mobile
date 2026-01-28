#!/bin/bash
# 先推送不含 workflow 的提交（避免 PAT workflow scope），再在 GitHub 网页添加 workflow
# 用法: GITHUB_TOKEN=ghp_xxx ./push-without-workflow.sh

set -e
cd "$(dirname "$0")"

ROOT=$(git rev-list --max-parents=0 HEAD 2>/dev/null || true)
if [[ -z "$ROOT" ]]; then
  echo "❌ 无法定位初始提交"
  exit 1
fi

echo "📌 合并为单提交并排除 .github/workflows/deploy-functions.yml ..."
git reset --soft "$ROOT"
git add -A
git rm --cached .github/workflows/deploy-functions.yml 2>/dev/null || true
git status -s | head -30
echo "   ..."
if git diff --cached --quiet 2>/dev/null; then
  echo "❌ 无变更可提交（可能 workflow 已排除且无其他改动）。请检查 git status。"
  exit 1
fi
git commit -m "chore: initial project + Firebase (add workflow via GitHub UI)"

echo ""
echo "📤 推送中..."
if [[ -n "$GITHUB_TOKEN" ]]; then
  GITHUB_TOKEN="$GITHUB_TOKEN" ./git-push-with-proxy.sh origin main
else
  git push origin main
fi

echo ""
echo "✅ 推送完成。下一步在 GitHub 网页添加 workflow："
echo "   1. 打开 https://github.com/JamesJay111/AI-Mobile/new/main?filename=.github/workflows/deploy-functions.yml"
echo "   2. 复制 .github/workflows/deploy-functions.yml 内容粘贴进网页"
echo "   3. 点 Commit to main"
echo "   4. 到 Actions 页 Run workflow 或等 push 触发部署"
