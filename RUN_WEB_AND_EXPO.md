# 浏览器 vs Expo 如何跑、如何看

## 推荐：浏览器用 Vite（完整 UI，无白屏）

```bash
cd /Users/niyutong/Desktop/AI聚合器开发方式Two
npm run dev
```

然后打开 **http://localhost:3000**（或终端里打印的地址）。  
这里是 **Vite + Tailwind**，Chat / 图片生成 / PDF 等完整功能可测。

---

## Expo：真机 / 模拟器

```bash
npx expo start -c
```

- **按 `w`**：Expo Web。会尝试加载 `src/App` + CSS；若仍白屏，直接用 **npm run dev** 在浏览器看。
- **按 `q` 扫码**：Expo Go 真机。当前为**占位页**（「请使用浏览器 npm run dev…」），主界面尚未做 RN 适配，完整功能请用浏览器。

---

## 白屏 / 手机报错 已做处理

1. **Expo 真机**：不再渲染含 `div` 的主界面，只显示占位页，避免崩溃。
2. **Expo Web**：仅在 web 时动态加载 `src/App` 与 CSS；若仍白屏，请改用 **npm run dev**。
3. **expo-router** 已移除，避免无 `app/` 目录导致的异常。

---

## 总结

| 环境       | 命令           | 说明                         |
|------------|----------------|------------------------------|
| 浏览器     | `npm run dev`  | 完整功能，推荐日常开发、联调 |
| Expo Web   | `expo start` → 按 `w` | 备用；白屏则用 Vite |
| Expo 真机  | `expo start` → 扫码 | 占位页，完整功能用浏览器 |
