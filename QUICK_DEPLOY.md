# 🚀 快速部署 Functions 解决 CORS 错误

## 问题
当前遇到 CORS 错误，因为 Functions 未部署或需要重新部署。

## 解决步骤

### 方法 1: 使用脚本（推荐）

```bash
cd "/Users/niyutong/Desktop/AI聚合器开发方式Two"
./deploy-functions-now.sh
```

### 方法 2: 手动部署

#### 步骤 1: 登录 Firebase

```bash
firebase login
```

这会打开浏览器，让你登录 Google 账号。

#### 步骤 2: 确认项目

```bash
firebase use gemgpt-ai-assistance
```

#### 步骤 3: 部署 Functions

```bash
cd "/Users/niyutong/Desktop/AI聚合器开发方式Two"
firebase deploy --only functions
```

#### 步骤 4: 验证部署

```bash
firebase functions:list
```

应该看到：
- ✅ chatCompletion
- ✅ generateImage  
- ✅ analyzePDF

## 部署完成后

1. 刷新浏览器页面 (http://localhost:3001)
2. 重新测试 Chat 功能
3. CORS 错误应该消失

## 如果仍然有问题

1. 检查 Firebase Console: https://console.firebase.google.com/project/gemgpt-ai-assistance/functions
2. 确认 Functions 状态为 "Active"
3. 查看 Functions 日志: `firebase functions:log`
