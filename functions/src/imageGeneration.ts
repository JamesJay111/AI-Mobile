import * as functions from 'firebase-functions';
import axios from 'axios';
import { OPENROUTER_API_KEY } from './config';

export const generateImage = functions.runWith({
  timeoutSeconds: 300, // Image generation can take longer
  memory: '1GB'
}).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { prompt, referenceImageUrl, userId: _userId, isPro: _isPro } = data;

  // Validate prompt
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Prompt is required');
  }

  // Verify Pro status
  // TODO: 恢复Pro检查 - 临时注释掉以便测试
  // if (!isPro) {
  //   throw new functions.https.HttpsError('permission-denied', 'Pro subscription required for image generation');
  // }

  // TODO: Implement Pro check logic using Firestore
  // const userDoc = await admin.firestore().collection('users').doc(userId).get();
  // const userIsPro = userDoc.data()?.isPro || false;
  // if (!userIsPro) {
  //   throw new functions.https.HttpsError('permission-denied', 'Pro subscription required');
  // }

  try {
    // For FLUX.2 Klein, use OpenRouter's image generation endpoint
    // NOTE: Check OpenRouter docs for correct endpoint - may need to use text-to-image models
    // OpenRouter may route image generation through chat completions with special models
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'black-forest-labs/flux-pro', // Verify exact model ID from OpenRouter
        messages: [
          {
            role: 'user',
            content: referenceImageUrl
              ? [
                  { type: 'text', text: prompt },
                  { type: 'image_url', image_url: { url: referenceImageUrl } }
                ]
              : prompt
          }
        ],
        // Some image models may require additional parameters
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://gemgpt.app',
          'X-Title': 'GemGPT',
          'Content-Type': 'application/json'
        },
        timeout: 120000 // 2 minute timeout for image generation
      }
    );

    // Extract image URL from response
    // Response format may vary - adjust based on OpenRouter API response
    const imageUrl = response.data.choices?.[0]?.message?.content || 
                     response.data.data?.[0]?.url;

    return {
      success: true,
      imageUrl: imageUrl
    };
  } catch (error: any) {
    console.error('Image Generation Error:', error.response?.data || error.message);
    throw new functions.https.HttpsError(
      'internal',
      error.response?.data?.error?.message || 'Failed to generate image'
    );
  }
});
