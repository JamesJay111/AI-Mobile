# 推送说明（已 commit，你本地执行推送 + 手动改 workflow）

## 一、只推送「除 workflow 以外」的改动（推荐）

**适用**：PAT 没有 `workflow` 权限、workflow 你准备在 GitHub 手动加/改时。

在项目根目录执行：

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
./push-without-workflow.sh
```

按需加 token（走代理时）：

```bash
GITHUB_TOKEN=ghp_你的Token ./push-without-workflow.sh
```

脚本会：拉取 `origin/main` → 生成排除 `.github/workflows/deploy-functions.yml` 的 diff → 重置到远程 → 应用改动 → 提交并推送。**不会**推送任何 workflow 修改。

---

## 二、直接推送（需 PAT 有 workflow 权限）

若 PAT 已勾选 `workflow`，可直接：

```bash
GITHUB_TOKEN=ghp_你的Token ./git-push-with-proxy.sh origin main
```

或未配置 token 时：`./git-push-with-proxy.sh origin main`

---

## 三、GitHub 网页手动改 workflow

1. 打开 **https://github.com/JamesJay111/AI-Mobile** → **Code** → `.github/workflows/deploy-functions.yml` → **Edit**。
2. 找到 **Deploy to Firebase** 的 `run`：
   ```yaml
   run: npx firebase-tools deploy --only functions --project gemgpt-ai-assistance --non-interactive
   ```
3. 改为（末尾加 `--force`）：
   ```yaml
   run: npx firebase-tools deploy --only functions --project gemgpt-ai-assistance --non-interactive --force
   ```
4. **Commit changes** 保存。

---

## 四、跑部署

**Actions** → **Deploy Firebase Functions** → **Run workflow**。

---

## 小结

| 项目 | 操作 |
|------|------|
| 非 workflow 改动（functions、文档等） | 用 `./push-without-workflow.sh` 推送 |
| workflow | 在 GitHub 编辑，给 deploy 命令加 `--force` |
