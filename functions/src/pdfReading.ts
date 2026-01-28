import * as functions from 'firebase-functions';
import axios from 'axios';
import { OPENROUTER_API_KEY } from './config';

export const readPDF = functions.runWith({
  timeoutSeconds: 300, // PDF analysis can take longer
  memory: '1GB'
}).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { pdfUrl, question, userId: _userId, isPro: _isPro } = data;

  // Validate inputs
  if (!pdfUrl || typeof pdfUrl !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'PDF URL is required');
  }
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Question is required');
  }

  // Verify Pro status
  // TODO: 恢复Pro检查 - 临时注释掉以便测试
  // if (!isPro) {
  //   throw new functions.https.HttpsError('permission-denied', 'Pro subscription required for PDF reading');
  // }

  // TODO: Implement Pro check logic using Firestore
  // const userDoc = await admin.firestore().collection('users').doc(userId).get();
  // const userIsPro = userDoc.data()?.isPro || false;
  // if (!userIsPro) {
  //   throw new functions.https.HttpsError('permission-denied', 'Pro subscription required');
  // }

  try {
    // Use MiMo-V2-Flash with multimodal capabilities
    // Note: PDFs may need to be converted to images first, or use a PDF-compatible model
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'xiaomi/mimo-v2-flash', // Verify exact model ID from OpenRouter
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: `Please analyze this PDF document and answer the following question: ${question}` },
              { type: 'image_url', image_url: { url: pdfUrl } } // Note: Some models may need PDF converted to images first
            ]
          }
        ],
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://gemgpt.app',
          'X-Title': 'GemGPT',
          'Content-Type': 'application/json'
        },
        timeout: 120000 // 2 minute timeout for PDF analysis
      }
    );

    return {
      success: true,
      answer: response.data.choices[0].message.content
    };
  } catch (error: any) {
    console.error('PDF Reading Error:', error.response?.data || error.message);
    throw new functions.https.HttpsError(
      'internal',
      error.response?.data?.error?.message || 'Failed to read PDF'
    );
  }
});
