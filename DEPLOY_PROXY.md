# 使用代理部署 Firebase Functions（大陆环境）

## 已配置

- **`proxy.env`**：已按你提供的代理写入，并被 `.gitignore` 忽略，不会提交。
- **`deploy-with-service-account.sh`**：若存在 `proxy.env`，会自动 `source` 并设置 `HTTP_PROXY` / `HTTPS_PROXY`，再执行 `npm install` 与 `firebase deploy`。

代理信息：

- 地址：`23.95.150.145:6114`
- 用户：`xqxlwiqi`
- 位置：Buffalo, United States

## 使用方式

直接运行部署脚本即可，脚本会自动走代理：

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
./deploy-with-service-account.sh
```

如需指定服务账号密钥路径：

```bash
./deploy-with-service-account.sh /path/to/your-key.json
```

## 修改代理

编辑项目根目录的 **`proxy.env`**：

```bash
export HTTP_PROXY="http://用户名:密码@IP:端口"
export HTTPS_PROXY="http://用户名:密码@IP:端口"
```

保存后重新执行 `./deploy-with-service-account.sh` 即可。

## 临时不走代理

- 重命名或移除 `proxy.env`，例如：  
  `mv proxy.env proxy.env.bak`  
  再运行部署脚本，则不会使用代理。

## 安全提醒

- **不要**将 `proxy.env` 提交到 git（已加入 `.gitignore`）。
- 若需在别处复用配置，可复制 `proxy.env.example` 为 `proxy.env` 并填入实际值，勿把含密码的文件放进版本库。
