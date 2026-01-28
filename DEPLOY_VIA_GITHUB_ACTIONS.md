# 用 GitHub Actions 一键部署 Functions（推荐，绕过本机网络）

在 **GitHub 服务器** 上部署，不经过你本机网络，可彻底避免 `storage.googleapis.com` 上传失败。

**一键操作**：配置好仓库与 Secrets 后，**推送代码** 或 **在 Actions 页点 Run workflow** 即部署。

---

## 一、前置条件

1. 项目已推送到 **GitHub** 仓库（可私有）。
2. 你有 **服务账号密钥 JSON** 和 **OpenRouter API Key**。

---

## 二、配置 GitHub Secrets

1. 打开仓库 → **Settings** → **Secrets and variables** → **Actions**。
2. 点 **New repository secret**，添加两个 Secret：

### 1. `FIREBASE_SA_B64`

服务账号密钥 JSON 的 **Base64 编码**。

在终端执行（将路径换成你的密钥实际路径）：

```bash
base64 -i /Users/niyutong/Desktop/gemgpt-ai-assistance-a5a84f75d924.json | pbcopy
```

然后到 GitHub 新建 Secret，名称填 **`FIREBASE_SA_B64`**，值里 **粘贴**（Ctrl+V）后保存。

### 2. `OPENROUTER_API_KEY`

名称：**`OPENROUTER_API_KEY`**  
值：你的 OpenRouter API Key（例如 `sk-or-v1-...`）。

---

## 三、触发部署

### 方式 A：推送代码

往 **main** 分支 push：

```bash
git add -A
git commit -m "deploy"
git push origin main
```

推送成功后，到 **Actions** 页查看 **Deploy Firebase Functions** 是否跑通。

### 方式 B：手动运行

1. 打开 **Actions** → 选择 **Deploy Firebase Functions**。
2. 点 **Run workflow** → 选分支 **main** → **Run workflow**。

---

## 四、查看结果

- **绿色勾**：部署成功。
- **红色叉**：看具体步骤日志。常见原因：
  - `FIREBASE_SA_B64` 或 `OPENROUTER_API_KEY` 未配置、填错。
  - 服务账号无 Firebase / Cloud 部署权限。

---

## 五、与本机部署对比

| 方式 | 命令 / 操作 | 适用场景 |
|------|-------------|----------|
| **本机** | `./deploy-with-service-account.sh` | 能稳定访问 `storage.googleapis.com` |
| **GitHub Actions** | `git push` 或 Actions 页 **Run workflow** | 本机上传失败（如大陆网络） |

配置好 Secrets 后，日常部署用 **GitHub Actions** 即可，无需本机代理或 Cloud Shell。
