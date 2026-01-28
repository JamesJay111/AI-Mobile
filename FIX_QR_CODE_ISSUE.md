# 🔧 修复 --qr 选项错误

## ❌ 问题

运行 `npx expo start --qr` 时出现错误：
```
unknown or unexpected option: --qr
```

## ✅ 原因

Expo CLI 54.0.22 版本**不支持** `--qr` 选项。

在新版本的 Expo CLI 中，二维码会在启动后自动显示，或者可以通过按 `q` 键来显示/隐藏。

## 🚀 正确的使用方法

### 方法 1：启动后按 'q' 键（推荐）

```bash
# 1. 启动 Expo
npx expo start

# 2. 等待启动完成（会显示菜单）

# 3. 按 'q' 键显示二维码
```

### 方法 2：使用修复后的脚本

```bash
npm run dev:phone
```

脚本已经修复，会自动启动 Expo，然后你只需要按 `q` 键即可显示二维码。

---

## 📋 完整的操作流程

### 真机测试（iPhone 17 Pro Max）

```bash
# 1. 启动 Expo
npm run dev:phone

# 2. 等待启动完成（约 5-10 秒）

# 3. 在终端按 'q' 键显示二维码

# 4. 在 iPhone 上：
#    - 打开 Expo Go App，或
#    - 使用相机 App 扫描二维码

# 5. 应用会自动加载到 iPhone 上
```

---

## ⌨️ Expo 终端快捷键

启动 Expo 后，可以使用以下快捷键：

- `q` - **显示/隐藏二维码** ⭐ 重要！
- `r` - 重新加载应用
- `w` - 在 Web 浏览器中打开
- `a` - 在 Android 模拟器中打开
- `i` - 在 iOS 模拟器中打开
- `m` - 切换菜单
- `c` - 清除缓存并重启
- `Ctrl + C` - 停止开发服务器

---

## ✅ 已修复的文件

- ✅ `start-dev-phone.sh` - 真机测试脚本
- ✅ `package.json` - 移除了 `expo:qr` 中的 `--qr` 选项

---

## 🎯 现在可以正常使用了

运行：

```bash
npm run dev:phone
```

然后：
1. 等待 Expo 启动
2. 按 `q` 键显示二维码
3. 在 iPhone 上扫描二维码

完成！🎉
