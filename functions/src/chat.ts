import * as functions from 'firebase-functions';
import axios from 'axios';
import { OPENROUTER_API_KEY } from './config';

export const chatCompletion = functions.runWith({
  timeoutSeconds: 60,
  memory: '512MB'
}).https.onCall(async (data, context) => {
  // Verify user authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { messages, modelId, userId: _userId, isPro: _isPro, stream = false } = data;

  // Get OpenRouter model ID
  // Note: In production, maintain a mapping of model IDs
  const openRouterModelId = modelId; // This should be the OpenRouter model ID

  // Validate messages
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Messages array is required');
  }

  // Check if user has Pro access for Pro-only models
  // TODO: Implement Pro check logic using Firestore
  // const userDoc = await admin.firestore().collection('users').doc(userId).get();
  // const userIsPro = userDoc.data()?.isPro || false;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: openRouterModelId,
        messages: messages,
        stream: stream
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://gemgpt.app', // Your app URL
          'X-Title': 'GemGPT',
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    throw new functions.https.HttpsError(
      'internal',
      error.response?.data?.error?.message || 'Failed to generate response'
    );
  }
});
