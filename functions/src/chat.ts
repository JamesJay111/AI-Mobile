import * as functions from 'firebase-functions';
import axios from 'axios';
import { OPENROUTER_API_KEY } from './config';

const RUNTIME_OPTS = {
  timeoutSeconds: 60,
  memory: '512MB' as const,
  serviceAccount: 'gemgpt-ai-assistance@appspot.gserviceaccount.com'
};
export const chatCompletion = functions.runWith(RUNTIME_OPTS).https.onCall(async (data, context) => {
  const traceHeader = context.rawRequest?.headers['x-cloud-trace-context'];
  const traceValue = Array.isArray(traceHeader) ? traceHeader[0] : traceHeader;
  const requestId = (typeof traceValue === 'string' ? traceValue.split('/')[0] : null) || 
                   `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const uid = context.auth?.uid || 'unknown';

  functions.logger.info('[chatCompletion] step=auth_check', {
    requestId,
    uid,
    feature: 'chat',
  });

  // Verify user authentication
  if (!context.auth) {
    functions.logger.error('[chatCompletion] step=auth_check failed', { requestId, uid });
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { messages, modelId, userId, isPro, stream = false } = data;

  functions.logger.info('[chatCompletion] step=input_validate', {
    requestId,
    uid,
    feature: 'chat',
    modelId,
    messagesCount: messages?.length || 0,
    userId: userId?.substring(0, 8) + '...',
    isPro,
  });

  // Get OpenRouter model ID
  const openRouterModelId = modelId;

  // Validate messages
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    functions.logger.error('[chatCompletion] step=input_validate failed', {
      requestId,
      uid,
      reason: 'Messages array is required',
    });
    throw new functions.https.HttpsError('invalid-argument', 'Messages array is required');
  }

  // Check Pro status for Pro-only models
  // TODO: Implement Pro check logic using Firestore
  // const userDoc = await admin.firestore().collection('users').doc(userId).get();
  // const userIsPro = userDoc.data()?.isPro || false;
  // For now, we trust the frontend isPro value but should verify in production

  try {
    functions.logger.info('[chatCompletion] step=openrouter_request', {
      requestId,
      uid,
      feature: 'chat',
      modelId: openRouterModelId,
      messagesCount: messages.length,
    });

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
          'HTTP-Referer': 'https://gemgpt.app',
          'X-Title': 'GemGPT',
          'Content-Type': 'application/json'
        },
        timeout: 60000, // 60 seconds
      }
    );

    const contentLength = response.data?.choices?.[0]?.message?.content?.length || 0;
    functions.logger.info('[chatCompletion] step=openrouter_response', {
      requestId,
      uid,
      feature: 'chat',
      hasChoices: !!response.data?.choices?.length,
      contentLength,
    });

    functions.logger.info('[chatCompletion] step=return', {
      requestId,
      uid,
      feature: 'chat',
      success: true,
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    const errorStatus = error.response?.status;
    const errorData = error.response?.data;
    const errorMessage = errorData?.error?.message || error.message;

    functions.logger.error('[chatCompletion] step=openrouter_error', {
      requestId,
      uid,
      feature: 'chat',
      errorStatus,
      errorMessage: errorMessage?.substring(0, 200), // Truncate long errors
      errorCode: errorData?.error?.code,
    });

    throw new functions.https.HttpsError(
      errorStatus === 401 ? 'unauthenticated' :
      errorStatus === 403 ? 'permission-denied' :
      errorStatus === 429 ? 'resource-exhausted' :
      'internal',
      errorMessage || 'Failed to generate response'
    );
  }
});
