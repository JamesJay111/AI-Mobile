# 「Unable to fetch the CLI MOTD and remote config」说明

## 这是什么？

Firebase CLI 启动时会尝试从云端拉取：

- **MOTD**（Message of the Day）：提示信息  
- **Remote config**：远程配置  

当无法访问这些地址时（网络限制、防火墙、在国内等），就会打印：

```text
⚠  Unable to fetch the CLI MOTD and remote config. This is not a fatal error, but may indicate an issue with your network connection.
```

## 重要：这是警告，不是错误

- 文案里已说明：**This is not a fatal error**（不是致命错误）  
- **部署逻辑不依赖 MOTD/remote config**，拉取失败也不会阻止 `firebase deploy`  
- 只要后面没有出现 `Error: ...` 且最终有 `✔ Deploy complete!`，就说明部署成功了，可以忽略这条警告

## 如何确认部署是否成功？

看命令输出的最后几行：

- **成功**：有 `✔ Deploy complete!` 以及各 Function 的 URL  
- **失败**：会出现 `Error:` 或 `Failed to deploy` 等报错

若看到的是 **只有 MOTD 警告 + 后面正常完成**，即表示部署成功，无需处理该警告。

## 想减少或隐藏这条警告时

### 1. 脚本已设置 `CI=1`

部署脚本里已加 `export CI=1`，部分场景下 CLI 会少做一些联网检查，对缓解该警告可能有帮助。

### 2. 改善网络（治本）

若你在中国大陆或公司网络限制访问 Google：

- 使用 **VPN** 或 **代理**，让本机可访问 `firebase-public.firebaseio.com`、`www.googleapis.com` 等  
- 注意：**实际部署**（上传 Functions）也要访问 Google 接口，若部署失败，多半是整体网络不通，不是单纯 MOTD 的问题

### 3. 忽略即可

不拉 MOTD 不影响部署，不处理也没问题。

## 小结

| 情况 | 建议 |
|------|------|
| 只有 MOTD 警告，后面有 `✔ Deploy complete!` | 正常，忽略警告即可 |
| 有 MOTD 警告，且部署报 `Error` / 失败 | 检查网络（VPN/代理），确保能访问 Google |
| 不想看到这条警告 | 可试 `CI=1`（脚本已加），或改善网络 |
