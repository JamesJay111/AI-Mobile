#!/bin/bash
# 处理卡住的 Git 推送

set -e

cd "$(dirname "$0")"

echo "🔍 检查 Git 推送状态..."
echo ""

# 1. 检查是否有卡住的进程
echo "📋 步骤 1: 检查是否有卡住的 Git 进程..."
GIT_PROCESSES=$(ps aux | grep -E "git.*push|git.*fetch" | grep -v grep || true)
if [ -n "$GIT_PROCESSES" ]; then
  echo "⚠️  发现可能的 Git 进程："
  echo "$GIT_PROCESSES"
  echo ""
  read -p "是否要终止这些进程？(yes/no): " kill_confirm
  if [ "$kill_confirm" = "yes" ]; then
    pkill -f "git.*push" || true
    pkill -f "git.*fetch" || true
    echo "✅ 已终止相关进程"
  fi
else
  echo "✅ 没有发现卡住的 Git 进程"
fi

echo ""

# 2. 检查 Git 状态
echo "📋 步骤 2: 检查 Git 状态..."
git status --short

echo ""
echo "📋 步骤 3: 检查远程连接..."
if git ls-remote origin main &>/dev/null; then
  echo "✅ 可以连接到远程仓库"
else
  echo "❌ 无法连接到远程仓库，可能是网络问题"
  echo ""
  echo "建议："
  echo "  1. 检查网络连接"
  echo "  2. 尝试使用代理：./git-push-with-proxy.sh origin main --force"
  echo "  3. 或稍后重试"
  exit 1
fi

echo ""
echo "📋 步骤 4: 检查本地和远程的差异..."
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/main 2>/dev/null || echo "unknown")

echo "本地最新提交: $LOCAL_COMMIT"
echo "远程最新提交: $REMOTE_COMMIT"

if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
  echo "✅ 本地和远程已同步，无需推送"
  exit 0
fi

echo ""
echo "📋 步骤 5: 选择推送方式..."
echo ""
echo "选项："
echo "  1. 强制推送（覆盖远程）"
echo "  2. 先拉取再推送（合并远程更改）"
echo "  3. 取消"
echo ""
read -p "请选择 (1/2/3): " choice

case $choice in
  1)
    echo ""
    echo "📤 执行强制推送..."
    if [ -f "proxy.env" ]; then
      ./git-push-with-proxy.sh origin main --force
    else
      git push origin main --force
    fi
    ;;
  2)
    echo ""
    echo "🔄 先拉取远程更改..."
    if [ -f "proxy.env" ]; then
      source ./proxy.env
      git config http.https://github.com.proxy "$HTTP_PROXY" 2>/dev/null || true
      git config https.https://github.com.proxy "$HTTPS_PROXY" 2>/dev/null || true
    fi
    git fetch origin main
    git merge origin/main --no-edit || git rebase origin/main
    echo ""
    echo "📤 推送合并后的更改..."
    if [ -f "proxy.env" ]; then
      ./git-push-with-proxy.sh origin main
    else
      git push origin main
    fi
    ;;
  3)
    echo "❌ 已取消"
    exit 0
    ;;
  *)
    echo "❌ 无效选择"
    exit 1
    ;;
esac

echo ""
echo "✅ 完成！"
