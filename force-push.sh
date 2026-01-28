#!/bin/bash
# 强制推送覆盖远程仓库（谨慎使用！）

set -e

cd "$(dirname "$0")"

echo "⚠️  警告：这将覆盖远程仓库的所有更改！"
echo ""
echo "本地提交："
git log --oneline -5
echo ""
echo "远程提交（将被覆盖）："
git log --oneline origin/main -5 2>/dev/null || echo "无法获取远程信息"
echo ""
read -p "确认要覆盖远程仓库吗？(yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ 已取消"
  exit 1
fi

echo ""
echo "📤 正在强制推送..."

# 尝试使用代理（如果有）
if [[ -f "proxy.env" ]]; then
  set -a
  source ./proxy.env
  set +a
  echo "🌐 使用代理配置..."
  git config --global http.https://github.com.proxy "$HTTP_PROXY" 2>/dev/null || true
  git config --global https://https://github.com.proxy "$HTTPS_PROXY" 2>/dev/null || true
fi

# 强制推送
if git push origin main --force; then
  echo ""
  echo "✅ 强制推送成功！"
  echo ""
  echo "🎉 远程仓库已被覆盖，GitHub Actions 将自动触发部署"
else
  echo ""
  echo "❌ 推送失败，可能是网络问题"
  echo ""
  echo "可以尝试："
  echo "  1. 使用代理脚本: ./git-push-with-proxy.sh origin main --force"
  echo "  2. 或配置 SSH: git remote set-url origin git@github.com:JamesJay111/AI-Mobile.git"
  echo "  3. 然后运行: git push origin main --force"
  exit 1
fi
