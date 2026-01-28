# 🚀 快速修复方案 - 让功能可以测试

## 目标
用最快的方式让 Chat、图片生成、PDF Reading 可以测试。

---

## 步骤1：实现匿名认证（5分钟）

### 修改 `src/App.tsx`

在 `App` 组件中添加：

```typescript
import { useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

export default function App() {
  // ... 现有代码 ...

  // 添加认证初始化
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          await signInAnonymously(auth);
          console.log('✅ 匿名登录成功');
        } catch (error) {
          console.error('❌ 匿名登录失败:', error);
        }
      } else {
        console.log('✅ 用户已登录:', user.uid);
      }
    });
    return unsubscribe;
  }, []);

  // ... 其余代码 ...
}
```

---

## 步骤2：更新所有 userId 使用真实值

### 修改 `src/utils/user.ts`

```typescript
import { auth } from '../config/firebase';

export function getCurrentUserId(): string {
  return auth.currentUser?.uid || 'anonymous';
}
```

### 修改所有组件中的 `userId: 'current-user'`

替换为：
```typescript
import { getCurrentUserId } from '../utils/user';
// ...
userId: getCurrentUserId()
```

**需要修改的文件**：
- `src/components/ChatScreen.tsx` (2处)
- `src/components/ImageGenerationModal.tsx` (1处)
- `src/components/PDFReadingModal.tsx` (1处)
- `src/components/TattooGeneratorSheet.tsx` (1处)

---

## 步骤3：临时禁用 Pro 检查（仅测试用）

### 修改 `functions/src/imageGeneration.ts`

```typescript
// 临时注释掉 Pro 检查（仅测试用）
// if (!isPro) {
//   throw new functions.https.HttpsError('permission-denied', 'Pro subscription required for image generation');
// }
```

### 修改 `functions/src/pdfReading.ts`

```typescript
// 临时注释掉 Pro 检查（仅测试用）
// if (!isPro) {
//   throw new functions.https.HttpsError('permission-denied', 'Pro subscription required for PDF reading');
// }
```

**⚠️ 注意**：这只是为了测试，生产环境必须恢复 Pro 检查！

---

## 步骤4：配置 Firebase（如果还没有）

### 创建 Firebase 项目

1. 访问 https://console.firebase.google.com
2. 创建新项目或选择现有项目
3. 获取配置信息

### 更新 `app.json`

```json
{
  "expo": {
    "extra": {
      "VITE_FIREBASE_API_KEY": "你的API Key",
      "VITE_FIREBASE_AUTH_DOMAIN": "你的项目.firebaseapp.com",
      "VITE_FIREBASE_PROJECT_ID": "你的项目ID",
      "VITE_FIREBASE_STORAGE_BUCKET": "你的项目.appspot.com",
      "VITE_FIREBASE_MESSAGING_SENDER_ID": "你的Sender ID",
      "VITE_FIREBASE_APP_ID": "你的App ID"
    }
  }
}
```

### 启用 Firebase 服务

在 Firebase Console 中：
1. **Authentication** → 启用"匿名登录"
2. **Storage** → 创建存储桶
3. **Functions** → 准备部署

---

## 步骤5：部署 Functions

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

---

## 步骤6：验证模型 ID（快速检查）

访问 https://openrouter.ai/models 快速检查：

- [ ] `deepseek/deepseek-chat` - 应该存在（免费模型）
- [ ] `black-forest-labs/flux-pro` - 检查是否存在
- [ ] `xiaomi/mimo-v2-flash` - 检查是否存在

如果不存在，更新 `src/App.tsx` 中的模型 ID。

---

## 步骤7：测试

### 测试 Chat
1. 打开应用
2. 选择模型（建议先用 `deepseek/deepseek-chat`）
3. 发送消息
4. 应该收到 AI 回复

### 测试图片生成
1. 点击 "🎨 AI Image Generator"
2. 输入提示词
3. 点击 "Generate Image"
4. 应该生成图片

### 测试 PDF Reading
1. 点击 "📄 PDF Reading"
2. 上传 PDF 文件
3. 输入问题
4. 点击 "Analyze PDF"
5. 应该获得答案

---

## ⚠️ 已知限制

1. **匿名认证**：用户每次刷新会得到新的匿名 ID
2. **Pro 检查已禁用**：任何人都可以使用 Pro 功能（仅测试）
3. **模型 ID 可能不正确**：需要验证

---

## 🎯 完成后的下一步

测试成功后，需要：

1. **恢复 Pro 检查**：取消注释 Functions 中的 Pro 检查
2. **实现真实认证**：添加邮箱/密码登录或 Google 登录
3. **实现 Pro 订阅**：集成支付系统
4. **验证模型 ID**：确保所有模型 ID 正确
5. **优化错误处理**：添加更详细的错误信息

---

**现在可以开始测试了！** 🚀
