#!/bin/bash

# GemGPT 开发服务器启动脚本
# 用于快速启动实时预览开发环境

echo "🚀 Starting GemGPT Development Server..."
echo ""
echo "📱 Preview will open at: http://localhost:3000"
echo "💡 Keep this terminal open while developing"
echo "🔄 Changes will auto-reload in browser"
echo ""

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo ""
fi

# 启动开发服务器
npm run dev
