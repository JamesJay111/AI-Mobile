# 🔧 修复 Expo 启动卡住问题

## ❌ 问题原因

你在**错误的目录**运行了 `npx expo start`！

从终端输出可以看到：
```
Starting project at /Users/niyutong
```

这说明你在用户主目录 (`~`) 运行了命令，而不是在项目目录中。

---

## ✅ 解决方案

### 步骤1：停止当前进程
按 `Ctrl + C` 停止卡住的进程

### 步骤2：切换到项目目录
```bash
cd ~/Desktop/AI聚合器开发方式Two
```

或者完整路径：
```bash
cd "/Users/niyutong/Desktop/AI聚合器开发方式Two"
```

### 步骤3：确认在正确目录
```bash
pwd
# 应该显示: /Users/niyutong/Desktop/AI聚合器开发方式Two
```

### 步骤4：检查必要文件是否存在
```bash
ls -la | grep -E "(app.json|package.json|App.tsx)"
```

应该看到：
- `app.json` ✅
- `package.json` ✅
- `App.tsx` ✅

### 步骤5：启动 Expo
```bash
npx expo start
```

启动后，按 `q` 键显示二维码。

---

## 🚀 一键修复命令

复制并运行以下命令（会先切换到项目目录，然后启动）：

```bash
cd ~/Desktop/AI聚合器开发方式Two && npx expo start
```

---

## 📋 完整操作流程

```bash
# 1. 停止当前进程（如果还在运行）
# 按 Ctrl + C

# 2. 切换到项目目录
cd ~/Desktop/AI聚合器开发方式Two

# 3. 确认目录正确
pwd

# 4. 启动 Expo
npx expo start

# 5. 启动后按 'q' 显示二维码
```

---

## ⚠️ 如果还是卡住

### 检查1：确认依赖已安装
```bash
cd ~/Desktop/AI聚合器开发方式Two
ls node_modules  # 应该看到很多文件夹
```

如果没有 `node_modules`，运行：
```bash
npm install
```

### 检查2：清除缓存
```bash
cd ~/Desktop/AI聚合器开发方式Two
npx expo start --clear
```

### 检查3：检查端口占用
```bash
lsof -ti:19000,19001 | xargs kill -9
```

然后重新启动：
```bash
npx expo start
```

---

## 🎯 正确的启动方式

**永远在项目根目录运行 Expo 命令！**

```bash
# ✅ 正确
cd ~/Desktop/AI聚合器开发方式Two
npx expo start

# ❌ 错误
cd ~
npx expo start  # 这会在错误的目录查找项目
```

---

**现在按 Ctrl+C 停止，然后运行：**
```bash
cd ~/Desktop/AI聚合器开发方式Two && npx expo start
```
