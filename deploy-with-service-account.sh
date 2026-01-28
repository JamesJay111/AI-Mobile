#!/bin/bash
# 使用 Service Account 部署，无需 firebase login
# 使用前：创建服务账号密钥，保存为 firebase-deploy-key.json
# 然后运行：./deploy-with-service-account.sh

set -e
cd "$(dirname "$0")"

KEY_FILE="${1:-/Users/niyutong/Desktop/gemgpt-ai-assistance-a5a84f75d924.json}"
if [[ ! -f "$KEY_FILE" ]]; then
  echo "❌ 找不到密钥文件: $KEY_FILE"
  echo "请先在 GCP 创建服务账号并下载 JSON 密钥，保存到项目根目录"
  echo "用法: ./deploy-with-service-account.sh [密钥路径]"
  exit 1
fi

# 使用绝对路径
KEY_FILE_ABS=$(cd "$(dirname "$KEY_FILE")" && pwd)/$(basename "$KEY_FILE")
export GOOGLE_APPLICATION_CREDENTIALS="$KEY_FILE_ABS"

# 若存在 proxy.env，则使用代理（大陆部署时常用）
if [[ -f "proxy.env" ]]; then
  set -a
  source ./proxy.env
  set +a
  echo "🌐 使用代理部署 (HTTP_PROXY/HTTPS_PROXY)"
fi

# 清除 Firebase CLI 登录缓存，否则会优先用旧状态导致认证失败
FIREBASE_CONFIG="$HOME/.config/configstore/firebase-tools.json"
if [[ -f "$FIREBASE_CONFIG" ]]; then
  echo "🧹 清除 Firebase CLI 登录缓存..."
  mv "$FIREBASE_CONFIG" "${FIREBASE_CONFIG}.bak.$(date +%s)" 2>/dev/null || true
fi

# 检查能否访问 storage.googleapis.com（仅提示，不阻断）
echo "🔍 检查与 storage.googleapis.com 的连通性..."
if ! curl -s -o /dev/null --connect-timeout 15 --max-time 25 "https://storage.googleapis.com"; then
  echo "⚠️  无法访问 storage.googleapis.com，上传可能失败（代理未生效或超时）"
  echo "   若部署失败，可改用 Cloud Shell：DEPLOY_VIA_CLOUD_SHELL.md"
  echo ""
else
  echo "✔ 连通性正常"
fi

echo "🔑 使用服务账号密钥: $KEY_FILE_ABS"
echo "📦 检查 Functions 依赖..."
(cd functions && npm install --silent)
echo "🔨 编译 Functions..."
(cd functions && npm run build)

# 不运行 firebase use，直接用 --project 避免触发认证
# CI=1 可减少 CLI 拉取 MOTD/remote config，缓解网络相关警告
export CI=1
echo "🚀 部署 Functions（使用 Service Account）..."
firebase deploy --only functions --project gemgpt-ai-assistance --non-interactive
echo ""
echo "✅ 部署完成！"
firebase functions:list --project gemgpt-ai-assistance --non-interactive 2>/dev/null || true
