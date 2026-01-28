# Firebase 升级到 Blaze 计划才能部署 Functions

## 报错说明

```
Your project gemgpt-ai-assistance must be on the Blaze (pay-as-you-go) plan to complete this command.
Required API artifactregistry.googleapis.com can't be enabled until the upgrade is complete.
```

- **原因**：Cloud Functions、Cloud Build、Artifact Registry 等 API 只能在 **Blaze（按量付费）** 计划下使用；当前项目是 **Spark（免费）** 计划，无法部署 Functions。
- **解决办法**：把项目升级到 Blaze，并关联一张可用账单（信用卡等）。

---

## 操作步骤

### 1. 打开升级页面

在浏览器中打开（需能访问 Google / Firebase）：

**https://console.firebase.google.com/project/gemgpt-ai-assistance/usage/details**

或：

1. 打开 [Firebase Console](https://console.firebase.google.com/)
2. 选择项目 **gemgpt-ai-assistance**
3. 左下角 ⚙️ **项目设置** → **使用情况和结算** → **详细信息与设置**

### 2. 升级到 Blaze

- 点击 **升级项目** 或 **修改计划**
- 选择 **Blaze（按量付费）**
- 按提示关联 **Google Cloud 结算账号**（没有的话先创建，并绑定信用卡）

### 3. 设置预算提醒（建议）

升级后可在 **结算** 里设置预算与告警，例如：

- 每月预算上限：例如 5–10 美元
- 达到 50%、80%、100% 时发送邮件提醒  

这样能控制用量，避免意外超支。

### 4. 重新部署

升级完成并生效后（通常 1–2 分钟），在项目根目录执行：

```bash
./deploy-with-service-account.sh
```

---

## Blaze 免费额度（大致参考）

| 项目 | 每月免费额度 |
|------|----------------|
| Cloud Functions 调用 | 200 万次 |
| 出站流量 | 5 GB |
| Cloud Build 构建时长 | 一定时长免费 |

超出部分才计费。开发、测试阶段通常不会超太多，但具体以 [Firebase 定价](https://firebase.google.com/pricing) 为准。

---

## 总结

| 步骤 | 操作 |
|------|------|
| 1 | 打开 https://console.firebase.google.com/project/gemgpt-ai-assistance/usage/details |
| 2 | 升级到 **Blaze**，关联结算账号（信用卡） |
| 3 | （可选）设置预算与告警 |
| 4 | 再执行 `./deploy-with-service-account.sh` 部署 |

完成升级后，之前的 `artifactregistry` / Blaze 相关报错就会消失，可以正常部署 Functions。
