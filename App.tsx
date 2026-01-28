import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import AppNative from './src/native/AppNative';

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

const fallback = (
  <View style={styles.fallback}>
    <Text style={styles.title}>GemGPT</Text>
    <Text style={styles.text}>
      请使用浏览器体验完整功能：{'\n'}npm run dev{'\n'}然后打开 http://localhost:3000
    </Text>
  </View>
);

export default function App() {
  const [WebApp, setWebApp] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    (async () => {
      try {
        require('./src/index.css');
      } catch (_) {}
      const m = await import('./src/App');
      setWebApp(() => m.default);
    })();
  }, []);

  if (Platform.OS !== 'web') return <AppNative />;
  if (!WebApp) {
    return (
      <View style={[styles.fallback, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={[styles.text, { marginTop: 16 }]}>加载中…</Text>
      </View>
    );
  }
  return <WebApp />;
}
