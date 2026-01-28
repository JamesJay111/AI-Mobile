#!/bin/bash

# Expo 启动脚本（已修复所有错误）

echo "🔍 检查项目目录..."
cd "$(dirname "$0")"
PROJECT_DIR=$(pwd)
echo "✅ 项目目录: $PROJECT_DIR"

echo ""
echo "🛑 停止占用端口的进程..."
lsof -ti:8081,19000,19001 2>/dev/null | xargs kill -9 2>/dev/null
echo "✅ 端口已清理"

echo ""
echo "🚀 启动 Expo 开发服务器..."
echo "💡 提示："
echo "   - 启动后按 'q' 键显示二维码"
echo "   - 按 'w' 键在浏览器中打开"
echo "   - 按 'r' 键重新加载"
echo ""

npx expo start --clear
