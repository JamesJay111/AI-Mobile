import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { CHAT_MODELS } from '../App';

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

// Cloud Functions
const chatCompletionFn = httpsCallable(functions, 'chatCompletion');
const generateImageFn = httpsCallable(functions, 'generateImage');
const readPDFFn = httpsCallable(functions, 'readPDF');

/**
 * Send chat completion request to OpenRouter via Firebase Cloud Function
 */
export async function chatCompletion(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  try {
    const result = await chatCompletionFn(request);
    return result.data as ChatCompletionResponse;
  } catch (error: any) {
    console.error('Chat completion error:', error);
    
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
  try {
    const result = await generateImageFn(request);
    return result.data as ImageGenerationResponse;
  } catch (error: any) {
    console.error('Image generation error:', error);
    
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
 * Read PDF using OpenRouter multimodal API via Firebase Cloud Function
 */
export async function readPDF(
  request: PDFReadingRequest
): Promise<PDFReadingResponse> {
  try {
    const result = await readPDFFn(request);
    return result.data as PDFReadingResponse;
  } catch (error: any) {
    console.error('PDF reading error:', error);
    
    // Handle specific error types
    let errorMessage = 'Failed to read PDF';
    if (error.code === 'unauthenticated') {
      errorMessage = 'Please sign in to continue';
    } else if (error.code === 'permission-denied') {
      errorMessage = 'Pro subscription required for PDF reading';
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
 * Get OpenRouter model ID from internal model ID
 */
export function getOpenRouterModelId(internalModelId: string): string {
  const model = CHAT_MODELS.find(m => m.id === internalModelId);
  return model?.openRouterId || 'deepseek/deepseek-chat'; // Default to free model
}
