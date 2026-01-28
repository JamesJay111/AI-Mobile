#!/bin/bash
# 通过 proxy.env 配置的代理推送代码到 GitHub，解决大陆网络 Recv failure / timeout
# 用法:
#   ./git-push-with-proxy.sh origin main
#   GITHUB_TOKEN=ghp_xxx ./git-push-with-proxy.sh origin main   # 使用 PAT（含 workflow 权限）

set -e
cd "$(dirname "$0")"

if [[ -z "$SKIP_PROXY" ]] && [[ -f "proxy.env" ]]; then
  set -a
  source ./proxy.env
  set +a
  echo "🌐 为 Git 设置 GitHub 代理..."
  git config --global http.https://github.com.proxy "$HTTP_PROXY"
  git config --global https.https://github.com.proxy "$HTTPS_PROXY"
  git config --global http.postBuffer 524288000
elif [[ -z "$SKIP_PROXY" ]]; then
  git config --global http.postBuffer 524288000
  echo "⚠️  未找到 proxy.env，跳过代理（若遇 timeout 可配置 proxy.env 或开 VPN）"
fi

CLEAN_ORIGIN=""
if [[ -n "$GITHUB_TOKEN" ]]; then
  ORIGIN="$(git remote get-url origin)"
  if [[ "$ORIGIN" =~ github\.com[:/]([^/]+/[^/]+?)(\.git)?$ ]]; then
    REPO="${BASH_REMATCH[1]}"
    REPO="${REPO%.git}"
    CLEAN_ORIGIN="https://github.com/${REPO}.git"
    git remote set-url origin "https://${GITHUB_TOKEN}@github.com/${REPO}.git"
    echo "🔑 已使用 GITHUB_TOKEN 设置 origin"
  fi
fi

echo "📤 推送中..."
git push "$@"
PUSH_EXIT=$?

if [[ -n "$CLEAN_ORIGIN" ]]; then
  git remote set-url origin "$CLEAN_ORIGIN"
  echo "🔒 已恢复 origin 为不含 token 的 URL"
fi

exit $PUSH_EXIT
