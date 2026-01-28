#!/bin/bash

# 🎯 边写边看开发环境启动脚本
# 自动启动 Expo + iOS 模拟器 + 布局窗口

PROJECT_DIR="/Users/niyutong/Desktop/AI聚合器开发方式Two"
cd "$PROJECT_DIR"

echo "═══════════════════════════════════════════════════"
echo "   🚀 启动边写边看开发环境"
echo "   📱 左边 2/3: Cursor 编辑器"
echo "   📱 右边 1/3: iOS 模拟器"
echo "═══════════════════════════════════════════════════"
echo ""

# 1. 清理端口
echo "🔍 清理端口..."
lsof -ti:8081,19000,19001 2>/dev/null | xargs kill -9 2>/dev/null
echo "✅ 完成"
echo ""

# 2. 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 检测到缺少依赖，正在安装..."
    npm install
    echo ""
fi

# 3. 检查并启动 iOS 模拟器
echo "🔍 检查 iOS 模拟器..."
echo ""

# 检查模拟器是否已运行
if ! pgrep -x "Simulator" > /dev/null; then
    echo "📱 启动 iOS 模拟器..."
    
    # 尝试启动模拟器
    open -a Simulator 2>/dev/null
    sleep 5
    
    # 检查是否有可用的设备
    DEVICE_ID=$(xcrun simctl list devices available 2>/dev/null | grep -i "iphone" | head -1 | grep -oE '[A-F0-9-]{36}' | head -1)
    
    if [ -z "$DEVICE_ID" ]; then
        echo "⚠️  未找到可用的 iOS 模拟器设备"
        echo ""
        echo "请执行以下步骤："
        echo "1. 打开 Xcode"
        echo "2. 菜单: Xcode → Settings → Platforms"
        echo "3. 下载 iOS 运行时（如果还没有）"
        echo "4. 在 Simulator 中选择一个设备（File → New Simulator）"
        echo ""
        echo "或者运行修复脚本: ./fix-ios-simulator.sh"
        echo ""
        echo "继续启动 Expo（可以在 Web 浏览器中测试）..."
    else
        echo "✅ 找到设备: $DEVICE_ID"
        # 启动设备（如果还没启动）
        xcrun simctl boot "$DEVICE_ID" 2>/dev/null || true
    fi
else
    echo "✅ iOS 模拟器已在运行"
fi

echo ""

# 4. 启动 Expo 开发服务器
echo "🚀 启动 Expo 开发服务器..."
echo "   ⏳ 如果模拟器未准备好，可以在 Web 浏览器中测试（按 'w' 键）..."
echo ""

# 启动 Expo（不自动打开 iOS，避免错误）
npx expo start > /tmp/expo-output.log 2>&1 &
EXPO_PID=$!

# 等待 Expo 启动
sleep 5

# 尝试在 iOS 模拟器中打开（如果可用）
if pgrep -x "Simulator" > /dev/null; then
    echo "📱 尝试在 iOS 模拟器中打开..."
    sleep 3
    # 发送 'i' 键到 Expo（在后台）
    (sleep 2 && echo "i" | nc localhost 8081 2>/dev/null || true) &
fi

# 5. 布局窗口
echo ""
echo "📐 正在布局窗口..."

# 执行窗口布局脚本
osascript -e "
tell application \"System Events\"
    -- 获取屏幕尺寸
    set screenWidth to 2560
    set screenHeight to 1440
end tell

-- 计算窗口位置
set cursorWidth to screenWidth * 2 / 3
set simulatorX to cursorWidth
set simulatorWidth to screenWidth - cursorWidth

-- 布局 Cursor
tell application \"Cursor\"
    activate
    delay 1
    try
        set bounds of front window to {0, 0, cursorWidth, screenHeight}
    end try
end tell

-- 布局模拟器
tell application \"Simulator\"
    activate
    delay 1
    try
        set bounds of front window to {simulatorX, 0, screenWidth, screenHeight}
    end try
end tell

-- 激活 Cursor
tell application \"Cursor\"
    activate
end tell
"

echo "✅ 窗口布局完成！"
echo ""
echo "═══════════════════════════════════════════════════"
echo "   ✨ 开发环境已就绪！"
echo ""
echo "   💡 提示："
echo "   - 修改代码后会自动热重载"
echo "   - 在终端按 'r' 手动重新加载"
echo "   - 按 'Ctrl+C' 停止开发服务器"
echo "═══════════════════════════════════════════════════"
echo ""

# 6. 显示 Expo 输出
echo ""
echo "📋 Expo 开发服务器日志："
echo "   （按 Ctrl+C 停止）"
echo ""
tail -f /tmp/expo-output.log
