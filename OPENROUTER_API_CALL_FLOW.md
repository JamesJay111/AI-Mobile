# OpenRouter API 调用逻辑总结

## 整体架构

```
前端 UI (ChatScreen/ImageGenerationModal/PDFReadingModal)
  ↓
前端 Service 层 (src/services/openRouter.ts)
  ↓ 使用 httpsCallable
Firebase Cloud Functions (functions/src/chat.ts, imageGeneration.ts, pdfReading.ts)
  ↓ 使用 axios.post
OpenRouter API (https://openrouter.ai/api/v1/chat/completions)
  ↓ 返回结果
Firebase Cloud Functions
  ↓ 返回 { success, data/imageUrl/answer }
前端 Service 层
  ↓ 返回给 UI
前端 UI 显示结果
```

---

## 1. 前端调用层 (`src/services/openRouter.ts`)

### 1.1 初始化 Firebase Functions 连接

```typescript
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase'; // functions = getFunctions(app, 'us-central1')

const chatCompletionFn = httpsCallable(functions, 'chatCompletion');
const generateImageFn = httpsCallable(functions, 'generateImage');
const readPDFFn = httpsCallable(functions, 'readPDF');
```

**关键点**：
- `functions` 已指定 region `us-central1`（与部署的 Functions 一致）
- `httpsCallable` 是 Firebase SDK 提供的 callable 函数调用方式

---

### 1.2 Chat 对话调用

**函数签名**：
```typescript
chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse>
```

**请求参数**：
```typescript
{
  messages: ChatMessage[];      // [{ role: 'user', content: '...' }, ...]
  modelId: string;              // OpenRouter 模型 ID（如 'deepseek/deepseek-chat'）
  userId: string;               // 当前用户 ID（getCurrentUserId()）
  isPro: boolean;              // 是否 Pro 用户（临时设为 true）
  stream?: boolean;            // 是否流式返回（默认 false）
}
```

**调用流程**：
1. `chatCompletionFn(request)` → 调用 Firebase Function `chatCompletion`
2. 等待返回 `{ success: true, data: { choices: [...] } }`
3. 提取 `data.choices[0].message.content` 作为 AI 回复

**错误处理**：
- `unauthenticated` → "Please sign in to continue"
- `permission-denied` → "This feature requires Pro subscription"
- `quota/rate limit` → "API quota exceeded"
- `network/timeout` → "Network error"
- 其他 → 返回 `error.message`

---

### 1.3 图片生成调用

**函数签名**：
```typescript
generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse>
```

**请求参数**：
```typescript
{
  prompt: string;                    // 图片描述
  referenceImageUrl?: string;        // 参考图 URL（可选，需先上传到 Storage）
  userId: string;
  isPro: boolean;
}
```

**调用流程**：
1. 若上传了参考图 → 先调用 `uploadFileToStorage()` 得到 `referenceImageUrl`
2. `generateImageFn({ prompt, referenceImageUrl, ... })` → 调用 Firebase Function `generateImage`
3. 等待返回 `{ success: true, imageUrl: '...' }`

**错误处理**：类似 Chat，但错误信息为 "Failed to generate image" / "Pro subscription required" 等

---

### 1.4 PDF 阅读调用

**函数签名**：
```typescript
readPDF(request: PDFReadingRequest): Promise<PDFReadingResponse>
```

**请求参数**：
```typescript
{
  pdfUrl: string;           // PDF 文件 URL（需先上传到 Storage）
  question: string;          // 要问的问题
  userId: string;
  isPro: boolean;
}
```

**调用流程**：
1. 上传 PDF → `uploadFileToStorage()` → 得到 `pdfUrl`
2. `readPDFFn({ pdfUrl, question, ... })` → 调用 Firebase Function `readPDF`
3. 等待返回 `{ success: true, answer: '...' }`

**错误处理**：类似 Chat，但包含 "PDF file is too large" 等 PDF 特定错误

---

## 2. 后端 Functions 层

### 2.1 API Key 配置

**文件**：`functions/src/config.ts`
```typescript
export const OPENROUTER_API_KEY = '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';
```

**部署时**：
- GitHub Actions workflow 会从 `secrets.OPENROUTER_API_KEY` 读取并动态生成此文件
- 本地部署时使用硬编码的值

---

### 2.2 Chat Function (`functions/src/chat.ts`)

**端点**：`https://openrouter.ai/api/v1/chat/completions`

**请求体**：
```json
{
  "model": "<openRouterModelId>",  // 从前端传入的 modelId（如 'deepseek/deepseek-chat'）
  "messages": [...],               // 对话历史数组
  "stream": false                  // 是否流式
}
```

**Headers**：
```typescript
{
  'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
  'HTTP-Referer': 'https://gemgpt.app',
  'X-Title': 'GemGPT',
  'Content-Type': 'application/json'
}
```

**返回**：
```typescript
{
  success: true,
  data: response.data  // OpenRouter 原始响应（包含 choices[0].message.content）
}
```

**运行时配置**：
- `timeoutSeconds: 60`
- `memory: '512MB'`
- `serviceAccount: 'gemgpt-ai-assistance@appspot.gserviceaccount.com'`

---

### 2.3 Image Generation Function (`functions/src/imageGeneration.ts`)

**端点**：`https://openrouter.ai/api/v1/chat/completions`（**注意：图片生成也用 chat/completions**）

**请求体**：
```json
{
  "model": "black-forest-labs/flux-pro",
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "<prompt>" },
        { "type": "image_url", "image_url": { "url": "<referenceImageUrl>" } }  // 可选
      ]
    }
  ]
}
```

**返回**：
```typescript
{
  success: true,
  imageUrl: response.data.choices?.[0]?.message?.content || response.data.data?.[0]?.url
}
```

**运行时配置**：
- `timeoutSeconds: 300`（5 分钟）
- `memory: '1GB'`
- `serviceAccount: 'gemgpt-ai-assistance@appspot.gserviceaccount.com'`
- `axios timeout: 120000`（2 分钟）

---

### 2.4 PDF Reading Function (`functions/src/pdfReading.ts`)

**端点**：`https://openrouter.ai/api/v1/chat/completions`（**注意：PDF 阅读也用 chat/completions**）

**请求体**：
```json
{
  "model": "xiaomi/mimo-v2-flash",
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "Please analyze this PDF document and answer the following question: <question>" },
        { "type": "image_url", "image_url": { "url": "<pdfUrl>" } }
      ]
    }
  ],
  "max_tokens": 2000
}
```

**返回**：
```typescript
{
  success: true,
  answer: response.data.choices[0].message.content
}
```

**运行时配置**：
- `timeoutSeconds: 300`（5 分钟）
- `memory: '1GB'`
- `serviceAccount: 'gemgpt-ai-assistance@appspot.gserviceaccount.com'`
- `axios timeout: 120000`（2 分钟）

---

## 3. 模型 ID 映射

**前端模型列表**：`src/App.tsx` 中的 `CHAT_MODELS`

**映射函数**：`src/services/openRouter.ts` 的 `getOpenRouterModelId()`

```typescript
export function getOpenRouterModelId(internalModelId: string): string {
  const model = CHAT_MODELS.find(m => m.id === internalModelId);
  return model?.openRouterId || 'deepseek/deepseek-chat'; // 默认免费模型
}
```

**示例映射**：
- `'deepseek-v3'` → `'deepseek/deepseek-chat'`
- `'gpt-5.1-instant'` → `'openai/gpt-4-turbo-2024-04-09'`（占位符，需验证）
- `'gemini-pro'` → `'google/gemini-pro-1.5'`

---

## 4. 认证与权限

### 4.1 用户认证（必须）

**前端**：`src/App.tsx` 中自动匿名登录
```typescript
useEffect(() => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      await signInAnonymously(auth);
    }
    setIsAuthReady(true);
  });
}, []);
```

**后端**：每个 Function 都校验
```typescript
if (!context.auth) {
  throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
}
```

**结果**：未登录时，所有 API 调用都会返回 `unauthenticated` 错误

---

### 4.2 Pro 权限检查（当前已禁用）

**前端**：`isPro` 临时设为 `true`（`src/App.tsx`）

**后端**：所有 Pro 检查都已注释（`functions/src/*.ts`）

**TODO**：后续需实现 Firestore 查询用户 Pro 状态

---

## 5. 完整调用示例

### Chat 对话流程

1. **用户输入**：在 `ChatScreen` 输入框输入 "你好"
2. **前端处理**：`ChatScreen.handleSend()` → 调用 `chatCompletion({ messages: [...], modelId: 'deepseek/deepseek-chat', ... })`
3. **Service 层**：`openRouter.ts` → `chatCompletionFn(request)` → Firebase Function
4. **后端 Function**：`chat.ts` → 校验 auth → `axios.post('https://openrouter.ai/api/v1/chat/completions', { model: 'deepseek/deepseek-chat', messages: [...] })`
5. **OpenRouter**：处理请求，返回 `{ choices: [{ message: { content: '你好！...' } }] }`
6. **后端返回**：`{ success: true, data: { choices: [...] } }`
7. **前端显示**：`ChatScreen` 提取 `data.choices[0].message.content` 并显示在消息列表

---

### 图片生成流程

1. **用户操作**：点击 "Image Generation" → 输入描述 "a cute cat"
2. **前端处理**：`ImageGenerationModal.handleGenerate()` → 可选上传参考图到 Storage → 调用 `generateImage({ prompt: 'a cute cat', referenceImageUrl: '...', ... })`
3. **Service 层**：`openRouter.ts` → `generateImageFn(request)` → Firebase Function
4. **后端 Function**：`imageGeneration.ts` → 校验 auth → `axios.post('https://openrouter.ai/api/v1/chat/completions', { model: 'black-forest-labs/flux-pro', messages: [...] })`
5. **OpenRouter**：生成图片，返回图片 URL 或 base64
6. **后端返回**：`{ success: true, imageUrl: 'https://...' }`
7. **前端显示**：`ImageGenerationModal` 显示生成的图片

---

### PDF 阅读流程

1. **用户操作**：点击 "PDF Reading" → 上传 PDF → 输入问题 "这篇文章的主要内容是什么？"
2. **前端处理**：`PDFReadingModal.handleAnalyze()` → 上传 PDF 到 Storage → 调用 `readPDF({ pdfUrl: 'https://...', question: '...', ... })`
3. **Service 层**：`openRouter.ts` → `readPDFFn(request)` → Firebase Function
4. **后端 Function**：`pdfReading.ts` → 校验 auth → `axios.post('https://openrouter.ai/api/v1/chat/completions', { model: 'xiaomi/mimo-v2-flash', messages: [{ content: [{ type: 'text', text: '...' }, { type: 'image_url', image_url: { url: pdfUrl } }] }] })`
5. **OpenRouter**：分析 PDF，返回答案
6. **后端返回**：`{ success: true, answer: '这篇文章主要讲述了...' }`
7. **前端显示**：`PDFReadingModal` 显示答案

---

## 6. 可能的问题排查点

### 如果“模型没有被调用”，检查：

1. **前端是否真正调用了 Service 层**？
   - 打开浏览器 Console，看是否有 `chatCompletion error:` / `Image generation error:` 等日志
   - 检查 `ChatScreen.handleSend()` 是否执行到 `chatCompletion()` 调用

2. **匿名登录是否成功**？
   - Console 应看到 `✅ 匿名登录成功` 或 `✅ 用户已登录: <uid>`
   - 若没有，后端会返回 `unauthenticated`

3. **Functions 是否部署成功**？
   - 检查 GitHub Actions 部署日志
   - 或 Firebase Console → Functions 查看是否有 `chatCompletion`、`generateImage`、`readPDF`

4. **API Key 是否正确**？
   - `functions/src/config.ts` 中的 key 是否与 OpenRouter 账户一致
   - GitHub Actions 中 `secrets.OPENROUTER_API_KEY` 是否设置

5. **Network 请求是否发出**？
   - 浏览器 DevTools → Network → 查看是否有对 `https://us-central1-gemgpt-ai-assistance.cloudfunctions.net/chatCompletion` 的请求
   - 查看请求/响应内容

6. **OpenRouter 是否返回错误**？
   - Functions 日志（Firebase Console → Functions → Logs）查看是否有 `OpenRouter API Error:`
   - 检查 OpenRouter 账户余额/配额

---

## 7. 调试建议

1. **前端 Console**：查看 `chatCompletion error:`、`Image generation error:` 等日志
2. **Firebase Functions 日志**：Firebase Console → Functions → 选择函数 → Logs
3. **Network 面板**：查看 `httpsCallable` 的请求/响应
4. **OpenRouter Dashboard**：查看 API 调用记录和错误
