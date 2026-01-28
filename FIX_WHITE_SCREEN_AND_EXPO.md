# 其他页白屏、iOS 模拟器、Expo 依赖提示

## 1. 仅第一页正常、切到其他页白屏 —— 已做修复

**已做修改：**
- **ErrorBoundary**：在 `src/components/ErrorBoundary.tsx` 包住主内容，子页报错时显示「页面加载出错」+ 重试，避免整页白屏。
- **主布局**：外层 `flex flex-col h-screen`，主内容区 `flex-1 min-h-0 overflow-hidden`，有底部 Tab 时加 `pb-16`，避免高度塌陷或内容被挡住导致「看起来白屏」。

若某页仍白屏，打开浏览器 **开发者工具 → Console** 看是否有报错；若有，按提示修对应页面或依赖。

---

## 2. 「No iOS devices available in Simulator.app」

**含义**：本机没可用的 iOS 模拟器，`expo start` 选 iOS 时会报错。

**处理：**
1. 打开 **Xcode** → **Window** → **Devices and Simulators** → **Simulators**。
2. 左下角 **+** 新增模拟器，选系统版本（如 iOS 18）与设备（如 iPhone 15）。
3. 或 **Xcode** → **Settings** → **Platforms**，安装需要的 **iOS Simulator** 版本。

装好后再 `npx expo start` → 按 **i** 开 iOS 模拟器。

**临时替代**：用 **Expo Web**（按 **w**）或 **真机 + Expo Go** 扫码测试。

---

## 3. 「The following packages should be updated...」

**含义**：当前依赖版本与 Expo 推荐不完全一致，多为提示。

**建议：**
- 若跑 **Vite**（`npm run dev`）做前端开发，可不处理，不影响浏览器端。
- 若要用 **Expo / 模拟器** 且想消提示，可在项目根目录执行：
  ```bash
  npx expo install --fix
  ```
  若出现依赖冲突，可试：
  ```bash
  npm install <包名>@<期望版本> --legacy-peer-deps
  ```
  再按提示逐个对齐。

---

## 4. 建议的本地测试方式

| 目的         | 方式 |
|--------------|------|
| 浏览器完整 UI | `npm run dev` → 打开 http://localhost:3000 |
| Expo 真机    | `npx expo start` → 手机 Expo Go 扫码 |
| Expo Web     | `npx expo start` → 按 **w** |
| iOS 模拟器   | 先装好 Simulator，再 `expo start` → 按 **i** |
