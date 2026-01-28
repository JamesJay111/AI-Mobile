# 📱 Expo 部署说明

## 🎯 目标
将GemGPT应用部署到Expo环境，支持在移动设备上通过二维码扫描运行。

## ✅ 已完成的配置

### 1. 配置文件
- ✅ `app.json` - Expo配置文件（SDK 54）
- ✅ `babel.config.js` - Babel配置
- ✅ `tsconfig.expo.json` - TypeScript配置
- ✅ `expo-env.d.ts` - Expo类型定义

### 2. 入口文件
- ✅ `App.tsx` - Expo入口文件（适配Web和移动端）

### 3. 启动脚本
- ✅ `start-expo.sh` - 一键启动脚本（显示二维码）

### 4. 文档
- ✅ `EXPO_SETUP.md` - 详细设置指南
- ✅ `EXPO_QUICK_START.md` - 快速启动指南

---

## 🚀 快速启动

### 最简单的方式
```bash
./start-expo.sh
```

### 或者直接运行
```bash
npx expo start --qr
```

### 使用npm script
```bash
npm run expo:qr
```

---

## 📱 使用步骤

1. **安装Expo Go App**
   - iOS: App Store搜索"Expo Go"
   - Android: Google Play搜索"Expo Go"

2. **启动开发服务器**
   ```bash
   npx expo start --qr
   ```

3. **扫描二维码**
   - 使用Expo Go App扫描终端显示的二维码
   - 或使用iOS相机App扫描（会自动打开Expo Go）

4. **开始开发**
   - 修改代码后，应用会自动热重载
   - 在终端按 `r` 键手动重新加载

---

## 🔧 依赖说明

### 必需依赖
- `expo@~54.0.0` - Expo SDK
- `react-native@0.76.5` - React Native
- `react-native-web@~0.19.13` - Web支持
- `expo-router@~4.0.0` - 路由（如果需要）

### 可选依赖
- `expo-status-bar` - 状态栏控制
- `expo-constants` - 常量访问
- `react-native-safe-area-context` - 安全区域
- `react-native-screens` - 屏幕管理

---

## ⚠️ 兼容性说明

### 当前状态
项目原本是为Web（Vite + React）设计的，包含一些Web专用组件：

**可能不兼容的组件**:
- `@radix-ui/*` - Web专用UI组件库
- `lucide-react` - 需要替换为 `@expo/vector-icons`
- `tailwindcss` - 需要配置 `nativewind` 或使用React Native样式

### 解决方案

#### 方案1：使用Web版本（推荐用于测试）
```bash
npx expo start --web
```
这样可以在浏览器中运行，所有Web组件都能正常工作。

#### 方案2：替换为React Native组件
- 将 `@radix-ui` 组件替换为React Native组件
- 将 `lucide-react` 图标替换为 `@expo/vector-icons`
- 配置 `nativewind` 或使用StyleSheet

---

## 📊 当前架构

```
App.tsx (Expo入口)
  └── src/App.tsx (你的React应用)
      ├── components/
      │   ├── ChatScreen.tsx
      │   ├── ImageGenerationModal.tsx
      │   └── ...
      ├── services/
      │   ├── openRouter.ts
      │   └── storageUpload.ts
      └── config/
          └── firebase.ts
```

---

## 🎯 下一步

1. **测试Web版本**
   ```bash
   npm run expo:web
   ```

2. **测试移动端**
   - 安装Expo Go App
   - 运行 `npx expo start --qr`
   - 扫描二维码

3. **处理兼容性问题**
   - 识别不兼容的组件
   - 替换为React Native版本
   - 或创建平台特定的实现

---

## 📝 命令参考

```bash
# 启动（显示二维码）
npx expo start --qr

# 启动（Web）
npx expo start --web

# 启动（iOS模拟器）
npx expo start --ios

# 启动（Android模拟器）
npx expo start --android

# 清除缓存
npx expo start --clear

# 使用脚本
./start-expo.sh
```

---

**现在可以运行 `./start-expo.sh` 或 `npx expo start --qr` 开始测试！** 🚀
