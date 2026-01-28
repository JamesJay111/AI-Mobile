# Expo 部署指南 (SDK 54)

## 📱 快速开始

### 1. 安装Expo CLI（如果还没有）
```bash
npm install -g expo-cli
# 或者
npm install -g @expo/cli
```

### 2. 安装依赖
```bash
# 备份当前package.json（如果需要）
cp package.json package.json.backup

# 安装Expo依赖
npm install expo@~54.0.0 expo-router@~4.0.0 react-native@0.76.5 react-native-web@~0.19.13 expo-status-bar@~2.0.0 expo-constants@~17.0.0 expo-linking@~7.0.0 expo-splash-screen@~0.29.0 expo-system-ui@~4.0.0 react-native-safe-area-context@4.12.0 react-native-screens@~4.4.0 @react-navigation/native@^6.1.18

# 安装开发依赖
npm install --save-dev @babel/core@^7.25.0 @types/react@~18.3.0
```

### 3. 更新package.json
将以下scripts添加到你的package.json：
```json
{
  "scripts": {
    "expo:start": "expo start",
    "expo:android": "expo start --android",
    "expo:ios": "expo start --ios",
    "expo:web": "expo start --web",
    "expo:qr": "expo start --qr"
  }
}
```

### 4. 启动Expo开发服务器
```bash
npx expo start
```

或者使用npm script：
```bash
npm run expo:start
```

### 5. 显示二维码
```bash
npx expo start --qr
```

或者启动后按 `q` 键显示二维码。

---

## 🚀 一键启动命令

### 方式1：直接启动（推荐）
```bash
npx expo start --qr
```

### 方式2：使用npm script
```bash
npm run expo:start
# 然后在终端按 'q' 键显示二维码
```

### 方式3：使用完整命令
```bash
npx expo start --clear --qr
```

---

## 📱 扫描二维码

1. **iOS设备**: 使用相机App扫描二维码，或使用Expo Go App
2. **Android设备**: 使用Expo Go App扫描二维码
3. **Web浏览器**: 在终端按 `w` 键在浏览器中打开

---

## 🔧 配置说明

### app.json
- SDK版本: 54.0.0
- 应用名称: GemGPT
- 支持平台: iOS, Android, Web

### 入口文件
- `App.tsx` - Expo入口文件
- `src/App.tsx` - 你的React应用主文件

---

## ⚠️ 注意事项

### 1. 依赖兼容性
某些Web专用库可能不兼容React Native：
- `@radix-ui/*` - 这些是Web专用组件，在React Native中不可用
- `lucide-react` - 需要替换为 `react-native-vector-icons` 或 `@expo/vector-icons`
- `tailwindcss` - 需要配置 `nativewind` 或使用 `react-native` 样式

### 2. Firebase配置
确保Firebase配置在Expo中正常工作：
- 检查 `src/config/firebase.ts`
- 可能需要使用 `expo-constants` 来读取环境变量

### 3. 文件路径
- 图片资源需要使用 `require()` 或 `expo-asset`
- 不能使用 `import` 导入图片路径

---

## 🐛 常见问题

### 问题1: 模块找不到
```bash
# 清除缓存并重新安装
rm -rf node_modules
npm install
npx expo start --clear
```

### 问题2: Metro bundler错误
```bash
# 重置Metro缓存
npx expo start --clear
```

### 问题3: TypeScript错误
```bash
# 确保使用expo的tsconfig
cp tsconfig.expo.json tsconfig.json
```

---

## 📝 下一步

1. 测试所有功能在移动设备上是否正常工作
2. 替换不兼容的Web组件为React Native组件
3. 配置原生模块（如果需要）
4. 构建生产版本

---

## 🎯 快速命令参考

```bash
# 启动开发服务器（显示二维码）
npx expo start --qr

# 启动并清除缓存
npx expo start --clear --qr

# 在iOS模拟器中打开
npx expo start --ios

# 在Android模拟器中打开
npx expo start --android

# 在Web浏览器中打开
npx expo start --web
```
