# 通过代理推送代码到 GitHub（解决 Recv failure / timeout）

在大陆网络下 `git push` 常出现：

```
fatal: unable to access 'https://github.com/...': Recv failure: Operation timed out
```

可用 **代理** 让 Git 访问 GitHub 时走代理。

---

## 一键推送（推荐）

确保项目根目录有 **proxy.env**（你已配置），然后执行：

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
chmod +x git-push-with-proxy.sh
./git-push-with-proxy.sh origin main
```

脚本会加载 `proxy.env`、为 GitHub 设置代理、增大 `http.postBuffer`，再执行 `git push`。

### 使用 PAT（含 workflow 权限）推送

若推送包含 `.github/workflows/*.yml` 被拒（需 `workflow` scope），可传入 PAT：

```bash
GITHUB_TOKEN=ghp_你的Token ./git-push-with-proxy.sh origin main
```

脚本会临时用该 token 设置 `origin`、推送成功后自动恢复为不含 token 的 URL。

---

## 手动配置（一次设置，以后直接 git push）

若希望以后每次 `git push` 都走代理，可手动设一次 Git 代理（将下面的代理地址改成你 proxy.env 里的）：

```bash
git config --global http.https://github.com.proxy http://用户名:密码@IP:端口
git config --global https.https://github.com.proxy http://用户名:密码@IP:端口
git config --global http.postBuffer 524288000
```

之后直接 `git push origin main` 即可。

**取消代理：**

```bash
git config --global --unset http.https://github.com.proxy
git config --global --unset https.https://github.com.proxy
```

---

## 其他方式

- **VPN**：开全局 VPN 后再 `git push`，一般即可。
- **SSH 拉取/推送**：改用 `git@github.com:JamesJay111/AI-Mobile.git`，有时比 HTTPS 稳，但仍需能连 GitHub。
