#!/bin/bash

# Expo 安装和启动脚本

echo "🔍 检查项目目录..."
cd "$(dirname "$0")"
PROJECT_DIR=$(pwd)
echo "✅ 项目目录: $PROJECT_DIR"

echo ""
echo "📦 检查 Expo 依赖..."
if ! npm list expo &>/dev/null; then
    echo "⚠️  Expo 未安装，正在安装..."
    echo ""
    npm install expo@~54.0.0 expo-router@~4.0.0 react-native@0.76.5 react-native-web@~0.19.13 expo-status-bar@~2.0.0 expo-constants@~17.0.0 expo-linking@~7.0.0 expo-splash-screen@~0.29.0 expo-system-ui@~4.0.0 react-native-safe-area-context@4.12.0 react-native-screens@~4.4.0 @react-navigation/native@^6.1.18
    
    echo ""
    echo "📦 安装开发依赖..."
    npm install --save-dev @babel/core@^7.25.0 @types/react@~18.3.0
    
    echo ""
    echo "✅ 依赖安装完成！"
else
    echo "✅ Expo 已安装"
fi

echo ""
echo "🚀 启动 Expo 开发服务器..."
echo "💡 提示：启动后按 'q' 键显示二维码"
echo ""

npx expo start
