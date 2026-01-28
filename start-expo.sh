#!/bin/bash

# Expo启动脚本 - 显示二维码

echo "🚀 启动Expo开发服务器..."
echo "📱 SDK版本: 54"
echo ""

# 检查是否安装了expo
if ! command -v expo &> /dev/null; then
    echo "⚠️  Expo CLI未安装，正在安装..."
    npm install -g @expo/cli
fi

# 检查node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 启动Expo并显示二维码
echo "✅ 启动Expo开发服务器（显示二维码）..."
echo ""
echo "💡 提示："
echo "   - 扫描二维码在手机上打开应用"
echo "   - 按 'w' 键在浏览器中打开"
echo "   - 按 'a' 键在Android模拟器中打开"
echo "   - 按 'i' 键在iOS模拟器中打开"
echo "   - 按 'r' 键重新加载应用"
echo "   - 按 'q' 键显示/隐藏二维码"
echo ""

npx expo start --qr
