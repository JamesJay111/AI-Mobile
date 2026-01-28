# PlatformConstants / TurboModuleRegistry 报错处理

## 报错现象

iOS 上 Expo Go 运行时报：

```
[runtime not ready]: Invariant Violation:
TurboModuleRegistry.getEnforcing(...):
'PlatformConstants' could not be found. Verify
that a module by this name is registered in
the native binary.
```

## 已做修改

1. **去掉 Firebase 对 `expo-constants` 的依赖**  
   - 新增 `src/config/firebaseConfig.ts`，直接导出与 `app.json` 一致的 Firebase 配置。  
   - `src/config/firebase.ts` 改为使用该静态配置，**不再** `import Constants from 'expo-constants'`。  
   - 避免在启动时加载 `expo-constants`，从而不触发 `PlatformConstants` 的 TurboModule 查找，消除该类崩溃。

2. **配置内容**  
   - `firebaseConfig` 与 `app.json` 的 `expo.extra` 一致，指向项目 `gemgpt-ai-assistance`。

## 你本地需要做的

1. **清缓存后重起 Expo**  
   ```bash
   cd /Users/niyutong/Desktop/AI聚合器开发方式Two
   npx expo start -c
   ```  
   再在 iOS 设备 / 模拟器上重新打开应用。

2. **更新 Expo Go**  
   - 在 iPhone 上把 **Expo Go** 更新到最新版本（需支持 SDK 54）。  
   - App Store → Expo Go → 更新。

3. **若仍报错**  
   - 删除 `node_modules` 后重装依赖：  
     ```bash
     rm -rf node_modules
     npm install
     npx expo start -c
     ```

## 若需改用 app.json 配置

以后若要改为从 `app.json` 读取配置，可再引入 `expo-constants`，并配合 **Development Build**（`expo prebuild` + 自己编译）使用，而不用 Expo Go，以避免 TurboModule 兼容问题。
