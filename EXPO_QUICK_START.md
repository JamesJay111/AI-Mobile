# 🚀 Expo 快速启动指南 (SDK 54)

## 一键启动命令

### 方式1：使用脚本（推荐）
```bash
./start-expo.sh
```

### 方式2：直接命令
```bash
npx expo start --qr
```

### 方式3：使用npm script
```bash
npm run expo:qr
```

---

## 📱 扫描二维码

启动后，终端会显示二维码。使用以下方式扫描：

1. **iOS**: 使用相机App或Expo Go App
2. **Android**: 使用Expo Go App
3. **Web**: 在终端按 `w` 键

---

## 🔧 安装依赖（首次使用）

如果还没有安装Expo依赖，运行：

```bash
# 安装Expo CLI（全局）
npm install -g @expo/cli

# 安装项目依赖
npm install expo@~54.0.0 expo-router@~4.0.0 react-native@0.76.5 react-native-web@~0.19.13 expo-status-bar@~2.0.0 expo-constants@~17.0.0 expo-linking@~7.0.0 expo-splash-screen@~0.29.0 expo-system-ui@~4.0.0 react-native-safe-area-context@4.12.0 react-native-screens@~4.4.0 @react-navigation/native@^6.1.18

# 安装开发依赖
npm install --save-dev @babel/core@^7.25.0 @types/react@~18.3.0
```

---

## ⌨️ 终端快捷键

启动后，可以使用以下快捷键：

- `q` - 显示/隐藏二维码
- `r` - 重新加载应用
- `w` - 在Web浏览器中打开
- `a` - 在Android模拟器中打开
- `i` - 在iOS模拟器中打开
- `m` - 切换菜单
- `c` - 清除缓存并重启

---

## 📋 完整命令列表

```bash
# 启动并显示二维码
npx expo start --qr

# 启动并清除缓存
npx expo start --clear --qr

# 在iOS模拟器中启动
npx expo start --ios

# 在Android模拟器中启动
npx expo start --android

# 在Web浏览器中启动
npx expo start --web

# 使用npm scripts
npm run expo:start    # 启动
npm run expo:qr       # 启动并显示二维码
npm run expo:android  # Android
npm run expo:ios      # iOS
npm run expo:web      # Web
```

---

## ⚠️ 注意事项

1. **首次运行**: 需要安装Expo Go App到手机
2. **网络**: 确保手机和电脑在同一WiFi网络
3. **防火墙**: 可能需要允许Expo通过防火墙
4. **端口**: 默认使用19000和19001端口

---

## 🐛 常见问题

### 二维码不显示
```bash
# 按 'q' 键显示二维码
# 或使用 --qr 参数
npx expo start --qr
```

### 连接失败
```bash
# 清除缓存并重启
npx expo start --clear --qr
```

### 模块找不到
```bash
# 重新安装依赖
rm -rf node_modules
npm install
npx expo start --clear
```

---

**现在运行 `./start-expo.sh` 或 `npx expo start --qr` 即可启动！** 🎉
