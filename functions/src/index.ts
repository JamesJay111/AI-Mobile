import * as admin from 'firebase-admin';

admin.initializeApp();

// Import function modules
export { chatCompletion } from './chat';
export { chatCompletionHttp } from './chat';
export { generateImage } from './imageGeneration';
export { analyzePDF } from './pdfReading';
