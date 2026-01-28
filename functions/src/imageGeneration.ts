import * as functions from 'firebase-functions';
import axios from 'axios';
import { OPENROUTER_API_KEY } from './config';

const RUNTIME_OPTS = {
  timeoutSeconds: 300,
  memory: '1GB' as const,
  serviceAccount: 'gemgpt-ai-assistance@appspot.gserviceaccount.com'
};
export const generateImage = functions.runWith(RUNTIME_OPTS).https.onCall(async (data, context) => {
  const traceHeader = context.rawRequest?.headers['x-cloud-trace-context'];
  const traceValue = Array.isArray(traceHeader) ? traceHeader[0] : traceHeader;
  const requestId = (typeof traceValue === 'string' ? traceValue.split('/')[0] : null) || 
                   `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const uid = context.auth?.uid || 'unknown';

  functions.logger.info('[generateImage] step=auth_check', {
    requestId,
    uid,
    feature: 'image',
  });

  if (!context.auth) {
    functions.logger.error('[generateImage] step=auth_check failed', { requestId, uid });
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { prompt, referenceImageUrl, userId, isPro } = data;

  functions.logger.info('[generateImage] step=input_validate', {
    requestId,
    uid,
    feature: 'image',
    promptLength: prompt?.length || 0,
    hasReferenceImage: !!referenceImageUrl,
    referenceImageUrlLength: referenceImageUrl?.length || 0,
    userId: userId?.substring(0, 8) + '...',
    isPro,
  });

  // Validate prompt
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    functions.logger.error('[generateImage] step=input_validate failed', {
      requestId,
      uid,
      reason: 'Prompt is required',
    });
    throw new functions.https.HttpsError('invalid-argument', 'Prompt is required');
  }

  // Verify Pro status
  functions.logger.info('[generateImage] step=permission_check', {
    requestId,
    uid,
    feature: 'image',
    isPro,
  });

  if (!isPro) {
    functions.logger.warn('[generateImage] step=permission_check failed', {
      requestId,
      uid,
      reason: 'Pro subscription required',
    });
    throw new functions.https.HttpsError('permission-denied', 'Pro subscription required for image generation');
  }

  // TODO: Implement Pro check logic using Firestore
  // const userDoc = await admin.firestore().collection('users').doc(userId).get();
  // const userIsPro = userDoc.data()?.isPro || false;
  // if (!userIsPro) {
  //   throw new functions.https.HttpsError('permission-denied', 'Pro subscription required');
  // }

  try {
    functions.logger.info('[generateImage] step=openrouter_request', {
      requestId,
      uid,
      feature: 'image',
      model: 'black-forest-labs/flux-pro',
      hasReferenceImage: !!referenceImageUrl,
    });

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'black-forest-labs/flux-pro',
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
    const imageUrl = response.data.choices?.[0]?.message?.content || 
                     response.data.data?.[0]?.url;

    functions.logger.info('[generateImage] step=openrouter_response', {
      requestId,
      uid,
      feature: 'image',
      hasImageUrl: !!imageUrl,
      imageUrlLength: imageUrl?.length || 0,
    });

    functions.logger.info('[generateImage] step=return', {
      requestId,
      uid,
      feature: 'image',
      success: true,
    });

    return {
      success: true,
      imageUrl: imageUrl
    };
  } catch (error: any) {
    const errorStatus = error.response?.status;
    const errorData = error.response?.data;
    const errorMessage = errorData?.error?.message || error.message;

    functions.logger.error('[generateImage] step=openrouter_error', {
      requestId,
      uid,
      feature: 'image',
      errorStatus,
      errorMessage: errorMessage?.substring(0, 200),
      errorCode: errorData?.error?.code,
    });

    throw new functions.https.HttpsError(
      errorStatus === 401 ? 'unauthenticated' :
      errorStatus === 403 ? 'permission-denied' :
      errorStatus === 429 ? 'resource-exhausted' :
      'internal',
      errorMessage || 'Failed to generate image'
    );
  }
});
