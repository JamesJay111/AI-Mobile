# 🚨 部署前待办清单 - 功能测试准备

## ⚠️ 关键阻塞问题（必须解决才能测试）

### 1. ❌ Firebase Authentication 未实现（**最高优先级**）

**问题**：
- 所有 API 调用使用占位符 `'current-user'`
- Cloud Functions 要求 `context.auth`，但前端没有真实认证
- **结果**：所有 API 调用都会失败，抛出 `unauthenticated` 错误

**影响**：
- ❌ Chat 功能无法工作
- ❌ 图片生成无法工作
- ❌ PDF Reading 无法工作

**需要实现**：
```typescript
// 前端：实现 Firebase Auth
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

// 在 App.tsx 中初始化认证
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      signInAnonymously(auth);
    }
  });
  return unsubscribe;
}, []);

// 更新所有 API 调用
userId: auth.currentUser?.uid || 'anonymous'
```

**文件需要修改**：
- `src/App.tsx` - 添加认证初始化
- `src/components/ChatScreen.tsx` - 使用真实 userId
- `src/components/ImageGenerationModal.tsx` - 使用真实 userId
- `src/components/PDFReadingModal.tsx` - 使用真实 userId
- `src/components/TattooGeneratorSheet.tsx` - 使用真实 userId
- `src/utils/user.ts` - 实现真实用户ID获取

---

### 2. ❌ Firebase 配置未完成

**问题**：
- `app.json` 中的 Firebase 配置是占位符
- 没有真实的 Firebase 项目

**需要完成**：
1. 创建 Firebase 项目（如果还没有）
2. 获取 Firebase 配置信息
3. 更新 `app.json` 的 `extra` 字段：
```json
{
  "expo": {
    "extra": {
      "VITE_FIREBASE_API_KEY": "真实API Key",
      "VITE_FIREBASE_AUTH_DOMAIN": "真实项目.firebaseapp.com",
      "VITE_FIREBASE_PROJECT_ID": "真实项目ID",
      "VITE_FIREBASE_STORAGE_BUCKET": "真实项目.appspot.com",
      "VITE_FIREBASE_MESSAGING_SENDER_ID": "真实Sender ID",
      "VITE_FIREBASE_APP_ID": "真实App ID"
    }
  }
}
```

**影响**：
- ❌ Firebase 服务无法初始化
- ❌ Storage 上传失败
- ❌ Functions 调用失败

---

### 3. ❌ Cloud Functions 未部署

**问题**：
- Functions 代码已写，但可能还没部署到 Firebase

**需要完成**：
```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

**验证**：
- 在 Firebase Console 检查 Functions 是否部署成功
- 测试 Functions 是否可调用

**影响**：
- ❌ 所有 API 调用都会失败（404 或连接错误）

---

## ⚠️ 重要问题（影响功能正确性）

### 4. ⚠️ Pro 订阅验证未实现

**问题**：
- 后端只检查前端传递的 `isPro` 值
- 没有从 Firestore 验证真实订阅状态
- 用户可以绕过前端检查

**需要实现**：
```typescript
// functions/src/chat.ts, imageGeneration.ts, pdfReading.ts
import * as admin from 'firebase-admin';

const userDoc = await admin.firestore().collection('users').doc(userId).get();
const userIsPro = userDoc.data()?.isPro || false;

if (!userIsPro && requiresPro) {
  throw new functions.https.HttpsError('permission-denied', 'Pro subscription required');
}
```

**影响**：
- ⚠️ 安全漏洞：用户可以绕过付费墙
- ⚠️ 功能测试不准确

---

### 5. ⚠️ 模型 ID 未验证

**问题**：
- 模型 ID 可能不正确
- OpenRouter 可能不支持某些模型

**需要完成**：
1. 访问 https://openrouter.ai/models
2. 验证每个模型 ID：
   - `openai/gpt-4-turbo-2024-04-09` ✅ 或 ❌
   - `google/gemini-pro-1.5` ✅ 或 ❌
   - `deepseek/deepseek-chat` ✅ 或 ❌
   - `black-forest-labs/flux-pro` ✅ 或 ❌（图片生成）
   - `xiaomi/mimo-v2-flash` ✅ 或 ❌（PDF阅读）
3. 更新 `src/App.tsx` 中的 `CHAT_MODELS`

**影响**：
- ⚠️ API 调用可能返回 404 或错误
- ⚠️ 功能测试失败

---

### 6. ⚠️ 图片生成端点可能不正确

**问题**：
- 代码假设 FLUX 模型使用 `chat/completions` 端点
- 可能需要使用不同的端点或参数

**需要验证**：
1. 查看 OpenRouter 文档：FLUX 模型如何调用
2. 可能需要使用 `/images/generations` 端点
3. 或需要不同的请求格式

**影响**：
- ⚠️ 图片生成功能可能无法工作
- ⚠️ 返回格式可能不正确

---

### 7. ⚠️ PDF 处理可能有问题

**问题**：
- 代码假设 MiMo-V2-Flash 支持直接读取 PDF URL
- 可能需要先将 PDF 转换为图片

**需要验证**：
1. 查看 OpenRouter 文档：MiMo-V2-Flash 是否支持 PDF
2. 如果不支持，需要：
   - 安装 `pdf-lib` 或 `pdf2pic`
   - 将 PDF 转换为图片
   - 发送图片到模型

**影响**：
- ⚠️ PDF Reading 功能可能无法工作

---

## 📋 其他待完成事项

### 8. ⚠️ 文件上传功能测试

**需要测试**：
- [ ] 图片上传到 Firebase Storage
- [ ] PDF 上传到 Firebase Storage
- [ ] 文件大小限制（10MB）
- [ ] 文件类型验证
- [ ] 上传进度显示

---

### 9. ⚠️ 错误处理测试

**需要测试**：
- [ ] 网络错误处理
- [ ] API 超时处理
- [ ] 认证错误处理
- [ ] 权限错误处理
- [ ] 文件上传错误处理

---

### 10. ⚠️ UI/UX 测试

**需要测试**：
- [ ] Loading 状态显示
- [ ] Error 状态显示
- [ ] Success 状态显示
- [ ] 按钮禁用状态
- [ ] 模态框关闭/打开

---

## 🎯 测试前必须完成的优先级

### 🔴 P0 - 阻塞测试（必须完成）
1. ✅ Firebase Authentication 实现
2. ✅ Firebase 配置完成
3. ✅ Cloud Functions 部署

### 🟡 P1 - 影响功能正确性（强烈建议完成）
4. ⚠️ Pro 订阅验证实现
5. ⚠️ 模型 ID 验证
6. ⚠️ 图片生成端点验证
7. ⚠️ PDF 处理验证

### 🟢 P2 - 完善功能（可选）
8. ⚠️ 文件上传功能测试
9. ⚠️ 错误处理测试
10. ⚠️ UI/UX 测试

---

## 📝 快速测试检查清单

在开始测试前，确认：

- [ ] Firebase 项目已创建
- [ ] Firebase 配置已填入 `app.json`
- [ ] Firebase Authentication 已实现（至少匿名登录）
- [ ] Cloud Functions 已部署
- [ ] OpenRouter API Key 已配置
- [ ] 模型 ID 已验证
- [ ] 至少一个模型可以正常工作

---

## 🚀 最小可行测试方案

如果时间紧迫，可以先用以下最小方案测试：

1. **实现匿名认证**（最快）：
   ```typescript
   signInAnonymously(auth)
   ```

2. **临时禁用 Pro 检查**（仅测试用）：
   ```typescript
   // 在 Functions 中临时注释掉 Pro 检查
   // if (!isPro) { ... }
   ```

3. **使用已知可用的模型**：
   - 只测试 `deepseek/deepseek-chat`（免费模型）
   - 验证基本功能是否工作

4. **测试基本流程**：
   - Chat：发送消息 → 收到回复
   - 图片生成：输入提示词 → 生成图片（如果 Pro 检查已禁用）
   - PDF：上传 PDF → 获得答案（如果 Pro 检查已禁用）

---

**总结**：在开始测试前，**必须**完成 P0 的三个任务，否则所有功能都无法工作。
