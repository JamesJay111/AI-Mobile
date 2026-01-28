# 🚀 快速启动：边写边看开发环境

## 一键启动（最简单）

```bash
cd "/Users/niyutong/Desktop/AI聚合器开发方式Two"
npm run dev:ios
```

或者：

```bash
./start-ios-dev.sh
```

---

## 📐 窗口布局方法

### 方法 1：使用 macOS 分屏（最简单，推荐）

1. **启动 Expo + iOS 模拟器**：
   ```bash
   npm run expo:ios
   ```

2. **等待模拟器启动**（约 30-60 秒）

3. **布局窗口**：
   - 将鼠标移到 Cursor 窗口左上角的绿色按钮
   - 选择"将窗口拼贴到屏幕左侧"
   - 点击 iOS 模拟器窗口，它会自动填充右侧

### 方法 2：使用 Rectangle（最灵活，强烈推荐）

**安装 Rectangle**：
```bash
brew install --cask rectangle
```

**使用**：
1. 启动 Expo + iOS 模拟器
2. 在 Cursor 窗口按：`⌘ + ⌃ + ←`（左边 2/3）
3. 在模拟器窗口按：`⌘ + ⌃ + →`（右边 1/3）

### 方法 3：使用脚本自动布局

```bash
npm run layout
```

---

## 🎯 完整工作流程

### 第一次使用

1. **安装 Rectangle**（推荐）：
   ```bash
   brew install --cask rectangle
   ```

2. **启动开发环境**：
   ```bash
   npm run dev:ios
   ```

3. **等待启动**（首次启动模拟器需要 30-60 秒）

4. **布局窗口**：
   - 如果安装了 Rectangle：
     - Cursor: `⌘ + ⌃ + ←`
     - 模拟器: `⌘ + ⌃ + →`
   - 如果没有 Rectangle：
     - 使用 macOS 分屏功能（见方法 1）

### 日常使用

```bash
# 1. 启动（会自动打开模拟器）
npm run dev:ios

# 2. 等待启动完成

# 3. 布局窗口（如果安装了 Rectangle）
#    Cursor: ⌘ + ⌃ + ←
#    模拟器: ⌘ + ⌃ + →

# 4. 开始编码！
```

---

## 💡 提示

- ✅ 修改代码后会自动热重载
- ✅ 在 Expo 终端按 `r` 手动重新加载
- ✅ 按 `Ctrl + C` 停止开发服务器
- ✅ 可以保持模拟器运行，只重启 Expo

---

## 🐛 如果遇到问题

### 模拟器启动很慢？
- 首次启动需要 30-60 秒，这是正常的
- 之后会快很多（5-10 秒）

### 窗口布局不工作？
- 使用 macOS 分屏功能（方法 1）
- 或安装 Rectangle（方法 2）

### Expo 没有自动打开模拟器？
```bash
# 手动打开
open -a Simulator

# 然后在 Expo 终端按 'i' 键
```

---

**现在开始享受边写边看的开发体验吧！** 🎉
