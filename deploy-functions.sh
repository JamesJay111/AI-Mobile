#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "📦 检查 Functions 依赖..."
(cd functions && npm install --silent)
echo "🔨 编译 Functions..."
(cd functions && npm run build)
echo "🚀 部署 Functions..."
firebase deploy --only functions

echo ""
echo "✅ 部署完成！"
firebase functions:list
