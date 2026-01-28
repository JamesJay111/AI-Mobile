#!/bin/bash

# 📱 真机测试启动脚本
# 适用于 iPhone 17 Pro Max 或其他真机设备

PROJECT_DIR="/Users/niyutong/Desktop/AI聚合器开发方式Two"
cd "$PROJECT_DIR"

echo "═══════════════════════════════════════════════════"
echo "   📱 启动真机测试环境"
echo "   📱 适用于 iPhone 17 Pro Max"
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

# 3. 获取本机 IP 地址
echo "🔍 获取本机 IP 地址..."
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "无法获取")

if [ "$LOCAL_IP" != "无法获取" ]; then
    echo "✅ 本机 IP: $LOCAL_IP"
    echo "   确保 iPhone 和 Mac 在同一 Wi-Fi 网络"
else
    echo "⚠️  无法自动获取 IP 地址"
    echo "   请手动检查 Wi-Fi 连接"
fi

echo ""

# 4. 启动 Expo 并显示二维码
echo "🚀 启动 Expo 开发服务器..."
echo ""
echo "═══════════════════════════════════════════════════"
echo "   📋 下一步操作："
echo ""
echo "   1. 等待 Expo 启动完成"
echo "   2. 在终端按 'q' 键显示二维码"
echo "   3. 在 iPhone 上打开 Expo Go App 或相机 App"
echo "   4. 扫描二维码连接"
echo ""
echo "   💡 提示："
echo "   - 确保 iPhone 和 Mac 在同一 Wi-Fi 网络"
echo "   - 修改代码后会自动热重载"
echo "   - 在终端按 'r' 手动重新加载"
echo "   - 按 'q' 显示/隐藏二维码"
echo "   - 按 'Ctrl+C' 停止开发服务器"
echo "═══════════════════════════════════════════════════"
echo ""

# 启动 Expo（启动后按 'q' 键显示二维码）
npx expo start
