# Expo 启动报错修复（Assets + xcrun + 版本提示）

## 1. 「Unable to resolve asset ./assets/icon.png」—— 已修复

**原因**：`app.json` 引用了 `./assets/icon.png`、`splash.png`、`adaptive-icon.png`、`favicon.png`，但项目里没有 `assets` 目录。

**已做**：已创建 `assets/`，并放入占位图（最小合法 1x1 透明 PNG）：
- `assets/icon.png`
- `assets/splash.png`
- `assets/adaptive-icon.png`
- `assets/favicon.png`

之后可自行替换为正式图标/启动图。

---

## 2. 「xcrun simctl help exited with non-zero code: 72」

**含义**：本机 iOS 模拟器 / Xcode 命令行工具异常，Expo 无法调起模拟器。

**可选处理**：
1. **用 Web 跑**：Expo 启动后按 **`w`**，在浏览器里调试。
2. **用真机 + Expo Go**：手机装 Expo Go，扫终端里的二维码。
3. **修本机模拟器**（可选）：
   - 打开 Xcode → 随便打开一工程 → **Xcode → Settings → Locations**，确认 Command Line Tools 已选。
   - 终端执行：`xcode-select -p`，应输出工具链路径。
   - 若仍有问题：`sudo xcode-select --reset`，再 `xcodebuild -runFirstLaunch`。

---

## 3. 「The following packages should be updated...」

**含义**：当前依赖版本与 Expo 推荐版本不完全一致，多为提示性警告。

**建议**：先**不要**跑 `npx expo install --fix`，它会升级到 React 19 / RN 0.81，易引发冲突。现有组合（Expo 54 + React 18 + RN 0.76）可正常使用。

若之后要对齐版本，再考虑升级 Expo SDK 并按官方迁移指南操作。

---

## 4. 推荐启动方式

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
npx expo start -c
```

- 按 **`w`**：在浏览器打开（推荐，避免模拟器问题）。
- 按 **`i`**：开 iOS 模拟器（需本机模拟器正常）。
- 手机装 **Expo Go** 后扫二维码：真机调试。

`-c` 会清 Metro 缓存，避免旧 bundle 导致异常。
