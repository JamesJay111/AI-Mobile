#!/bin/bash

# 🔧 重启 iOS 模拟器服务

echo "🔧 重启 iOS 模拟器服务..."
echo ""

# 1. 停止所有模拟器相关进程
echo "1️⃣ 停止模拟器进程..."
killall Simulator 2>/dev/null
killall com.apple.CoreSimulator.CoreSimulatorService 2>/dev/null
killall com.apple.CoreSimulator.SimDeviceService 2>/dev/null
sleep 3
echo "✅ 完成"
echo ""

# 2. 重启服务
echo "2️⃣ 重启服务..."
# 通过打开 Simulator 来重启服务
open -a Simulator
sleep 5
echo "✅ 完成"
echo ""

# 3. 验证
echo "3️⃣ 验证服务状态..."
sleep 2
xcrun simctl list devices > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ 模拟器服务已恢复"
else
    echo "⚠️  服务可能还需要一些时间启动"
    echo "   请稍等片刻，然后手动打开 Simulator"
fi

echo ""
echo "✅ 完成！现在可以打开 Simulator 应用了"
