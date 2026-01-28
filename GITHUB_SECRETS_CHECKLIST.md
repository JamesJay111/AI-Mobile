# FIREBASE_SA_B64 一直报 missing 的排查清单

## 如何区分「没有 secret」和「内容错误」

| 现象 | 含义 |
|------|------|
| **Verify FIREBASE_SA_B64 secret** 这步失败，报 `FIREBASE_SA_B64 is missing` | workflow **拿不到** secret（当没配置、或跑的 workflow 没传 `env` 等） |
| **Verify** 通过（日志里有 `FIREBASE_SA_B64 found (from Secret)`），**Create service account key** 失败，报 `not valid JSON` | secret **有**，但 **内容不对**（Base64 错、截断、换行等） |

你截图里 Repository secrets 已有 `FIREBASE_SA_B64`，若仍报 **missing**，多半是 **跑的 workflow 不是最新**（没把传 `env` 的版本推上 main）。先推 workflow 再跑。

## 1. 确认是 **Secret**，且是 **Repository** 的

- 打开：**https://github.com/JamesJay111/AI-Mobile/settings/secrets/actions**
- 页面上有 **Secrets** 和 **Variables** 两个 tab。**必须加在 Secrets**，不能加在 Variables（workflow 优先读 Secret，Variable 仅作备用）。
- 在 **Repository secrets** 区域看是否有 **FIREBASE_SA_B64**。**不能**加在 **Environments**（如 production）里，否则当前 workflow 拿不到。
- 若没有：点 **New repository secret** → Name 填 **`FIREBASE_SA_B64`**（一字不差，无空格）→ Secret 粘贴 Base64 → 保存。

**生成 Base64（本机终端）：**
```bash
base64 -i /Users/niyutong/Desktop/gemgpt-ai-assistance-a5a84f75d924.json | tr -d '\n' | pbcopy
```
然后到 GitHub 新建 Secret，值里 Ctrl+V 粘贴。

---

## 2. 确认用的是 Repository secret，不是 Environment

- 必须加在 **Repository secrets**。
- 若加在 **Environments** 里（例如 `production`），当前 workflow 用不到，也会报 missing。

---

## 3. 确认 workflow 已推送到 main

报错说明用的是 **GitHub 上 main 的 workflow**。若你只改了本地的 `.github/workflows/deploy-functions.yml` 没推送，Actions 跑的仍是旧版（没有 `env` / 检查步骤）。

**推送更新：**
```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
git add .github/workflows/deploy-functions.yml GITHUB_SECRETS_CHECKLIST.md
git commit -m "fix: verify FIREBASE_SA_B64 step and checklist"
git push origin main
```
（需要 token 时：`GITHUB_TOKEN=ghp_xxx ./git-push-with-proxy.sh origin main`）

---

## 4. 再跑一次 workflow

1. 打开 **https://github.com/JamesJay111/AI-Mobile/actions**
2. 选 **Deploy Firebase Functions** → **Run workflow** → **Run workflow**

---

## 小结

| 步骤 | 检查项 |
|------|--------|
| ① | Repository secrets 里有 **FIREBASE_SA_B64**，Name 完全一致 |
| ② | Value 是整段 Base64（无换行），用 `base64 -i key.json \| tr -d '\n' \| pbcopy` 生成 |
| ③ | 已把更新后的 workflow 推送到 **main** |
| ④ | 在 Actions 里重新 **Run workflow** |

全做完后再跑，若仍报 missing，把 Actions 里 **Verify FIREBASE_SA_B64 secret** 这一步的完整日志截出来。
