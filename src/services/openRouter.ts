import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { auth } from '../config/firebase';
import { CHAT_MODELS } from '../App';
import { firebaseConfig } from '../config/firebaseConfig';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  modelId: string;
  userId: string;
  isPro: boolean;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  success: boolean;
  data?: {
    choices: Array<{
      message: {
        role: string;
        content: string;
      };
    }>;
  };
  error?: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  referenceImageUrl?: string;
  userId: string;
  isPro: boolean;
}

export interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface PDFReadingRequest {
  pdfUrl: string;
  question: string;
  userId: string;
  isPro: boolean;
}

export interface PDFReadingResponse {
  success: boolean;
  answer?: string;
  error?: string;
}

// Alias for backward compatibility
export interface AnalyzePDFRequest extends PDFReadingRequest {}
export interface AnalyzePDFResponse extends PDFReadingResponse {}

// Cloud Functions
const chatCompletionFn = httpsCallable(functions, 'chatCompletion');
const generateImageFn = httpsCallable(functions, 'generateImage');
const analyzePDFFn = httpsCallable(functions, 'analyzePDF');
const REGION = 'us-central1';

async function chatCompletionHttp(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    return { success: false, error: 'User not authenticated. Please wait for authentication to complete.' };
  }
  const url = `https://${REGION}-${firebaseConfig.projectId}.cloudfunctions.net/chatCompletionHttp`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return { success: false, error: json?.error || `HTTP ${res.status}` };
    }
    return json as ChatCompletionResponse;
  } catch (e: any) {
    return { success: false, error: e?.message || 'Network error' };
  }
}

/**
 * Send chat completion request to OpenRouter via Firebase Cloud Function
 */
export async function chatCompletion(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/32289130-f534-4630-9c42-4b2caa924b0b',{method:'POST',mode:'no-cors',body:JSON.stringify({location:'openRouter.ts:chatCompletion:start',message:'chatCompletion start',data:{hasAuth:!!auth.currentUser,modelId:String(request.modelId||''),messagesCount:request.messages?.length||0,isPro:!!request.isPro},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H5'})}).catch(()=>{});
  // #endregion
  // Ensure user is authenticated before making the call
  if (!auth.currentUser) {
    console.error('[TRACE] feature=chat step=auth_check failed: No authenticated user');
    return {
      success: false,
      error: 'User not authenticated. Please wait for authentication to complete.'
    };
  }

  const requestId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const payloadSummary = {
    modelId: request.modelId,
    messagesCount: request.messages.length,
    userId: request.userId?.substring(0, 8) + '...',
    isPro: request.isPro,
  };

  console.log(`[TRACE] feature=chat step=callable_start requestId=${requestId}`, payloadSummary);

  try {
    console.log(`[TRACE] feature=chat step=callable_before requestId=${requestId}`, {
      functionName: 'chatCompletion',
      payload: payloadSummary,
    });

    // Workaround: some web dev origins hit CORS issues with callable.
    // Use HTTP endpoint on web, callable on native.
    const isWeb = typeof window !== 'undefined';
    const result = isWeb ? await chatCompletionHttp(request) : ((await chatCompletionFn(request)).data as ChatCompletionResponse);

    const responseSummary = {
      success: (result as any)?.success,
      hasChoices: !!(result as any)?.data?.choices?.length,
      contentLength: (result as any)?.data?.choices?.[0]?.message?.content?.length || 0,
    };

    console.log(`[TRACE] feature=chat step=callable_after requestId=${requestId}`, responseSummary);

    return result as ChatCompletionResponse;
  } catch (error: any) {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/32289130-f534-4630-9c42-4b2caa924b0b',{method:'POST',mode:'no-cors',body:JSON.stringify({location:'openRouter.ts:chatCompletion:error',message:'chatCompletion callable threw',data:{code:String(error?.code||''),message:String(error?.message||''),detailsType:typeof error?.details,detailsKeys:error?.details&&typeof error.details==='object'?Object.keys(error.details).slice(0,10):null},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H5'})}).catch(()=>{});
    // #endregion
    console.error(`[TRACE] feature=chat step=callable_error requestId=${requestId}`, {
      code: error.code,
      message: error.message,
      details: error.details,
    });
    
    // Handle specific error types
    let errorMessage = 'Failed to generate response';
    if (error.code === 'unauthenticated') {
      errorMessage = 'Please sign in to continue';
    } else if (error.code === 'permission-denied') {
      errorMessage = 'This feature requires Pro subscription';
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'API quota exceeded. Please try again later.';
    } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
      errorMessage = 'Network error. Please check your connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Generate image using OpenRouter via Firebase Cloud Function
 */
export async function generateImage(
  request: ImageGenerationRequest
): Promise<ImageGenerationResponse> {
  // Ensure user is authenticated before making the call
  if (!auth.currentUser) {
    console.error('[TRACE] feature=image step=auth_check failed: No authenticated user');
    return {
      success: false,
      error: 'User not authenticated. Please wait for authentication to complete.'
    };
  }

  const requestId = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const payloadSummary = {
    promptLength: request.prompt?.length || 0,
    hasReferenceImage: !!request.referenceImageUrl,
    referenceImageUrlLength: request.referenceImageUrl?.length || 0,
    userId: request.userId?.substring(0, 8) + '...',
    isPro: request.isPro,
  };

  console.log(`[TRACE] feature=image step=callable_start requestId=${requestId}`, payloadSummary);

  try {
    console.log(`[TRACE] feature=image step=callable_before requestId=${requestId}`, {
      functionName: 'generateImage',
      payload: payloadSummary,
    });

    const result = await generateImageFn(request);

    const responseSummary = {
      success: result.data?.success,
      hasImageUrl: !!result.data?.imageUrl,
      imageUrlLength: result.data?.imageUrl?.length || 0,
    };

    console.log(`[TRACE] feature=image step=callable_after requestId=${requestId}`, responseSummary);

    return result.data as ImageGenerationResponse;
  } catch (error: any) {
    console.error(`[TRACE] feature=image step=callable_error requestId=${requestId}`, {
      code: error.code,
      message: error.message,
      details: error.details,
    });
    
    // Handle specific error types
    let errorMessage = 'Failed to generate image';
    if (error.code === 'unauthenticated') {
      errorMessage = 'Please sign in to continue';
    } else if (error.code === 'permission-denied') {
      errorMessage = 'Pro subscription required for image generation';
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'API quota exceeded. Please try again later.';
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Image generation timed out. Please try again.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Analyze PDF using OpenRouter multimodal API via Firebase Cloud Function
 */
export async function analyzePDF(
  request: AnalyzePDFRequest
): Promise<AnalyzePDFResponse> {
  // Ensure user is authenticated before making the call
  if (!auth.currentUser) {
    console.error('[TRACE] feature=pdf step=auth_check failed: No authenticated user');
    return {
      success: false,
      error: 'User not authenticated. Please wait for authentication to complete.'
    };
  }

  const requestId = `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const payloadSummary = {
    pdfUrlLength: request.pdfUrl?.length || 0,
    pdfUrlPreview: request.pdfUrl?.substring(0, 50) + '...',
    questionLength: request.question?.length || 0,
    userId: request.userId?.substring(0, 8) + '...',
    isPro: request.isPro,
  };

  console.log(`[TRACE] feature=pdf step=callable_start requestId=${requestId}`, payloadSummary);

  try {
    console.log(`[TRACE] feature=pdf step=callable_before requestId=${requestId}`, {
      functionName: 'analyzePDF',
      payload: payloadSummary,
    });

    const result = await analyzePDFFn(request);

    const responseSummary = {
      success: result.data?.success,
      hasAnswer: !!result.data?.answer,
      answerLength: result.data?.answer?.length || 0,
    };

    console.log(`[TRACE] feature=pdf step=callable_after requestId=${requestId}`, responseSummary);

    return result.data as AnalyzePDFResponse;
  } catch (error: any) {
    console.error(`[TRACE] feature=pdf step=callable_error requestId=${requestId}`, {
      code: error.code,
      message: error.message,
      details: error.details,
    });
    
    // Handle specific error types
    let errorMessage = 'Failed to analyze PDF';
    if (error.code === 'unauthenticated') {
      errorMessage = 'Please sign in to continue';
    } else if (error.code === 'permission-denied') {
      errorMessage = 'Pro subscription required for PDF analysis';
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'API quota exceeded. Please try again later.';
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'PDF analysis timed out. Please try again.';
    } else if (error.message?.includes('file size') || error.message?.includes('too large')) {
      errorMessage = 'PDF file is too large. Maximum size is 10MB.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * @deprecated Use analyzePDF instead. This is kept for backward compatibility.
 */
export async function readPDF(
  request: PDFReadingRequest
): Promise<PDFReadingResponse> {
  return analyzePDF(request);
}

/**
 * Get OpenRouter model ID from internal model ID
 */
export function getOpenRouterModelId(internalModelId: string): string {
  const model = CHAT_MODELS.find(m => m.id === internalModelId);
  return model?.openRouterId || 'deepseek/deepseek-chat'; // Default to free model
}
