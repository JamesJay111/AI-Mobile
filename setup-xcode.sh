#!/bin/bash

# Xcode 配置脚本 - 用于 Expo iOS 开发

echo "🔍 检查 Xcode 安装..."

# 检查 Xcode 是否存在
if [ ! -d "/Applications/Xcode.app" ]; then
    echo "❌ 错误: 未找到 Xcode.app"
    echo "请确保 Xcode 已安装在 /Applications/Xcode.app"
    exit 1
fi

echo "✅ 找到 Xcode.app"

# 切换到 Xcode 开发者目录
echo ""
echo "🔧 配置 Xcode 命令行工具..."
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer

if [ $? -eq 0 ]; then
    echo "✅ Xcode 命令行工具配置成功"
else
    echo "❌ 配置失败，可能需要管理员权限"
    exit 1
fi

# 验证配置
echo ""
echo "🔍 验证配置..."
CURRENT_PATH=$(xcode-select -p)
echo "当前开发者目录: $CURRENT_PATH"

if [[ "$CURRENT_PATH" == *"Xcode.app"* ]]; then
    echo "✅ 配置正确"
else
    echo "❌ 配置可能不正确"
    exit 1
fi

# 检查 Xcode 版本
echo ""
echo "📦 检查 Xcode 版本..."
xcodebuild -version

# 接受许可协议（如果需要）
echo ""
echo "📋 检查 Xcode 许可协议..."
if ! xcodebuild -license check 2>/dev/null; then
    echo "⚠️  需要接受 Xcode 许可协议"
    echo "请运行: sudo xcodebuild -license accept"
    echo "或者打开 Xcode 并接受许可协议"
fi

echo ""
echo "✅ Xcode 配置完成！"
echo ""
echo "🚀 下一步："
echo "   1. 如果提示需要接受许可协议，运行: sudo xcodebuild -license accept"
echo "   2. 重新启动 Expo: npx expo start --ios"
echo "   3. 或者在 Expo 终端中按 'i' 键打开 iOS 模拟器"
