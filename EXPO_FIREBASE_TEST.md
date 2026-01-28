# Expo + Firebase 真实联调测试（Chat / 图片生成 / PDF）

Expo 前端已对接 **已部署的 Firebase**（Cloud Functions `chatCompletion`、`generateImage`、`readPDF`）。按下面步骤可在 Expo 中**真实调用**并验证三项功能。

---

## 1. 前置条件

- **Firebase**：Project `gemgpt-ai-assistance`，Functions 已通过 GitHub Actions 部署到 `us-central1`。
- **Firebase 控制台**：已开启 **Authentication（Anonymous）**、**Storage**（PDF / 参考图上传用）。
- **app.json**：`expo.extra` 中已配置同上项目的 Web 应用 Firebase 配置。

---

## 2. 启动 Expo

在项目根目录执行：

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
npx expo start
```

- **建议先用 Web 测试**（PDF 上传、参考图上传依赖文件选择）：
  - 终端按 **`w`**，或直接 `npx expo start --web`
- 真机：终端按 **`q`** 显示二维码，用 Expo Go 扫码。

启动后会先匿名登录 Firebase，控制台可见 `✅ 匿名登录成功` / `✅ 用户已登录`。出现「正在初始化...」后进入首页即表示已连上 Firebase。

---

## 3. 在 Expo 里测 Chat、图片生成、PDF

进入 **Chat** Tab（底部 **对话**），首页即「Help With Any Task」卡片。

### 3.1 测试 Chat（AI 对话）

1. 在页面**底部输入框**输入内容，例如：`你好，请用一句话介绍你自己`。
2. 点击发送。
3. **预期**：先出现加载状态，随后收到 AI 回复（走 `chatCompletion` Cloud Function）。
4. **失败**：若提示未登录、网络错误等，检查 Firebase 匿名登录是否成功、控制台报错。

### 3.2 测试图片生成

1. 在「Help With Any Task」横向卡片里，点击 **「Image Generation」**（🎨 Turn text into images）。
2. 在弹窗中**输入描述**，如：`a cute cat sitting on a laptop`；可选「Add reference image」上传参考图（Web 才支持）。
3. 点击 **Generate Image**。
4. **预期**：loading 后显示生成的图片，可下载（走 `generateImage` Cloud Function）。
5. **失败**：若报错，看弹窗内错误信息；图片模型或返回格式异常时可能无图，需查 Functions 日志。

### 3.3 测试 PDF Reading

1. 在同一排卡片中点击 **「PDF Reading」**（📄 Upload and analyze PDF documents）。
2. 在弹窗中**选择 PDF 文件**（Web 用文件选择；真机需后续适配）。
3. 输入**问题**，例如：`这篇文章的主要内容是什么？`
4. 点击 **Analyze**（或等同按钮）。
5. **预期**：先上传到 Storage，再调用 `readPDF`，显示分析结果。
6. **失败**：上传失败检查 Storage 规则；分析失败检查 Functions 日志。

---

## 4. 技术说明

- **Functions 区域**：`src/config/firebase.ts` 中已设置 `getFunctions(app, 'us-central1')`，与部署区域一致。
- **调用方式**：Chat / 图片 / PDF 均通过 `httpsCallable` 调用对应 Cloud Function，未走本地模拟。
- **认证**：匿名登录后 `auth.currentUser.uid` 作为 `userId` 传入 Functions；未登录无法正常调用。

---

## 5. 小结

| 功能         | 入口                     | 调用的 Cloud Function |
|--------------|--------------------------|------------------------|
| Chat         | 底部输入框 → 发送        | `chatCompletion`       |
| 图片生成     | Image Generation 卡片    | `generateImage`        |
| PDF Reading  | PDF Reading 卡片         | `readPDF`              |

按上述流程在 Expo（建议先 Web）中操作，即可**真实测试**三项功能是否与 Firebase 部署结果一致。
