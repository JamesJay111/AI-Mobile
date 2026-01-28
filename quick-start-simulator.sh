#!/bin/bash

# 🚀 快速启动 iOS 模拟器脚本

echo "═══════════════════════════════════════════════════"
echo "   📱 快速启动 iOS 模拟器"
echo "═══════════════════════════════════════════════════"
echo ""

# 1. 检查可用的运行时
echo "🔍 检查可用的 iOS 运行时..."
RUNTIMES=$(xcrun simctl list runtimes available 2>/dev/null | grep -i "iOS" | tail -1)

if [ -z "$RUNTIMES" ]; then
    echo "❌ 未找到可用的 iOS 运行时"
    echo ""
    echo "请确保："
    echo "1. 已在 Xcode 中下载 iOS 运行时"
    echo "2. Xcode → Settings → Platforms → 下载 iOS"
    exit 1
fi

echo "✅ 找到运行时："
echo "$RUNTIMES"
echo ""

# 提取运行时标识符（最后一行，格式：iOS 17.2 (17.2 - xxx)）
RUNTIME_NAME=$(echo "$RUNTIMES" | awk '{print $1" "$2}')
RUNTIME_ID=$(echo "$RUNTIMES" | grep -oE '\([^)]+\)' | head -1 | tr -d '()')

echo "使用运行时: $RUNTIME_NAME"
echo ""

# 2. 检查是否已有 iPhone 设备
echo "🔍 检查现有设备..."
EXISTING_DEVICE=$(xcrun simctl list devices available 2>/dev/null | grep -i "iphone" | head -1)

if [ -n "$EXISTING_DEVICE" ]; then
    echo "✅ 找到现有设备："
    echo "$EXISTING_DEVICE"
    DEVICE_ID=$(echo "$EXISTING_DEVICE" | grep -oE '[A-F0-9-]{36}' | head -1)
    DEVICE_NAME=$(echo "$EXISTING_DEVICE" | awk -F'(' '{print $1}' | xargs)
    echo ""
    echo "设备名称: $DEVICE_NAME"
    echo "设备 ID: $DEVICE_ID"
else
    echo "⚠️  未找到现有设备，正在创建..."
    
    # 创建 iPhone 15 设备
    DEVICE_NAME="iPhone 15"
    echo "创建设备: $DEVICE_NAME (使用 $RUNTIME_NAME)..."
    
    DEVICE_ID=$(xcrun simctl create "$DEVICE_NAME" "iPhone 15" "$RUNTIME_ID" 2>/dev/null)
    
    if [ -z "$DEVICE_ID" ]; then
        echo "❌ 创建设备失败"
        echo ""
        echo "请手动操作："
        echo "1. 打开 Simulator: open -a Simulator"
        echo "2. File → New Simulator"
        echo "3. 选择 iPhone 15 和 iOS 版本"
        exit 1
    fi
    
    echo "✅ 设备创建成功: $DEVICE_ID"
fi

echo ""

# 3. 启动设备
echo "🚀 启动设备..."
xcrun simctl boot "$DEVICE_ID" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ 设备已启动"
else
    echo "⚠️  设备可能已经在运行"
fi

echo ""

# 4. 打开 Simulator 应用
echo "📱 打开 Simulator 应用..."
open -a Simulator
sleep 2

echo ""
echo "✅ 完成！"
echo ""
echo "═══════════════════════════════════════════════════"
echo "   ✨ iOS 模拟器已启动"
echo ""
echo "   📋 下一步："
echo "   运行: npm run dev:ios"
echo "   或: npx expo start --ios"
echo "═══════════════════════════════════════════════════"
echo ""
