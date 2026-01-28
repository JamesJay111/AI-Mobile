import * as functions from 'firebase-functions';
import axios from 'axios';
import { OPENROUTER_API_KEY } from './config';

const RUNTIME_OPTS = {
  timeoutSeconds: 300,
  memory: '1GB' as const,
  serviceAccount: 'gemgpt-ai-assistance@appspot.gserviceaccount.com'
};
export const analyzePDF = functions.runWith(RUNTIME_OPTS).https.onCall(async (data, context) => {
  const traceHeader = context.rawRequest?.headers['x-cloud-trace-context'];
  const traceValue = Array.isArray(traceHeader) ? traceHeader[0] : traceHeader;
  const requestId = (typeof traceValue === 'string' ? traceValue.split('/')[0] : null) || 
                   `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const uid = context.auth?.uid || 'unknown';

  functions.logger.info('[analyzePDF] step=auth_check', {
    requestId,
    uid,
    feature: 'pdf',
  });

  if (!context.auth) {
    functions.logger.error('[analyzePDF] step=auth_check failed', { requestId, uid });
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { pdfUrl, question, userId, isPro } = data;

  functions.logger.info('[analyzePDF] step=input_validate', {
    requestId,
    uid,
    feature: 'pdf',
    pdfUrlLength: pdfUrl?.length || 0,
    pdfUrlPreview: pdfUrl?.substring(0, 50) + '...',
    questionLength: question?.length || 0,
    userId: userId?.substring(0, 8) + '...',
    isPro,
  });

  // Validate inputs
  if (!pdfUrl || typeof pdfUrl !== 'string') {
    functions.logger.error('[analyzePDF] step=input_validate failed', {
      requestId,
      uid,
      reason: 'PDF URL is required',
    });
    throw new functions.https.HttpsError('invalid-argument', 'PDF URL is required');
  }
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    functions.logger.error('[analyzePDF] step=input_validate failed', {
      requestId,
      uid,
      reason: 'Question is required',
    });
    throw new functions.https.HttpsError('invalid-argument', 'Question is required');
  }

  // Verify Pro status
  functions.logger.info('[analyzePDF] step=permission_check', {
    requestId,
    uid,
    feature: 'pdf',
    isPro,
  });

  if (!isPro) {
    functions.logger.warn('[analyzePDF] step=permission_check failed', {
      requestId,
      uid,
      reason: 'Pro subscription required',
    });
    throw new functions.https.HttpsError('permission-denied', 'Pro subscription required for PDF analysis');
  }

  // TODO: Implement Pro check logic using Firestore
  // const userDoc = await admin.firestore().collection('users').doc(userId).get();
  // const userIsPro = userDoc.data()?.isPro || false;
  // if (!userIsPro) {
  //   throw new functions.https.HttpsError('permission-denied', 'Pro subscription required');
  // }

  try {
    functions.logger.info('[analyzePDF] step=openrouter_request', {
      requestId,
      uid,
      feature: 'pdf',
      model: 'xiaomi/mimo-v2-flash',
      pdfUrlLength: pdfUrl.length,
      questionLength: question.length,
    });

    // Use MiMo-V2-Flash with multimodal capabilities
    // Note: PDFs may need to be converted to images first, or use a PDF-compatible model
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'xiaomi/mimo-v2-flash',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: `Please analyze this PDF document and answer the following question: ${question}` },
              { type: 'image_url', image_url: { url: pdfUrl } }
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

    const answerLength = response.data.choices[0]?.message?.content?.length || 0;
    functions.logger.info('[analyzePDF] step=openrouter_response', {
      requestId,
      uid,
      feature: 'pdf',
      hasAnswer: !!response.data.choices[0]?.message?.content,
      answerLength,
    });

    functions.logger.info('[analyzePDF] step=return', {
      requestId,
      uid,
      feature: 'pdf',
      success: true,
    });

    return {
      success: true,
      answer: response.data.choices[0].message.content
    };
  } catch (error: any) {
    const errorStatus = error.response?.status;
    const errorData = error.response?.data;
    const errorMessage = errorData?.error?.message || error.message;

    functions.logger.error('[analyzePDF] step=openrouter_error', {
      requestId,
      uid,
      feature: 'pdf',
      errorStatus,
      errorMessage: errorMessage?.substring(0, 200),
      errorCode: errorData?.error?.code,
    });

    throw new functions.https.HttpsError(
      errorStatus === 401 ? 'unauthenticated' :
      errorStatus === 403 ? 'permission-denied' :
      errorStatus === 429 ? 'resource-exhausted' :
      'internal',
      errorMessage || 'Failed to analyze PDF'
    );
  }
});
