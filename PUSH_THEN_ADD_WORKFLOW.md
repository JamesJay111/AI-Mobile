# 先推送（不含 workflow），再在网页添加 workflow

PAT 没有 `workflow` 权限时，GitHub 会拒绝推送包含 `.github/workflows/*.yml` 的提交。可以**先推送其余代码**，再**在 GitHub 网页上创建** workflow 文件。

---

## 一、执行脚本推送（不含 workflow）

在项目根目录执行（把 `ghp_xxx` 换成你的 PAT）：

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
chmod +x push-without-workflow.sh
GITHUB_TOKEN=ghp_你的Token ./push-without-workflow.sh
```

脚本会：
- 把当前分支合并成一个提交，且**不包含** `.github/workflows/deploy-functions.yml`
- 用 `GITHUB_TOKEN` + 代理执行 `git push origin main`

若提示 `! [rejected] ... non-fast-forward`，因已改写历史，可执行：
`git push --force-with-lease origin main` 再推一次。

推送成功后继续下一步。

---

## 二、在 GitHub 网页添加 workflow

1. 打开（创建新文件并指定路径）：  
   **https://github.com/JamesJay111/AI-Mobile/new/main?filename=.github/workflows/deploy-functions.yml**

2.  **Name** 已填好：`.github/workflows/deploy-functions.yml`，不要改。

3. 把下面整段 YAML **复制粘贴**进编辑框（替换占位内容）：

```yaml
# 云端部署 Firebase Functions（绕过本机网络 / 代理）
# 触发：推送到 main，或 Actions 页手动 Run workflow
# 需配置 Secrets：FIREBASE_SA_B64、OPENROUTER_API_KEY

name: Deploy Firebase Functions

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: functions/package-lock.json

      - name: Create service account key
        run: |
          if [ -z "$FIREBASE_SA_B64" ]; then
            echo "::error::Secret FIREBASE_SA_B64 is missing. Add it in Settings → Secrets and variables → Actions."
            exit 1
          fi
          echo "$FIREBASE_SA_B64" | base64 -d > "$GITHUB_WORKSPACE/sa.json"
        env:
          FIREBASE_SA_B64: ${{ secrets.FIREBASE_SA_B64 }}

      - name: Create OpenRouter config
        run: |
          node -e "
            const k = process.env.OPENROUTER_API_KEY || '';
            const s = 'export const OPENROUTER_API_KEY = ' + JSON.stringify(k) + ';\n';
            require('fs').writeFileSync('functions/src/config.ts', s);
          "
        env:
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}

      - name: Install and build functions
        run: |
          cd functions && npm ci && npm run build && cd ..

      - name: Deploy to Firebase
        run: npx firebase-tools deploy --only functions --project gemgpt-ai-assistance --non-interactive
        env:
          GOOGLE_APPLICATION_CREDENTIALS: ${{ github.workspace }}/sa.json
          CI: 1
```

4. 点 **Commit new file** / **Commit to main**。

5. 打开 **Actions**：  
   **https://github.com/JamesJay111/AI-Mobile/actions**  
   - 若已配好 **FIREBASE_SA_B64**、**OPENROUTER_API_KEY**，这次提交会触发部署；  
   - 也可选 **Deploy Firebase Functions** → **Run workflow** 手动跑一次。

---

## 三、之后拉取到本地

网页上添加 workflow 后，本地还没有这个文件，可执行：

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
git pull origin main
```

这样本地也会得到 `.github/workflows/deploy-functions.yml`，以后修改 workflow 再推送时，需要 PAT 具备 **workflow** 权限。
