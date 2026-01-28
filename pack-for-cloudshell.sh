#!/bin/bash
# 打包项目用于 Google Cloud Shell 部署（排除本地依赖与敏感文件）
# 用法: ./pack-for-cloudshell.sh
# 生成 deploy-cloudshell.zip，上传到 Cloud Shell 后解压并按 DEPLOY_VIA_CLOUD_SHELL.md 操作。

set -e
cd "$(dirname "$0")"

OUT="deploy-cloudshell.zip"
echo "📦 打包项目为 $OUT ..."

zip -r "$OUT" . \
  -x "node_modules/*" \
  -x "functions/node_modules/*" \
  -x ".git/*" \
  -x "functions/lib/*" \
  -x "build/*" \
  -x "dist/*" \
  -x ".expo/*" \
  -x "web-build/*" \
  -x ".firebase/*" \
  -x "*.log" \
  -x "firebase-debug*" \
  -x "ui-debug*" \
  -x "firestore-debug*" \
  -x ".env*" \
  -x "proxy.env" \
  -x "functions/src/config.ts" \
  -x "firebase-deploy-key.json" \
  -x "*-deploy-key.json" \
  -x "*.db" \
  -x "deploy-cloudshell.zip" \
  -x "*.pid" \
  -x ".DS_Store" \
  -x "*.swp" \
  -x "*.swo" \
  -x ".cursor/*" \
  -x ".vscode/*" \
  -x ".idea/*" \
  -x "logs/*" \
  -x "*.jks" \
  -x "*.p8" \
  -x "*.p12" \
  -x "*.key" \
  -x "*.mobileprovision" \
  -x "*.orig.*"

echo "✔ 已生成 $OUT"
echo ""
echo "下一步："
echo "  1. 打开 Google Cloud Shell："
echo "     https://console.cloud.google.com/cloudshell?project=gemgpt-ai-assistance"
echo "  2. 上传 $OUT 与 服务账号密钥 JSON"
echo "  3. 按 DEPLOY_VIA_CLOUD_SHELL.md 执行部署"
