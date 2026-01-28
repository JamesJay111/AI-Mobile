# 使用 Google Cloud Shell 部署 Functions（大陆推荐）

当本机上传到 `storage.googleapis.com` 失败（代理超时、域名被拦截等）时，可用 **Google Cloud Shell** 在 Google 网络内部署，无需代理。

---

## 一、本地打包

在项目根目录执行：

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
./pack-for-cloudshell.sh
```

会生成 **`deploy-cloudshell.zip`**。

---

## 二、准备并上传到 Cloud Shell

### 1. 打开 Cloud Shell

浏览器打开（需可访问 Google）：

**https://console.cloud.google.com/cloudshell?project=gemgpt-ai-assistance**

或：GCP 控制台右上角 **终端图标** → 选择项目 **gemgpt-ai-assistance**。

### 2. 上传文件

在 Cloud Shell 窗口点击 **⋮** → **上传文件**，上传：

- **`deploy-cloudshell.zip`**（项目打包）
- **服务账号密钥 JSON**（如 `gemgpt-ai-assistance-a5a84f75d924.json`）

### 3. 解压并进入目录

```bash
unzip -o deploy-cloudshell.zip -d gemgpt-deploy
cd gemgpt-deploy
```

---

## 三、配置与部署

### 1. 创建 OpenRouter 配置

```bash
cp functions/src/config.example.ts functions/src/config.ts
```

编辑 `functions/src/config.ts`，将 `YOUR_OPENROUTER_API_KEY_HERE` 换成你的 OpenRouter API Key：

```bash
nano functions/src/config.ts
# 或
cat > functions/src/config.ts << 'EOF'
export const OPENROUTER_API_KEY = 'sk-or-v1-你的实际Key';
EOF
```

### 2. 设置服务账号密钥

把上传的密钥放到当前目录（若已上传到云盘，通常在 `$HOME`）。例如：

```bash
# 若上传后文件名一致
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/gemgpt-ai-assistance-a5a84f75d924.json"
# 或放到项目目录
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/gemgpt-ai-assistance-a5a84f75d924.json"
```

### 3. 安装依赖并部署

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions --project gemgpt-ai-assistance --non-interactive
```

### 4. 确认结果

看到 **`✔ Deploy complete!`** 即部署成功。可再执行：

```bash
firebase functions:list --project gemgpt-ai-assistance
```

查看已部署的 Functions 及 URL。

---

## 四、之后只改代码时

1. 本地修改代码后，重新执行 `./pack-for-cloudshell.sh`。
2. 在 Cloud Shell 中只上传新的 `deploy-cloudshell.zip`，覆盖解压目录后，**重新创建 `config.ts`**（解压不包含该文件），再执行 **三、2–3** 的 `GOOGLE_APPLICATION_CREDENTIALS` 与 `firebase deploy`。

---

## 五、常见问题

| 问题 | 处理 |
|------|------|
| `firebase: command not found` | 运行 `npm install -g firebase-tools` 或 `curl -sL https://firebase.tools | bash` |
| `OPENROUTER_API_KEY` 报错 | 确认 `functions/src/config.ts` 已创建且 Key 正确 |
| 部署时报权限错误 | 确认 `GOOGLE_APPLICATION_CREDENTIALS` 指向的密钥有 Firebase / Cloud 部署权限 |

---

## 六、与本机部署的对比

| 方式 | 适用场景 |
|------|----------|
| 本机 `./deploy-with-service-account.sh` | 能稳定访问 `storage.googleapis.com`（代理或网络良好） |
| **Cloud Shell**（本文） | 大陆或上传 `storage.googleapis.com` 失败时 |

Cloud Shell 在 Google 网络内，上传到 `storage.googleapis.com` 不走公网，可规避本机网络限制。
