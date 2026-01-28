# 📍 npm run dev 启动位置说明

## 🎯 启动位置

`npm run dev` 命令在**项目根目录**执行。

### 项目根目录路径
```
/Users/niyutong/Desktop/AI聚合器开发方式Two/
```

### 目录结构
```
AI聚合器开发方式Two/
├── package.json          ← npm run dev 定义在这里
├── vite.config.ts       ← Vite 配置（端口、HMR等）
├── index.html           ← 入口 HTML
├── src/                 ← React 源代码
│   ├── App.tsx
│   ├── components/
│   └── ...
└── node_modules/        ← 依赖包（npm install 后生成）
```

## 🚀 如何启动

### 方法1: 在 Cursor 终端中启动

1. **打开终端**:
   - 在 Cursor 中按 `` Ctrl+` `` (反引号) 或
   - 菜单: Terminal → New Terminal

2. **确认当前目录**:
   ```bash
   pwd
   # 应该显示: /Users/niyutong/Desktop/AI聚合器开发方式Two
   ```

3. **如果不在项目目录，切换到项目目录**:
   ```bash
   cd "/Users/niyutong/Desktop/AI聚合器开发方式Two"
   ```

4. **启动开发服务器**:
   ```bash
   npm run dev
   ```

### 方法2: 在系统终端中启动

1. **打开终端** (Terminal.app on Mac)

2. **切换到项目目录**:
   ```bash
   cd "/Users/niyutong/Desktop/AI聚合器开发方式Two"
   ```

3. **启动开发服务器**:
   ```bash
   npm run dev
   ```

## 📋 命令执行流程

```
你在终端输入: npm run dev
         ↓
package.json 中的 scripts.dev: "vite"
         ↓
Vite 读取 vite.config.ts 配置
         ↓
启动开发服务器在 localhost:3000
         ↓
自动打开浏览器: http://localhost:3000
         ↓
开始监听 src/ 目录的文件变化
         ↓
文件保存 → 自动重新编译 → 浏览器自动更新
```

## 🔍 命令定义位置

### package.json
```json
{
  "scripts": {
    "dev": "vite"  ← 这里定义了 npm run dev
  }
}
```

### vite.config.ts
```typescript
export default defineConfig({
  server: {
    port: 3000,        ← 服务器运行在这个端口
    open: true,        ← 自动打开浏览器
    host: true,        ← 允许外部访问
  },
});
```

## 📱 服务器运行位置

### 本地开发服务器
- **地址**: `http://localhost:3000`
- **类型**: 本地开发服务器（只在你的电脑上运行）
- **访问**: 
  - 本机浏览器: `http://localhost:3000`
  - 同一网络下的手机: `http://你的IP:3000` (需要 `npm run dev:host`)

### 服务器进程
- **运行位置**: 你的电脑（本地）
- **进程**: Node.js 进程运行 Vite 开发服务器
- **停止**: 在终端按 `Ctrl+C`

## 🎨 实时预览工作原理

```
┌─────────────────────────────────────────┐
│  你的电脑 (本地)                          │
│                                          │
│  ┌──────────────┐    ┌──────────────┐  │
│  │  Cursor 编辑器 │    │  浏览器        │  │
│  │  (写代码)      │    │  (预览)        │  │
│  └──────┬───────┘    └──────┬───────┘  │
│         │                   │          │
│         │ 保存文件           │          │
│         ↓                   │          │
│  ┌──────────────┐           │          │
│  │  Vite 服务器  │ ←─────────┘          │
│  │ localhost:3000│                      │
│  │ 监听文件变化   │                      │
│  │ 自动重新编译   │                      │
│  │ HMR 热更新    │                      │
│  └──────────────┘                      │
└─────────────────────────────────────────┘
```

## ✅ 启动成功标志

当你运行 `npm run dev` 后，终端会显示：

```
  VITE v6.3.5  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.100:3000/
  ➜  press h to show help
```

看到这些信息表示：
- ✅ 服务器已启动
- ✅ 本地访问: `http://localhost:3000`
- ✅ 网络访问: `http://192.168.1.100:3000` (用于手机预览)
- ✅ 浏览器应该自动打开

## 🛑 停止服务器

在运行 `npm run dev` 的终端中：
- 按 `Ctrl+C` 停止服务器
- 或者关闭终端窗口

## 💡 常见问题

### Q: 命令在哪里执行？
**A**: 在项目根目录 `/Users/niyutong/Desktop/AI聚合器开发方式Two/`

### Q: 服务器运行在哪里？
**A**: 在你的电脑本地，地址是 `http://localhost:3000`

### Q: 浏览器预览在哪里？
**A**: 浏览器会自动打开，或者手动访问 `http://localhost:3000`

### Q: 如何知道服务器已启动？
**A**: 终端显示 "ready in XXX ms" 和 "Local: http://localhost:3000/"

### Q: 可以关闭终端吗？
**A**: 不可以，关闭终端会停止服务器。保持终端打开，服务器才能运行。

---

**总结**: `npm run dev` 在项目根目录执行，启动本地开发服务器，浏览器访问 `http://localhost:3000` 进行实时预览。
