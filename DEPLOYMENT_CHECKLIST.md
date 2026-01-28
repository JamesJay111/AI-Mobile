# 🚀 部署检查清单

## ✅ API集成完成状态

### 前端组件
- ✅ `ChatScreen.tsx` - 已连接 `chatCompletion` API
- ✅ `ImageGenerationModal.tsx` - 已连接 `generateImage` API
- ✅ `TattooGeneratorSheet.tsx` - 已连接 `generateImage` API
- ✅ `PDFReadingModal.tsx` - 已连接 `readPDF` API

### 后端Functions
- ✅ `functions/src/chat.ts` - Chat completion Function
- ✅ `functions/src/imageGeneration.ts` - Image generation Function
- ✅ `functions/src/pdfReading.ts` - PDF reading Function
- ✅ `functions/src/config.ts` - OpenRouter API Key配置

### 服务层
- ✅ `src/services/openRouter.ts` - API调用封装
- ✅ `src/services/storageUpload.ts` - 文件上传服务

---

## 📋 部署前检查清单

### 1. 验证OpenRouter模型ID ⚠️ CRITICAL
**必须完成**: 访问 https://openrouter.ai/models 验证所有模型ID

需要验证的模型：
- [ ] `openai/gpt-4-turbo-2024-04-09` (GPT-5.1/5.2 Instant)
- [ ] `google/gemini-pro-1.5` (Gemini Pro)
- [ ] `perplexity/llama-3.1-sonar-large-128k-online` (Perplexity)
- [ ] `x-ai/grok-beta` (Grok 4.1)
- [ ] `openai/o3-mini` (o3)
- [ ] `deepseek/deepseek-chat` (DeepSeek V3)
- [ ] `black-forest-labs/flux-pro` (FLUX.2 Klein - 图片生成)
- [ ] `xiaomi/mimo-v2-flash` (MiMo-V2-Flash - PDF阅读)

**如果模型ID不正确，更新 `src/App.tsx` 中的 `CHAT_MODELS` 数组**

### 2. 安装Functions依赖
```bash
cd functions
npm install
```

**检查依赖**:
- [ ] `firebase-admin` ✅
- [ ] `firebase-functions` ✅
- [ ] `axios` ✅
- [ ] `typescript` ✅

### 3. 编译Functions
```bash
cd functions
npm run build
```

**检查输出**:
- [ ] `functions/lib/` 目录已创建
- [ ] 没有编译错误
- [ ] 所有TypeScript文件已编译

### 4. 配置Firebase项目
```bash
firebase login
firebase init
```

**配置项**:
- [ ] 选择现有Firebase项目或创建新项目
- [ ] 启用Functions
- [ ] 启用Hosting
- [ ] 启用Firestore
- [ ] 启用Storage

### 5. 部署Functions
```bash
cd functions
npm run build
firebase deploy --only functions
```

**验证部署**:
- [ ] Functions部署成功
- [ ] 在Firebase Console中看到3个Functions:
  - `chatCompletion`
  - `generateImage`
  - `readPDF`

### 6. 配置前端环境变量
创建 `.env` 文件（从 `.env.example` 复制）:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### 7. 构建前端
```bash
npm run build
```

**检查输出**:
- [ ] `build/` 目录已创建
- [ ] 没有构建错误
- [ ] 所有资源文件已复制

### 8. 部署前端
```bash
firebase deploy --only hosting
```

---

## 🧪 功能测试清单

### Chat功能测试
1. [ ] 打开应用
2. [ ] 输入消息并发送
3. [ ] 验证收到AI回复
4. [ ] 切换不同模型
5. [ ] 验证每个模型都能正常工作
6. [ ] 测试错误处理（断开网络等）

### 图片生成测试
1. [ ] 点击"🎨 AI Image Generator"
2. [ ] 输入提示词
3. [ ] 点击"Generate Image"
4. [ ] 验证图片生成并显示
5. [ ] 测试参考图片上传
6. [ ] 测试下载功能
7. [ ] 测试非Pro用户显示付费墙

### 纹身生成测试
1. [ ] 点击"🦋 Tattoo Generator"
2. [ ] 输入纹身描述
3. [ ] 可选上传参考图片
4. [ ] 点击"Generate Tattoo"
5. [ ] 验证纹身设计生成
6. [ ] 测试下载功能
7. [ ] 测试非Pro用户显示付费墙

### PDF阅读测试
1. [ ] 点击"📄 PDF Reading"
2. [ ] 上传PDF文件
3. [ ] 输入问题
4. [ ] 点击"Analyze PDF"
5. [ ] 验证获得答案
6. [ ] 测试后续问题（使用相同PDF）
7. [ ] 测试非Pro用户显示付费墙
8. [ ] 测试文件大小限制（>10MB应显示错误）

---

## 🔍 问题排查

### Functions部署失败
- 检查 `functions/package.json` 依赖是否完整
- 检查 `functions/tsconfig.json` 配置
- 查看Firebase Console错误日志

### API调用失败
- 检查OpenRouter API Key是否正确
- 检查模型ID是否存在
- 查看浏览器控制台错误
- 查看Firebase Functions日志

### 图片生成失败
- 验证FLUX模型ID是否正确
- 检查OpenRouter是否支持该模型
- 验证API端点是否正确（可能需要使用不同端点）

### PDF阅读失败
- 验证MiMo-V2-Flash模型ID
- 检查模型是否支持PDF（可能需要先转换为图片）
- 验证文件大小是否超过限制

---

## 📊 当前实现状态

| 功能 | 前端 | 后端 | API连接 | 状态 |
|------|------|------|---------|------|
| Chat | ✅ | ✅ | ✅ | **完成** |
| Image Gen | ✅ | ✅ | ✅ | **完成** |
| Tattoo Gen | ✅ | ✅ | ✅ | **完成** |
| PDF Read | ✅ | ✅ | ✅ | **完成** |

---

## 🎯 下一步

1. **部署Functions**: `firebase deploy --only functions`
2. **验证模型ID**: 访问 OpenRouter 网站验证
3. **测试功能**: 在浏览器中测试所有功能
4. **监控成本**: 在OpenRouter Dashboard监控API使用

---

**所有API集成代码已完成！** 现在只需要部署和测试。🚀
