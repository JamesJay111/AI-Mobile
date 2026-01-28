# 🚀 Expo 启动指令

## 一键启动（显示二维码）

### 方式1：使用启动脚本
```bash
./start-expo.sh
```

### 方式2：直接命令（推荐）
```bash
npx expo start --qr
```

### 方式3：使用npm script
```bash
npm run expo:qr
```

---

## 📱 扫描二维码

启动后，终端会显示二维码：

```
┌─────────────────────────┐
│                         │
│    [二维码图像]          │
│                         │
└─────────────────────────┘
```

### 扫描方式：
1. **iOS设备**: 
   - 使用相机App扫描（自动打开Expo Go）
   - 或打开Expo Go App → 扫描二维码

2. **Android设备**:
   - 打开Expo Go App → 扫描二维码

3. **Web浏览器**:
   - 在终端按 `w` 键

---

## 🔧 首次使用需要安装

如果还没有安装Expo，运行：

```bash
# 安装Expo CLI
npm install -g @expo/cli

# 安装项目依赖
npm install expo@~54.0.0 expo-router@~4.0.0 react-native@0.76.5 react-native-web@~0.19.13 expo-status-bar@~2.0.0 expo-constants@~17.0.0 expo-linking@~7.0.0 expo-splash-screen@~0.29.0 expo-system-ui@~4.0.0 react-native-safe-area-context@4.12.0 react-native-screens@~4.4.0 @react-navigation/native@^6.1.18

# 安装开发依赖
npm install --save-dev @babel/core@^7.25.0 @types/react@~18.3.0
```

---

## ⌨️ 终端快捷键

启动后可以使用：

- `q` - 显示/隐藏二维码
- `r` - 重新加载应用
- `w` - 在Web浏览器中打开
- `a` - 在Android模拟器中打开
- `i` - 在iOS模拟器中打开
- `c` - 清除缓存并重启
- `m` - 切换菜单

---

## 📋 完整命令列表

```bash
# 启动并显示二维码（推荐）
npx expo start --qr

# 启动并清除缓存
npx expo start --clear --qr

# 在Web浏览器中打开
npx expo start --web

# 在iOS模拟器中打开
npx expo start --ios

# 在Android模拟器中打开
npx expo start --android

# 使用npm scripts
npm run expo:start    # 启动
npm run expo:qr       # 启动并显示二维码
npm run expo:android  # Android
npm run expo:ios      # iOS
npm run expo:web      # Web
```

---

## ⚠️ 注意事项

1. **网络要求**: 手机和电脑必须在同一WiFi网络
2. **防火墙**: 可能需要允许Expo通过防火墙
3. **端口**: Expo使用19000和19001端口
4. **Expo Go**: 需要在手机上安装Expo Go App

---

## 🐛 问题排查

### 二维码不显示
```bash
# 按 'q' 键
# 或使用 --qr 参数
npx expo start --qr
```

### 连接失败
```bash
# 清除缓存
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

**现在运行 `npx expo start --qr` 即可启动并显示二维码！** 🎉
