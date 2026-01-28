# 🔧 修复 iOS 模拟器问题

## 当前问题

1. **依赖版本警告**（不影响运行，但建议修复）
2. **iOS 模拟器无可用设备**（主要问题）

---

## 🚀 快速修复

### 方法 1：使用修复脚本（推荐）

```bash
cd "/Users/niyutong/Desktop/AI聚合器开发方式Two"
./fix-ios-simulator.sh
```

### 方法 2：手动修复

#### 步骤 1：打开 Xcode 并下载 iOS 运行时

1. 打开 **Xcode**
2. 菜单：**Xcode → Settings**（或 **Preferences**）
3. 点击 **Platforms**（或 **Components**）标签
4. 下载 **iOS** 运行时（如果还没有）
   - 选择最新的 iOS 版本
   - 点击下载按钮
   - 等待下载完成（可能需要几分钟）

#### 步骤 2：创建 iOS 模拟器设备

1. 打开 **Simulator** 应用
   - 在 Xcode 中：**Xcode → Open Developer Tool → Simulator**
   - 或 Spotlight 搜索 "Simulator"

2. 创建新设备：
   - 菜单：**File → New Simulator**
   - 选择设备类型（如 iPhone 15）
   - 选择 iOS 版本
   - 点击 **Create**

#### 步骤 3：验证设备可用

在终端运行：

```bash
xcrun simctl list devices available
```

应该看到类似输出：
```
-- iOS 17.0 --
    iPhone 15 (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX) (Booted)
```

#### 步骤 4：重新启动开发环境

```bash
npm run dev:ios
```

---

## 📦 修复依赖版本警告（可选）

依赖版本警告不会阻止应用运行，但如果你想修复：

### 选项 1：忽略警告（推荐）

这些警告不会影响开发，可以暂时忽略。

### 选项 2：更新依赖（如果遇到问题）

```bash
cd "/Users/niyutong/Desktop/AI聚合器开发方式Two"
npm install --legacy-peer-deps
```

**注意**：这可能需要较长时间，并且可能引入其他兼容性问题。

---

## 🎯 临时解决方案：使用 Web 浏览器

如果模拟器问题暂时无法解决，可以使用 Web 浏览器进行开发：

```bash
npm run expo:web
```

或者：

```bash
npx expo start
# 然后按 'w' 键在浏览器中打开
```

这样可以在浏览器中测试应用，实现"边写边看"的效果。

---

## 🔍 检查清单

完成以下检查：

- [ ] Xcode 已完全安装
- [ ] iOS 运行时已下载（Xcode → Settings → Platforms）
- [ ] 至少有一个 iOS 模拟器设备（Simulator → File → New Simulator）
- [ ] 模拟器可以正常启动
- [ ] `xcrun simctl list devices available` 显示可用设备

---

## 🐛 常见问题

### 问题 1：`No iOS devices available in Simulator.app`

**原因**：没有可用的 iOS 模拟器设备

**解决方案**：
1. 打开 Simulator
2. File → New Simulator
3. 创建一个新的 iPhone 设备

### 问题 2：`CoreSimulatorService connection became invalid`

**原因**：模拟器服务崩溃或未启动

**解决方案**：
```bash
# 重启模拟器服务
killall Simulator
killall com.apple.CoreSimulator.CoreSimulatorService
open -a Simulator
```

### 问题 3：依赖版本警告

**原因**：package.json 中的版本与实际安装的版本不匹配

**解决方案**：
- 可以暂时忽略（不影响运行）
- 或运行 `npm install --legacy-peer-deps`

---

## ✅ 验证修复

运行以下命令验证：

```bash
# 1. 检查模拟器设备
xcrun simctl list devices available

# 2. 启动模拟器
open -a Simulator

# 3. 启动 Expo
npm run expo:ios
```

如果一切正常，应该看到：
- ✅ Expo 开发服务器启动
- ✅ iOS 模拟器打开
- ✅ 应用加载到模拟器中

---

## 🎉 完成！

修复完成后，运行：

```bash
npm run dev:ios
```

享受边写边看的开发体验！
