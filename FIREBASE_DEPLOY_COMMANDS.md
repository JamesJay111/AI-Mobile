# Firebase 部署指令

## 一、先登录（必须）

```bash
firebase login
```

或使用无本地主机模式（授权页卡住时用）：

```bash
firebase login --no-localhost
```

按提示：打开 URL → 登录 Google → 复制授权码 → 粘贴到终端回车。

验证登录成功：

```bash
firebase projects:list
```

应能看到 `gemgpt-ai-assistance`。

---

## 二、部署 Functions

### 方式 A：直接命令

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
firebase deploy --only functions
```

### 方式 B：分步执行

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two/functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

---

## 三、可选：部署 Hosting（前端）

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
npm run build
firebase deploy --only hosting
```

---

## 四、部署全部（Functions + Hosting + Firestore 规则）

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
firebase deploy
```

---

## 五、常用检查命令

```bash
firebase projects:list          # 列出项目
firebase use gemgpt-ai-assistance   # 切换当前项目
firebase functions:list         # 列出已部署的 Functions
firebase deploy --only functions --debug   # 调试部署
```

---

## 六、一键脚本

项目根目录已添加 `deploy-functions.sh`，登录成功后执行：

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
./deploy-functions.sh
```
