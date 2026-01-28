# 🚀 使用 Service Account 部署步骤

## ⚠️ 重要：必须先清除登录状态

Firebase CLI 会优先检查 `firebase login` 状态。使用服务账号前，**必须先登出**。

---

## 📋 完整部署步骤

### 步骤1：清除旧的登录状态（必须）

```bash
firebase logout
```

### 步骤2：设置服务账号并部署

**方式A：使用脚本（推荐）**

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
export GOOGLE_APPLICATION_CREDENTIALS="/Users/niyutong/Desktop/gemgpt-ai-assistance-a5a84f75d924.json"
./deploy-with-service-account.sh
```

**方式B：手动命令**

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
export GOOGLE_APPLICATION_CREDENTIALS="/Users/niyutong/Desktop/gemgpt-ai-assistance-a5a84f75d924.json"
firebase use gemgpt-ai-assistance
cd functions && npm install && npm run build && cd ..
firebase deploy --only functions
```

---

## 🔍 验证服务账号密钥

如果还是失败，检查密钥文件：

```bash
# 检查文件是否存在
ls -la /Users/niyutong/Desktop/gemgpt-ai-assistance-a5a84f75d924.json

# 检查文件内容（应该看到 "type": "service_account"）
cat /Users/niyutong/Desktop/gemgpt-ai-assistance-a5a84f75d924.json | grep "type"
```

---

## 🎯 快速命令（复制运行）

```bash
# 1. 清除登录状态
firebase logout

# 2. 设置服务账号并部署
export GOOGLE_APPLICATION_CREDENTIALS="/Users/niyutong/Desktop/gemgpt-ai-assistance-a5a84f75d924.json"
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
./deploy-with-service-account.sh
```

---

## ⚠️ 如果还是失败

### 检查服务账号权限

1. 进入 [Google Cloud Console](https://console.cloud.google.com/)
2. 选择项目：**gemgpt-ai-assistance**
3. **IAM 与管理** → **服务账号**
4. 找到你的服务账号（从密钥文件名可以找到）
5. 检查是否有以下角色之一：
   - **Firebase Admin**
   - **Cloud Functions Admin**
   - **编辑者**

如果没有，添加这些角色。

---

**关键：先运行 `firebase logout`，然后再部署！** 🔐
