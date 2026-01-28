# 立即推送并触发部署

若 PAT **没有 workflow 权限**、推送一直报 `refusing to allow... without workflow scope`，请改用：

**👉 [PUSH_THEN_ADD_WORKFLOW.md](./PUSH_THEN_ADD_WORKFLOW.md)**  
先推送不含 workflow 的提交，再在 GitHub 网页添加 workflow。

---

若 PAT **已有 workflow 权限**，在本机终端执行：

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two && GITHUB_TOKEN=ghp_你的Token ./git-push-with-proxy.sh origin main
```

- 推送成功 → GitHub Actions 自动运行 **Deploy Firebase Functions**。
- 查看部署：https://github.com/JamesJay111/AI-Mobile/actions

**安全提醒**：部署完成后建议到 https://github.com/settings/tokens 撤销所用 token。
