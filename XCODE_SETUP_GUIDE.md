# Xcode 配置指南 - Expo iOS 开发

## 📋 当前状态

你已经安装了 Xcode，但需要配置命令行工具才能使用 iOS 模拟器。

## 🔧 配置步骤

### 步骤 1：配置 Xcode 命令行工具

在终端中运行以下命令（需要输入密码）：

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

**说明**：
- 这会要求你输入 Mac 登录密码
- 输入密码时不会显示字符，这是正常的
- 按 Enter 确认

### 步骤 2：验证配置

运行以下命令检查是否配置成功：

```bash
xcode-select -p
```

**期望输出**：
```
/Applications/Xcode.app/Contents/Developer
```

如果显示的是 `/Library/Developer/CommandLineTools`，说明配置未成功，需要重新执行步骤 1。

### 步骤 3：检查 Xcode 版本

```bash
xcodebuild -version
```

**期望输出**（示例）：
```
Xcode 15.0
Build version 15A240d
```

如果出现错误，说明配置还未完成。

### 步骤 4：接受 Xcode 许可协议（如果需要）

如果步骤 3 提示需要接受许可协议，运行：

```bash
sudo xcodebuild -license accept
```

**或者**：
1. 打开 Xcode 应用
2. 首次打开时会提示接受许可协议
3. 点击"同意"即可

### 步骤 5：安装 iOS 模拟器（如果需要）

如果还没有安装 iOS 模拟器：

1. 打开 Xcode
2. 菜单：**Xcode → Settings → Platforms** (或 **Preferences → Components**)
3. 下载所需的 iOS 模拟器版本

或者运行：

```bash
xcodebuild -runFirstLaunch
```

## 🚀 启动 Expo iOS 模拟器

配置完成后，有两种方式启动：

### 方式 1：直接启动 iOS 模拟器

```bash
npx expo start --ios
```

### 方式 2：先启动 Expo，再打开模拟器

```bash
npx expo start
```

然后在 Expo 终端中按 `i` 键打开 iOS 模拟器。

## ✅ 验证清单

完成以下检查，确保一切就绪：

- [ ] `xcode-select -p` 显示 `/Applications/Xcode.app/Contents/Developer`
- [ ] `xcodebuild -version` 能正常显示版本号
- [ ] Xcode 许可协议已接受
- [ ] iOS 模拟器已安装（在 Xcode Settings 中检查）

## 🐛 常见问题

### 问题 1：`sudo: Operation not permitted`

**解决方案**：
- 在系统终端（Terminal.app）中运行，而不是在 Cursor 终端
- 或者检查系统设置 → 安全性与隐私 → 允许终端访问

### 问题 2：`xcodebuild: error: tool 'xcodebuild' requires Xcode`

**解决方案**：
- 确认步骤 1 已正确执行
- 再次运行：`sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`
- 验证：`xcode-select -p` 应该显示 Xcode.app 路径

### 问题 3：模拟器无法启动

**解决方案**：
- 确保 Xcode 已完全安装（打开 Xcode 一次，完成首次设置）
- 检查模拟器是否已安装：打开 Xcode → Settings → Platforms
- 尝试手动打开模拟器：`open -a Simulator`

### 问题 4：Expo 提示 "Xcode must be fully installed"

**解决方案**：
1. 打开 Xcode 应用
2. 完成首次设置向导
3. 接受许可协议
4. 重新运行 Expo 命令

## 📝 快速命令参考

```bash
# 配置 Xcode 命令行工具
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer

# 验证配置
xcode-select -p

# 检查版本
xcodebuild -version

# 接受许可协议
sudo xcodebuild -license accept

# 启动 Expo iOS
npx expo start --ios
```

## 🎯 下一步

配置完成后：
1. 运行 `npx expo start --ios` 启动 iOS 模拟器
2. 或者运行 `npx expo start` 然后按 `i` 键
3. 等待模拟器启动（首次启动可能需要几分钟）

---

**提示**：如果遇到权限问题，请在系统终端（Terminal.app）中运行 `sudo` 命令，而不是在 Cursor 的集成终端中。
