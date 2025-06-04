'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { extractTextFromImage, isImageProcessable } from '@/lib/client-tesseract';
import { Loader2 } from 'lucide-react';

interface ImageOCRProps {
  onExtractComplete: (text: string) => void;
  onError?: (error: string) => void;
}

export function ImageOCR({ onExtractComplete, onError }: ImageOCRProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!await isImageProcessable(file)) {
        onError?.('Please select a valid image file (PNG, JPEG, or WebP)');
        return;
      }

      setIsProcessing(true);
      const result = await extractTextFromImage(file);
      onExtractComplete(result.text);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
        disabled={isProcessing}
      />
      <label htmlFor="image-upload">
        <Button
          variant="outline"
          disabled={isProcessing}
          className="cursor-pointer"
          asChild
        >
          <span>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Upload Image for OCR'
            )}
          </span>
        </Button>
      </label>
    </div>
  );
} 