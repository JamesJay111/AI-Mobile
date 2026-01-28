# GemGPT 前端与后端 API 集成架构说明

## 📐 整体架构

```
前端 (React) 
    ↓
Firebase SDK (httpsCallable)
    ↓
Firebase Cloud Functions (后端)
    ↓
OpenRouter API (外部服务)
```

## 🔄 数据流向

### 1. 前端组件层 (Components)
- `ChatScreen.tsx` - 聊天界面
- `ImageGenerationModal.tsx` - 图片生成弹窗
- `PDFReadingModal.tsx` - PDF阅读弹窗
- `TattooGeneratorSheet.tsx` - 纹身生成

### 2. 服务层 (Services)
- `src/services/openRouter.ts` - API调用封装
- `src/services/storageUpload.ts` - 文件上传到Firebase Storage

### 3. 配置层 (Config)
- `src/config/firebase.ts` - Firebase初始化配置

### 4. 后端层 (Cloud Functions)
- `functions/src/chat.ts` - 聊天API
- `functions/src/imageGeneration.ts` - 图片生成API
- `functions/src/pdfReading.ts` - PDF阅读API
- `functions/src/config.ts` - OpenRouter API Key配置

---

## 🔌 前端如何调用后端API

### 步骤1: Firebase初始化
**文件**: `src/config/firebase.ts`

```typescript
import { getFunctions } from 'firebase/functions';

const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app); // 初始化Functions服务
```

### 步骤2: 创建可调用函数引用
**文件**: `src/services/openRouter.ts`

```typescript
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

// 创建三个可调用函数的引用
const chatCompletionFn = httpsCallable(functions, 'chatCompletion');
const generateImageFn = httpsCallable(functions, 'generateImage');
const readPDFFn = httpsCallable(functions, 'readPDF');
```

**说明**:
- `httpsCallable` 是Firebase SDK提供的函数，用于创建可调用的Cloud Function引用
- 第一个参数是 `functions` 实例
- 第二个参数是后端Function的名称（必须与 `functions/src/index.ts` 中导出的名称一致）

### 步骤3: 封装API调用函数
**文件**: `src/services/openRouter.ts`

```typescript
export async function chatCompletion(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  try {
    // 调用Firebase Cloud Function
    const result = await chatCompletionFn(request);
    return result.data as ChatCompletionResponse;
  } catch (error: any) {
    // 错误处理
    return {
      success: false,
      error: error.message || 'Failed to generate response'
    };
  }
}
```

### 步骤4: 在组件中使用
**文件**: `src/components/ChatScreen.tsx`

```typescript
import { chatCompletion, getOpenRouterModelId as getModelId } from '../services/openRouter';

const handleSend = async () => {
  // 1. 准备请求数据
  const openRouterModelId = getModelId(selectedModel);
  const apiMessages = [
    ...messages.map(m => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: inputValue }
  ];

  // 2. 调用服务层函数
  const response = await chatCompletion({
    messages: apiMessages,
    modelId: openRouterModelId,
    userId: 'current-user',
    isPro: isPro,
    stream: false
  });

  // 3. 处理响应
  if (response.success && response.data?.choices?.[0]?.message?.content) {
    // 更新UI显示结果
    setMessages(prev => prev.map(msg => 
      msg.id === loadingMessageId
        ? { ...msg, content: response.data!.choices[0].message.content }
        : msg
    ));
  }
};
```

---

## 📋 三个主要API的调用流程

### 1. 聊天API (Chat Completion)

**前端调用**:
```typescript
// ChatScreen.tsx
const response = await chatCompletion({
  messages: apiMessages,        // 消息历史
  modelId: openRouterModelId,   // 模型ID (如: 'deepseek/deepseek-chat')
  userId: 'current-user',      // 用户ID
  isPro: isPro,                 // 是否Pro用户
  stream: false                 // 是否流式响应
});
```

**后端处理** (`functions/src/chat.ts`):
```typescript
export const chatCompletion = functions.https.onCall(async (data, context) => {
  // 1. 验证用户身份
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '...');
  }

  // 2. 调用OpenRouter API
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: openRouterModelId,
      messages: messages,
      stream: stream
    },
    {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`, // 从config.ts读取
        'HTTP-Referer': 'https://gemgpt.app',
        'X-Title': 'GemGPT'
      }
    }
  );

  // 3. 返回结果给前端
  return {
    success: true,
    data: response.data
  };
});
```

### 2. 图片生成API (Image Generation)

**前端调用**:
```typescript
// ImageGenerationModal.tsx
// 1. 先上传参考图片到Firebase Storage
let referenceImageUrl: string | undefined;
if (referenceImage) {
  referenceImageUrl = await uploadFileToStorage({
    file: referenceImage,
    path: `image-refs/current-user/${Date.now()}_${referenceImage.name}`,
  });
}

// 2. 调用图片生成API
const res = await generateImage({
  prompt: description.trim(),
  referenceImageUrl,  // Storage URL
  userId: 'current-user',
  isPro: true,
});
```

**后端处理** (`functions/src/imageGeneration.ts`):
```typescript
export const generateImage = functions.https.onCall(async (data, context) => {
  const { prompt, referenceImageUrl } = data;

  // 调用OpenRouter图片生成模型
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'black-forest-labs/flux-pro',
      messages: [{
        role: 'user',
        content: referenceImageUrl
          ? [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: referenceImageUrl } }
            ]
          : prompt
      }]
    },
    {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`
      }
    }
  );

  return {
    success: true,
    imageUrl: response.data.choices?.[0]?.message?.content
  };
});
```

### 3. PDF阅读API (PDF Reading)

**前端调用**:
```typescript
// PDFReadingModal.tsx
// 1. 上传PDF到Firebase Storage
const pdfUrl = await uploadFileToStorage({
  file,
  path: `pdfs/current-user/${Date.now()}_${file.name}`,
});

// 2. 调用PDF阅读API
const res = await readPDF({
  pdfUrl,              // Storage URL
  question: question.trim(),
  userId: 'current-user',
  isPro: true,
});
```

**后端处理** (`functions/src/pdfReading.ts`):
```typescript
export const readPDF = functions.https.onCall(async (data, context) => {
  const { pdfUrl, question } = data;

  // 调用OpenRouter多模态模型
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'xiaomi/mimo-v2-flash',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: question },
          { type: 'image_url', image_url: { url: pdfUrl } }
        ]
      }]
    },
    {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`
      }
    }
  );

  return {
    success: true,
    answer: response.data.choices[0].message.content
  };
});
```

---

## 🔐 安全机制

### 1. 用户身份验证
所有Cloud Functions都要求用户登录：
```typescript
if (!context.auth) {
  throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
}
```

### 2. API Key保护
- OpenRouter API Key存储在 `functions/src/config.ts`
- 已添加到 `.gitignore`，不会提交到Git
- 只在后端使用，前端无法访问

### 3. Firestore安全规则
**文件**: `firestore.rules`
```javascript
match /users/{userId}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

---

## 📦 文件上传流程

### Firebase Storage上传
**文件**: `src/services/storageUpload.ts`

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export async function uploadFileToStorage(options: {
  file: File;
  path: string;
}): Promise<string> {
  // 1. 创建Storage引用
  const storageRef = ref(storage, options.path);
  
  // 2. 上传文件
  await uploadBytes(storageRef, options.file);
  
  // 3. 获取下载URL
  return await getDownloadURL(storageRef);
}
```

**使用示例**:
```typescript
// 上传参考图片
const imageUrl = await uploadFileToStorage({
  file: referenceImage,
  path: `image-refs/current-user/${Date.now()}_${referenceImage.name}`,
});

// 上传PDF
const pdfUrl = await uploadFileToStorage({
  file: pdfFile,
  path: `pdfs/current-user/${Date.now()}_${pdfFile.name}`,
});
```

---

## 🎯 前端页面规则

### 1. 状态管理规则
- **Loading状态**: 所有API调用必须显示loading状态
- **Error状态**: 所有错误必须显示错误信息，并提供重试按钮
- **Success状态**: 成功操作后显示结果，并提供后续操作按钮

### 2. UI交互规则
- **按钮状态**: 
  - 默认: 正常显示
  - Hover: `hover:bg-gray-100`
  - Active: `active:scale-95`
  - Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`
  - Loading: 显示spinner + 禁用交互

- **Modal规则**:
  - 背景遮罩: `bg-black/40` (40%透明度)
  - 内容背景: `bg-white`
  - 圆角: `rounded-2xl` 或 `rounded-3xl`
  - 点击遮罩关闭

### 3. 数据流规则
```
用户操作 
  → 更新UI状态 (loading)
  → 调用服务层函数
  → 等待后端响应
  → 更新UI状态 (success/error)
  → 显示结果
```

---

## 🔧 配置要求

### 前端环境变量 (`.env`)
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### 后端配置 (`functions/src/config.ts`)
```typescript
export const OPENROUTER_API_KEY = 'sk-or-v1-...';
```

---

## 📝 关键代码位置总结

| 功能 | 前端组件 | 服务层 | 后端Function |
|------|---------|--------|-------------|
| 聊天 | `ChatScreen.tsx` | `openRouter.ts::chatCompletion()` | `functions/src/chat.ts` |
| 图片生成 | `ImageGenerationModal.tsx` | `openRouter.ts::generateImage()` | `functions/src/imageGeneration.ts` |
| PDF阅读 | `PDFReadingModal.tsx` | `openRouter.ts::readPDF()` | `functions/src/pdfReading.ts` |
| 文件上传 | 各组件 | `storageUpload.ts::uploadFileToStorage()` | Firebase Storage |

---

## 🚀 部署流程

1. **编译前端**:
   ```bash
   npm run build
   ```

2. **编译Functions**:
   ```bash
   cd functions
   npm install
   npm run build
   ```

3. **部署Functions**:
   ```bash
   firebase deploy --only functions
   ```

4. **部署前端**:
   ```bash
   firebase deploy --only hosting
   ```

---

## ⚠️ 注意事项

1. **API Key安全**: `functions/src/config.ts` 已添加到 `.gitignore`，不要提交到Git
2. **用户认证**: 目前使用 `'current-user'` 作为占位符，需要实现真实的Firebase Auth
3. **错误处理**: 所有API调用都有try-catch，确保错误不会导致应用崩溃
4. **模型ID**: 前端使用内部ID（如 `'deepseek-v3'`），服务层转换为OpenRouter ID（如 `'deepseek/deepseek-chat'`）
