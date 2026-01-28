#!/bin/bash

# 🔧 修复 iOS 模拟器问题

echo "🔧 修复 iOS 模拟器问题..."
echo ""

# 1. 停止所有模拟器相关进程
echo "1️⃣ 停止模拟器进程..."
killall Simulator 2>/dev/null
killall com.apple.CoreSimulator.CoreSimulatorService 2>/dev/null
killall com.apple.CoreSimulator.SimDeviceService 2>/dev/null
sleep 2
echo "✅ 完成"
echo ""

# 2. 重启 CoreSimulatorService
echo "2️⃣ 重启 CoreSimulatorService..."
sudo killall -9 com.apple.CoreSimulator.CoreSimulatorService 2>/dev/null
sleep 2
echo "✅ 完成"
echo ""

# 3. 检查可用的模拟器设备
echo "3️⃣ 检查可用的 iOS 模拟器..."
DEVICES=$(xcrun simctl list devices available 2>/dev/null | grep -i "iphone" | head -1)

if [ -z "$DEVICES" ]; then
    echo "⚠️  未找到可用的 iOS 模拟器设备"
    echo ""
    echo "正在创建默认 iPhone 模拟器..."
    
    # 获取最新的 iOS 运行时
    RUNTIME=$(xcrun simctl list runtimes available 2>/dev/null | grep -i "iOS" | tail -1 | awk '{print $NF}' | tr -d '()')
    
    if [ -n "$RUNTIME" ]; then
        echo "使用运行时: $RUNTIME"
        xcrun simctl create "iPhone 15" "iPhone 15" "$RUNTIME" 2>/dev/null
    else
        echo "❌ 无法自动创建模拟器"
        echo ""
        echo "请手动操作："
        echo "1. 打开 Xcode"
        echo "2. 菜单: Xcode → Settings → Platforms"
        echo "3. 下载 iOS 运行时"
        echo "4. 然后重新运行此脚本"
        exit 1
    fi
else
    echo "✅ 找到可用设备"
    echo "$DEVICES"
fi

echo ""

# 4. 启动模拟器
echo "4️⃣ 启动 iOS 模拟器..."
open -a Simulator
sleep 5

# 5. 启动第一个可用的 iPhone 设备
echo "5️⃣ 启动第一个 iPhone 设备..."
DEVICE_ID=$(xcrun simctl list devices available 2>/dev/null | grep -i "iphone" | head -1 | grep -oE '[A-F0-9-]{36}' | head -1)

if [ -n "$DEVICE_ID" ]; then
    echo "启动设备: $DEVICE_ID"
    xcrun simctl boot "$DEVICE_ID" 2>/dev/null
    echo "✅ 模拟器已启动"
else
    echo "⚠️  无法自动启动设备，请手动在 Simulator 中选择设备"
fi

echo ""
echo "✅ 修复完成！"
echo ""
echo "现在可以运行: npm run dev:ios"
