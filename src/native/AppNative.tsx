import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from '../config/firebase';
import { chatCompletion, getOpenRouterModelId } from '../services/openRouter';
import { waitForAuth } from '../utils/user';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function AppNative() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi! You're running the native app now. Send a message and I'll reply via your Firebase Cloud Function.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Minimal defaults (you can wire this to a real selector later)
  const selectedModelId = 'deepseek-v3';
  const isPro = true;
  const userIdPreview = auth.currentUser?.uid?.slice(0, 8) ?? '—';

  const listRef = useRef<FlatList<Message>>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending && isAuthReady, [input, isSending, isAuthReady]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthError(null);
      if (!user) {
        try {
          await signInAnonymously(auth);
        } catch (e: any) {
          setAuthError(e?.message ?? 'Anonymous sign-in failed');
        }
      }
      setIsAuthReady(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Keep the newest message visible
    const t = setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 50);
    return () => clearTimeout(t);
  }, [messages.length]);

  const handleSend = async () => {
    if (!canSend) return;
    setSendError(null);
    setIsSending(true);

    const content = input.trim();
    setInput('');

    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', content };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const uid = await waitForAuth();
      const response = await chatCompletion({
        messages: [
          ...messages
            .filter((m) => m.id !== 'welcome') // don't send the local welcome text
            .map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content },
        ],
        modelId: getOpenRouterModelId(selectedModelId),
        userId: uid,
        isPro,
      });

      if (!response.success) {
        throw new Error(response.error || 'Chat request failed');
      }

      const reply = response.data?.choices?.[0]?.message?.content ?? '(Empty response)';
      const botMsg: Message = { id: `a_${Date.now()}`, role: 'assistant', content: reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e: any) {
      setSendError(e?.message ?? 'Failed to send');
    } finally {
      setIsSending(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowAssistant]}>
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
          <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAssistant]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 6 : 0}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>GemGPT (Native)</Text>
            <Text style={styles.subTitle}>Firebase auth: {isAuthReady ? `ready (${userIdPreview}…)` : 'initializing…'}</Text>
          </View>
          {isSending ? <ActivityIndicator /> : null}
        </View>

        {authError ? (
          <View style={styles.bannerError}>
            <Text style={styles.bannerErrorText}>{authError}</Text>
          </View>
        ) : null}

        {sendError ? (
          <View style={styles.bannerError}>
            <Text style={styles.bannerErrorText}>{sendError}</Text>
          </View>
        ) : null}

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.composer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={isAuthReady ? 'Type a message…' : 'Signing in…'}
            editable={isAuthReady && !isSending}
            style={[styles.input, !(isAuthReady && !isSending) && styles.inputDisabled]}
            multiline
          />
          <Pressable
            onPress={handleSend}
            disabled={!canSend}
            style={({ pressed }) => [
              styles.sendBtn,
              !canSend && styles.sendBtnDisabled,
              pressed && canSend ? styles.sendBtnPressed : null,
            ]}
          >
            <Text style={styles.sendBtnText}>{isSending ? '…' : 'Send'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  subTitle: { marginTop: 2, fontSize: 12, color: '#6B7280' },
  bannerError: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  bannerErrorText: { color: '#991B1B', fontSize: 13 },
  listContent: { padding: 16, paddingBottom: 12 },
  bubbleRow: { width: '100%', marginBottom: 10, flexDirection: 'row' },
  bubbleRowUser: { justifyContent: 'flex-end' },
  bubbleRowAssistant: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '86%', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 12 },
  bubbleUser: { backgroundColor: '#111827' },
  bubbleAssistant: { backgroundColor: '#F5F5F7' },
  bubbleText: { fontSize: 15, lineHeight: 20 },
  bubbleTextUser: { color: '#FFFFFF' },
  bubbleTextAssistant: { color: '#111827' },
  composer: {
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 140,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  inputDisabled: { opacity: 0.6 },
  sendBtn: {
    height: 44,
    minWidth: 70,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnPressed: { transform: [{ scale: 0.98 }] },
  sendBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

