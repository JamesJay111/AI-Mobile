#!/bin/bash

# 🚀 启动 Expo + iOS 模拟器 + 自动布局窗口
# 实现"边写边看"的开发环境

PROJECT_DIR="/Users/niyutong/Desktop/AI聚合器开发方式Two"
cd "$PROJECT_DIR"

echo "🎯 启动边写边看开发环境..."
echo ""

# 1. 检查并清理端口
echo "🔍 检查端口占用..."
lsof -ti:8081,19000,19001 2>/dev/null | xargs kill -9 2>/dev/null
echo "✅ 端口已清理"

# 2. 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 3. 启动 Expo（后台运行，自动打开 iOS）
echo ""
echo "🚀 启动 Expo 开发服务器..."
echo "💡 这将自动打开 iOS 模拟器"
echo ""

# 在后台启动 Expo，并自动打开 iOS 模拟器
npx expo start --ios &
EXPO_PID=$!

# 等待几秒让 Expo 和模拟器启动
sleep 8

# 4. 布局窗口
echo ""
echo "📐 正在布局窗口..."
echo "   - 左边 2/3: Cursor 编辑器"
echo "   - 右边 1/3: iOS 模拟器"
echo ""

# 使用 AppleScript 布局窗口
osascript <<EOF
tell application "System Events"
    -- 等待 Cursor 窗口出现
    delay 2
    
    -- 获取屏幕尺寸
    set screenWidth to (first window of first application process whose name is "Cursor")
    set screenWidth to 2560  -- 假设标准屏幕，实际会动态获取
end tell

tell application "Cursor"
    activate
    delay 1
    
    -- 获取主窗口
    set mainWindow to front window
    
    -- 设置 Cursor 窗口：左边 2/3
    set bounds of mainWindow to {0, 0, 1707, 1440}  -- 2/3 宽度
end tell

tell application "Simulator"
    activate
    delay 1
    
    -- 设置模拟器窗口：右边 1/3
    set bounds of front window to {1707, 0, 2560, 1440}  -- 1/3 宽度，从 2/3 位置开始
end tell

tell application "Cursor"
    activate
end tell
EOF

echo "✅ 窗口布局完成！"
echo ""
echo "📋 使用提示："
echo "   - 修改代码后，应用会自动热重载"
echo "   - 在 Expo 终端按 'r' 键手动重新加载"
echo "   - 按 'Ctrl+C' 停止开发服务器"
echo ""
echo "🎉 开始享受边写边看的开发体验吧！"
echo ""

# 等待 Expo 进程
wait $EXPO_PID
