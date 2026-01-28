# 🔧 修复 import.meta 错误

## ✅ 已修复

已修复 `import.meta.env` 在 Expo 中不兼容的问题。

### 修复内容：

1. **更新 `src/config/firebase.ts`**:
   - 移除了 `import.meta.env`（Vite 特有语法）
   - 使用 `expo-constants` 的 `Constants.expoConfig.extra` 读取环境变量
   - 添加了 `process.env` 作为后备方案
   - 创建了 `getEnvVar` 辅助函数来统一处理环境变量

2. **更新 `app.json`**:
   - 添加了 `extra` 字段，用于存储 Firebase 配置
   - 可以通过 `Constants.expoConfig.extra` 访问这些值

---

## 📝 配置 Firebase

### 方式1：在 app.json 中配置（推荐用于 Expo）

编辑 `app.json`，在 `extra` 字段中填入你的 Firebase 配置：

```json
{
  "expo": {
    "extra": {
      "VITE_FIREBASE_API_KEY": "你的实际API Key",
      "VITE_FIREBASE_AUTH_DOMAIN": "你的项目.firebaseapp.com",
      "VITE_FIREBASE_PROJECT_ID": "你的项目ID",
      "VITE_FIREBASE_STORAGE_BUCKET": "你的项目.appspot.com",
      "VITE_FIREBASE_MESSAGING_SENDER_ID": "你的Sender ID",
      "VITE_FIREBASE_APP_ID": "你的App ID"
    }
  }
}
```

### 方式2：使用环境变量（需要额外配置）

如果你想使用 `.env` 文件，需要安装 `react-native-dotenv` 并配置 Babel。

---

## 🚀 现在可以启动

```bash
cd ~/Desktop/AI聚合器开发方式Two
npx expo start
```

---

## ⚠️ 重要提示

- **不要提交敏感信息**：如果 `app.json` 包含真实的 Firebase 配置，确保不要提交到 Git
- **使用 .gitignore**：确保 `.env` 文件在 `.gitignore` 中
- **生产环境**：在生产环境中，使用 Expo EAS Secrets 或类似的安全方式存储敏感配置

---

**现在应该可以正常启动了！** ✅
