# 📱 Expo 测试指南 - 三个核心功能

## ✅ 已完成的修复

### 1. Firebase 匿名认证 ✅
- 在 `App.tsx` 中添加了自动匿名登录
- 应用启动时自动认证，确保 Functions 可以工作
- 添加了认证就绪检查，避免在认证完成前渲染

### 2. 真实用户ID ✅
- 所有组件现在使用 `getCurrentUserId()` 获取真实用户ID
- 修改的文件：
  - `ChatScreen.tsx`
  - `ImageGenerationModal.tsx`
  - `PDFReadingModal.tsx`
  - `TattooGeneratorSheet.tsx`

### 3. 临时禁用Pro检查 ✅
- 前端和后端的Pro检查都已临时注释
- `isPro` 默认设为 `true`
- 现在所有功能都可以测试，无需Pro订阅

---

## 🚀 启动和测试步骤

### 步骤1：确保Firebase配置正确

检查 `app.json` 中的 Firebase 配置：
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

### 步骤2：确保Firebase服务已启用

在 Firebase Console (https://console.firebase.google.com) 中：

1. **Authentication**:
   - 进入 "Authentication" → "Sign-in method"
   - 启用 "Anonymous" 登录

2. **Storage**:
   - 进入 "Storage"
   - 创建存储桶（如果还没有）
   - 设置安全规则（测试时可以使用宽松规则）

3. **Functions**:
   - 确保 Functions 已部署：
   ```bash
   cd functions
   npm install
   npm run build
   firebase deploy --only functions
   ```

### 步骤3：启动Expo应用

```bash
cd ~/Desktop/AI聚合器开发方式Two
npx expo start
```

或使用脚本：
```bash
./启动Expo.sh
```

### 步骤4：在手机上打开

1. 安装 Expo Go App（如果还没有）
2. 扫描终端显示的二维码
3. 等待应用加载

---

## 🧪 功能测试

### 测试1：AI对话（Chat）✅

**位置**：主聊天界面

**测试步骤**：
1. ✅ 打开应用，等待"正在初始化..."消失
2. ✅ 查看控制台，应该看到 "✅ 匿名登录成功" 或 "✅ 用户已登录"
3. ✅ 选择模型（建议先用 `DeepSeek V3`，这是免费模型）
4. ✅ 在输入框输入消息（例如："Hello, how are you?"）
5. ✅ 点击发送按钮或按回车
6. ✅ 应该看到：
   - Loading 状态（打字指示器）
   - AI 回复出现

**预期结果**：
- ✅ 消息发送成功
- ✅ 收到AI回复
- ✅ 对话历史保存

**如果失败**：
- 检查控制台错误
- 检查 Functions 日志：`firebase functions:log`
- 确认 OpenRouter API Key 正确

---

### 测试2：图片生成（Image Generation）✅

**位置**：点击聊天界面中的 "🎨 AI Image Generator" 按钮

**测试步骤**：
1. ✅ 在主聊天界面，找到 "🎨 AI Image Generator" 按钮
2. ✅ 点击打开模态框
3. ✅ 在输入框输入图片描述（例如："a beautiful sunset over the ocean with mountains"）
4. ✅ （可选）点击上传参考图片
5. ✅ 点击 "Generate Image" 按钮
6. ✅ 应该看到：
   - Loading 状态（"Generating..."）
   - 生成的图片显示
   - "Download" 和 "Generate Another" 按钮

**预期结果**：
- ✅ 图片生成成功
- ✅ 图片正确显示
- ✅ 可以下载图片

**如果失败**：
- 检查控制台错误
- 检查 Functions 日志
- 确认 FLUX 模型ID正确（可能需要验证）
- 检查图片URL是否正确返回

---

### 测试3：PDF阅读（PDF Reading）✅

**位置**：点击聊天界面中的 "📄 PDF Reading" 按钮

**测试步骤**：
1. ✅ 在主聊天界面，找到 "📄 PDF Reading" 按钮
2. ✅ 点击打开模态框
3. ✅ 点击上传区域，选择一个PDF文件
4. ✅ 等待PDF上传完成
5. ✅ 在问题输入框输入问题（例如："What is this document about?"）
6. ✅ 点击 "Analyze PDF" 按钮
7. ✅ 应该看到：
   - Loading 状态（"Reading PDF..." → "Analyzing document..."）
   - AI回答显示
   - "Ask Another Question" 按钮（可以继续提问）

**预期结果**：
- ✅ PDF上传成功
- ✅ 获得AI回答
- ✅ 可以继续提问（使用相同PDF）

**如果失败**：
- 检查控制台错误
- 检查 Functions 日志
- 确认 MiMo-V2-Flash 模型ID正确
- 检查PDF文件大小（限制10MB）
- 确认PDF URL是否正确上传到Storage

---

## 📋 测试检查清单

### 基础检查
- [ ] 应用启动成功
- [ ] 匿名登录成功（查看控制台）
- [ ] 没有错误提示
- [ ] UI正常显示

### Chat功能
- [ ] 可以选择模型
- [ ] 可以输入消息
- [ ] 可以发送消息
- [ ] 收到AI回复
- [ ] 对话历史正确显示

### 图片生成
- [ ] 可以打开图片生成模态框
- [ ] 可以输入提示词
- [ ] 可以上传参考图片（可选）
- [ ] 可以生成图片
- [ ] 图片正确显示
- [ ] 可以下载图片

### PDF阅读
- [ ] 可以打开PDF阅读模态框
- [ ] 可以上传PDF文件
- [ ] 可以输入问题
- [ ] 可以分析PDF
- [ ] 获得AI回答
- [ ] 可以继续提问

---

## 🐛 常见问题排查

### 问题1：应用卡在"正在初始化..."
**原因**：Firebase认证失败
**解决**：
1. 检查 Firebase 配置是否正确
2. 检查是否启用了匿名登录
3. 查看控制台错误信息

### 问题2：API调用失败（unauthenticated错误）
**原因**：认证未完成或Functions未部署
**解决**：
1. 确认匿名登录成功（查看控制台）
2. 确认 Functions 已部署
3. 检查 Functions 日志

### 问题3：图片生成失败
**原因**：模型ID错误或端点不正确
**解决**：
1. 检查 OpenRouter 文档确认 FLUX 模型ID
2. 检查 Functions 日志查看详细错误
3. 可能需要使用不同的API端点

### 问题4：PDF阅读失败
**原因**：模型不支持PDF或需要转换
**解决**：
1. 检查 MiMo-V2-Flash 是否支持PDF
2. 可能需要先将PDF转换为图片
3. 检查PDF文件大小（限制10MB）

### 问题5：文件上传失败
**原因**：Storage未配置或权限问题
**解决**：
1. 检查 Firebase Storage 是否已创建
2. 检查 Storage 安全规则
3. 检查文件大小限制

---

## 📝 测试后的下一步

测试成功后，需要：

1. **恢复Pro检查**：
   - 取消注释所有Pro检查代码
   - 将 `isPro` 默认值改回 `false`

2. **实现真实认证**：
   - 添加邮箱/密码登录
   - 或添加 Google 登录

3. **实现Pro订阅**：
   - 集成支付系统
   - 实现订阅管理

4. **优化功能**：
   - 验证所有模型ID
   - 优化错误处理
   - 添加更多功能

---

## 🎯 快速测试命令

```bash
# 1. 启动Expo
cd ~/Desktop/AI聚合器开发方式Two
npx expo start

# 2. 查看Functions日志（另一个终端）
firebase functions:log

# 3. 检查Functions状态
firebase functions:list
```

---

**现在可以在 Expo 中完整测试所有三个核心功能了！** 🎉

如果遇到任何问题，请查看控制台日志和 Functions 日志来诊断。
