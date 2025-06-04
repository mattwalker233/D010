import { createWorker } from 'tesseract.js';
import type { RecognizeResult } from 'tesseract.js';

export interface ExtractedText {
  text: string;
  confidence: number;
}

export async function extractTextFromImage(imageFile: File): Promise<ExtractedText> {
  try {
    // Create worker with browser-compatible configuration
    const worker = await createWorker({
      logger: process.env.NODE_ENV === 'development' ? m => console.log('Tesseract:', m) : undefined,
    });

    // Initialize worker with English language
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    // Set recognition parameters
    await worker.setParameters({
      tessedit_ocr_engine_mode: 1, // 1 for neural nets LSTM only
      preserve_interword_spaces: '1',
    });

    // Process the image
    const result: RecognizeResult = await worker.recognize(imageFile);

    // Clean up worker
    await worker.terminate();

    return {
      text: result.data.text,
      confidence: result.data.confidence,
    };
  } catch (error) {
    console.error('Error processing image with Tesseract:', error);
    throw new Error('Failed to process image with OCR');
  }
}

export async function isImageProcessable(file: File): Promise<boolean> {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  return validTypes.includes(file.type);
} 