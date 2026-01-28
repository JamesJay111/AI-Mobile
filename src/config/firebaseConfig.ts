/**
 * Firebase 配置（与 app.json extra 一致）
 * 使用静态配置，避免在 iOS/Expo Go 中通过 expo-constants 触发 PlatformConstants 相关报错。
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyAvJs6c69vChvQ6WwQNHPZe_IetKazdcoM',
  authDomain: 'gemgpt-ai-assistance.firebaseapp.com',
  projectId: 'gemgpt-ai-assistance',
  storageBucket: 'gemgpt-ai-assistance.firebasestorage.app',
  messagingSenderId: '397459517247',
  appId: '1:397459517247:web:905af5eed14a80640cad8a',
};
