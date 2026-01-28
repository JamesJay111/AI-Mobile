# Default service account / IAM 部署报错处理

## 报错说明

- `Default service account '...-compute@developer.gserviceaccount.com' doesn't exist`
- `Failed to set the IAM Policy` / `Unable to set the invoker`
- `could not set up cleanup policy`

## 已做修改

1. **指定运行时 SA**：所有 functions 的 `runWith` 使用  
   `serviceAccount: 'gemgpt-ai-assistance@appspot.gserviceaccount.com'`  
   （App Engine 默认 SA），不再用不存在的 Compute 默认 SA。

2. **部署加 `--force`**：workflow 里 `firebase deploy` 增加 `--force`，用于自动处理 cleanup policy 等提示。

## 其他部署报错

- **`chatCompletion` failed to update / 其他单个 function 更新失败**：多为 GCP 端瞬时异常。workflow 已加**自动重试**（首次失败后等 60s 再部署一次）。若仍失败，到 **Actions** 再 **Run workflow** 重跑一次往往即可。
- **No cleanup policy / 要求 `--force`**：workflow 已加 `--force`，无需再改。

## 若仍报错

- **`appspot` SA 不存在**：在 GCP 控制台启用 **App Engine**（通常会自动创建该 SA），或改用你有权限的 SA，例如  
  `firebase-deploy@gemgpt-ai-assistance.iam.gserviceaccount.com`，并在此 SA 上授予 **Cloud Functions Invoker** 等所需角色。
- **IAM / 无 functions.admin**：为部署用的 SA（如 `firebase-deploy@...`）在项目上添加 **Cloud Functions Admin** 等权限。

改完后推送代码、重新跑 workflow 再部署。
