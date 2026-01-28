# 📱 启动 iOS 模拟器完整指南

## 🎯 你已经完成：下载 iOS 运行时 ✅

现在需要创建模拟器设备并启动它。

---

## 🚀 方法 1：使用 Simulator 应用（最简单）

### 步骤 1：打开 Simulator 应用

有几种方式：

**方式 A：从 Spotlight 搜索**
1. 按 `⌘ + Space` 打开 Spotlight
2. 输入 "Simulator"
3. 按 Enter 打开

**方式 B：从 Xcode**
1. 打开 Xcode
2. 菜单：**Xcode → Open Developer Tool → Simulator**

**方式 C：从终端**
```bash
open -a Simulator
```

### 步骤 2：创建 iOS 设备（如果还没有）

1. 在 Simulator 中，菜单：**File → New Simulator**
2. 在弹出的对话框中：
   - **Device Type**：选择 "iPhone 15" 或 "iPhone 15 Pro"（推荐）
   - **OS Version**：选择你下载的 iOS 版本（如 iOS 17.2）
3. 点击 **Create**

### 步骤 3：启动设备

设备创建后会自动启动，或者：
- 在 Simulator 窗口左侧的设备列表中，点击你的设备
- 如果设备显示为灰色，双击它来启动

---

## 🚀 方法 2：使用命令行（快速）

### 步骤 1：查看可用的运行时

```bash
xcrun simctl list runtimes available
```

找到你下载的 iOS 版本（如 `iOS 17.2`）

### 步骤 2：查看可用的设备类型

```bash
xcrun simctl list devicetypes | grep iPhone
```

### 步骤 3：创建并启动设备

```bash
# 创建 iPhone 15 设备（使用你下载的 iOS 版本）
xcrun simctl create "iPhone 15" "iPhone 15" "iOS 17.2"

# 启动设备
xcrun simctl boot "iPhone 15"

# 打开 Simulator 应用
open -a Simulator
```

**注意**：将 `"iOS 17.2"` 替换为你实际下载的 iOS 版本。

---

## ✅ 验证模拟器已启动

运行以下命令检查：

```bash
xcrun simctl list devices | grep Booted
```

应该看到类似输出：
```
iPhone 15 (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX) (Booted)
```

或者在 Simulator 窗口中，设备应该显示为运行状态。

---

## 🎯 下一步：启动 Expo 开发环境

模拟器启动后，运行：

```bash
cd "/Users/niyutong/Desktop/AI聚合器开发方式Two"
npm run dev:ios
```

或者：

```bash
npx expo start --ios
```

这会：
1. 启动 Expo 开发服务器
2. 自动将应用加载到模拟器中
3. 实现"边写边看"的开发体验

---

## 🔧 如果遇到问题

### 问题 1：找不到设备

**解决方案**：
```bash
# 查看所有设备
xcrun simctl list devices

# 查看可用的设备
xcrun simctl list devices available
```

### 问题 2：设备无法启动

**解决方案**：
```bash
# 关闭所有模拟器
killall Simulator

# 重新打开
open -a Simulator

# 然后手动在 Simulator 中选择设备
```

### 问题 3：iOS 版本名称不匹配

**解决方案**：
```bash
# 查看确切的运行时名称
xcrun simctl list runtimes

# 使用完整的运行时标识符，例如：
# "com.apple.CoreSimulator.SimRuntime.iOS-17-2"
```

---

## 📋 快速命令参考

```bash
# 打开 Simulator
open -a Simulator

# 查看可用设备
xcrun simctl list devices available

# 查看已启动的设备
xcrun simctl list devices | grep Booted

# 启动特定设备（替换 DEVICE_ID）
xcrun simctl boot DEVICE_ID

# 关闭设备
xcrun simctl shutdown all

# 删除设备
xcrun simctl delete DEVICE_ID
```

---

## 🎉 完成！

模拟器启动后，你就可以：
- ✅ 在 Cursor 中写代码（左边 2/3 屏幕）
- ✅ 在模拟器中实时查看效果（右边 1/3 屏幕）
- ✅ 修改代码后自动热重载

享受开发吧！🚀
