#!/bin/bash

# 部署 Firebase Functions 脚本
# 解决 CORS 错误

set -e

echo "🚀 开始部署 Firebase Functions..."
echo ""

# 1. 检查 Firebase 登录状态
echo "📋 步骤 1: 检查 Firebase 登录状态..."
if ! firebase projects:list &>/dev/null; then
    echo "❌ 未登录 Firebase，请先登录..."
    echo "正在打开浏览器进行登录..."
    firebase login
else
    echo "✅ 已登录 Firebase"
fi

echo ""

# 2. 确认项目
echo "📋 步骤 2: 确认 Firebase 项目..."
PROJECT=$(firebase use 2>&1 | grep -o 'gemgpt-ai-assistance' || echo "")
if [ -z "$PROJECT" ]; then
    echo "设置项目为 gemgpt-ai-assistance..."
    firebase use gemgpt-ai-assistance
else
    echo "✅ 当前项目: gemgpt-ai-assistance"
fi

echo ""

# 3. 编译 Functions
echo "📋 步骤 3: 编译 Functions..."
cd functions
echo "安装依赖..."
npm install --silent
echo "编译 TypeScript..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 编译失败，请检查错误信息"
    exit 1
fi
echo "✅ Functions 编译成功"
cd ..

echo ""

# 4. 部署 Functions
echo "📋 步骤 4: 部署 Functions 到 Firebase..."
echo "这将部署以下 Functions:"
echo "  - chatCompletion"
echo "  - generateImage"
echo "  - analyzePDF"
echo ""
echo "开始部署..."
firebase deploy --only functions

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 部署成功！"
    echo ""
    echo "📋 验证部署:"
    firebase functions:list
    echo ""
    echo "🎉 现在可以测试应用了！"
    echo "访问: http://localhost:3001"
else
    echo ""
    echo "❌ 部署失败，请检查错误信息"
    exit 1
fi
