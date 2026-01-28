# 🔧 修复 Firebase 在 React Native 中的初始化问题

## ❌ 问题

在 React Native/Expo 环境中运行时出现错误：
```
Component auth has not been registered yet
```

## ✅ 解决方案

### 1. 安装 AsyncStorage

Firebase Auth 在 React Native 中需要 AsyncStorage 来持久化认证状态：

```bash
npm install @react-native-async-storage/async-storage --legacy-peer-deps
```

### 2. 更新 Firebase 配置

已更新 `src/config/firebase.ts` 以支持 React Native 环境：

- ✅ 检测平台（Web vs React Native）
- ✅ 在 React Native 中使用 `initializeAuth` 和 `AsyncStorage`
- ✅ 在 Web 中使用标准的 `getAuth`
- ✅ 处理已初始化的情况（避免重复初始化错误）

### 3. 关键改动

```typescript
// React Native 环境
if (Platform.OS !== 'web') {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  // Web 环境
  auth = getAuth(app);
}
```

## 🚀 测试

1. **重新启动 Expo**：
   ```bash
   # 停止当前进程（Ctrl+C）
   npx expo start --clear
   ```

2. **在 iPhone/模拟器上打开应用**

3. **检查控制台**：
   - 应该看到 "✅ 匿名登录成功"
   - 不应该再看到 "Component auth has not been registered yet" 错误

## 📋 验证清单

- [x] AsyncStorage 已安装
- [x] Firebase 配置已更新
- [x] 支持 React Native 和 Web 环境
- [x] 处理初始化错误

## 🐛 如果还有问题

### 问题 1：仍然看到初始化错误

**解决方案**：
1. 清除缓存并重新启动：
   ```bash
   npx expo start --clear
   ```
2. 在 iPhone 上完全关闭 Expo Go，然后重新打开

### 问题 2：AsyncStorage 导入失败

**解决方案**：
- 确保已安装：`npm list @react-native-async-storage/async-storage`
- 如果未安装，运行：`npm install @react-native-async-storage/async-storage --legacy-peer-deps`

### 问题 3：认证状态不持久

**解决方案**：
- 这是正常的，因为使用了 AsyncStorage persistence
- 如果希望持久化，确保 AsyncStorage 正常工作

---

## ✅ 完成！

现在 Firebase Auth 应该在 React Native 环境中正常工作了。

**下一步**：重新启动 Expo 并测试应用！
