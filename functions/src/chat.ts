import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import * as corsModule from 'cors';
import { OPENROUTER_API_KEY } from './config';

const RUNTIME_OPTS = {
  timeoutSeconds: 60,
  memory: '512MB' as const,
  serviceAccount: 'gemgpt-ai-assistance@appspot.gserviceaccount.com'
};

const corsHandler = corsModule.default({ origin: true });
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

/**
 * HTTP endpoint for Web dev to avoid CORS issues with callable in some setups.
 * This verifies Firebase ID token from Authorization: Bearer <token>.
 */
export const chatCompletionHttp = functions
  .runWith(RUNTIME_OPTS)
  .https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
      }

      const requestId = `chat_http_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      try {
        if (req.method !== 'POST') {
          res.status(405).json({ success: false, error: 'Method not allowed' });
          return;
        }

        const authHeader = req.headers.authorization || '';
        const match =
          typeof authHeader === 'string'
            ? authHeader.match(/^Bearer\s+(.+)$/i)
            : null;
        if (!match?.[1]) {
          functions.logger.error('[chatCompletionHttp] step=auth_check failed', {
            requestId,
            reason: 'Missing bearer token',
          });
          res.status(401).json({ success: false, error: 'Unauthenticated' });
          return;
        }

        const decoded = await admin.auth().verifyIdToken(match[1]);
        const uid = decoded.uid;

        const { messages, modelId, stream = false } = req.body || {};
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
          res
            .status(400)
            .json({ success: false, error: 'Messages array is required' });
          return;
        }
        if (!modelId || typeof modelId !== 'string') {
          res
            .status(400)
            .json({ success: false, error: 'modelId is required' });
          return;
        }

        functions.logger.info('[chatCompletionHttp] step=openrouter_request', {
          requestId,
          uid,
          feature: 'chat',
          modelId,
          messagesCount: messages.length,
        });

        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          { model: modelId, messages, stream: !!stream },
          {
            headers: {
              Authorization: `Bearer ${OPENROUTER_API_KEY}`,
              'HTTP-Referer': 'https://gemgpt.app',
              'X-Title': 'GemGPT',
              'Content-Type': 'application/json',
            },
            timeout: 60000,
          }
        );

        res.status(200).json({ success: true, data: response.data });
      } catch (error: any) {
        const status = error?.response?.status;
        const msg =
          error?.response?.data?.error?.message ||
          error?.message ||
          'Internal error';
        functions.logger.error('[chatCompletionHttp] step=error', {
          requestId,
          status,
          msg: String(msg).substring(0, 200),
        });
        res.status(500).json({ success: false, error: msg });
      }
    });
  });
