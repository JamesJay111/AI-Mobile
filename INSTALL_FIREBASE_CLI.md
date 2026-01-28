# 🔧 安装 Firebase CLI

## ❌ 当前状态

Firebase CLI **未安装**，需要手动安装。

---

## ✅ 安装方法

### 方法1：全局安装（推荐）

在终端中运行：

```bash
npm install -g firebase-tools
```

**如果遇到权限错误**，使用：

```bash
sudo npm install -g firebase-tools
```

然后输入你的Mac密码。

### 方法2：使用npx（不需要全局安装）

如果不想全局安装，可以使用 `npx`：

```bash
npx firebase-tools --version
```

但每次使用都需要加 `npx` 前缀。

---

## ✅ 验证安装

安装完成后，运行：

```bash
firebase --version
```

应该显示版本号，例如：`13.0.0` 或类似。

---

## 🚀 安装后下一步

1. **登录Firebase**：
   ```bash
   firebase login
   ```

2. **验证项目**：
   ```bash
   firebase projects:list
   ```

3. **部署Functions**：
   ```bash
   cd /Users/niyutong/Desktop/AI聚合器开发方式Two
   firebase deploy --only functions
   ```

---

## 📝 快速命令

复制并运行：

```bash
# 安装Firebase CLI
npm install -g firebase-tools

# 验证安装
firebase --version

# 登录
firebase login
```

---

**请在终端中运行上面的命令来安装Firebase CLI！** 🚀
