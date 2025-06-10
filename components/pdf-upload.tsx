'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { extractTextFromPDF, createFallbackData } from '@/lib/pdf-processor';
import { extractDivisionOrderData } from '@/lib/division-order-parser';

export function PDFUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // Extract text from PDF
      const text = await extractTextFromPDF(file);
      
      // Parse the extracted text
      const data = extractDivisionOrderData(text);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('extractedData', JSON.stringify(data));

      // Send to API
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const result = await response.json();
      console.log('PDF processed successfully:', result);
      
      // Reset form
      event.target.value = '';
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError(err instanceof Error ? err.message : 'Failed to process PDF');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center w-full">
        <label
          htmlFor="pdf-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF files only</p>
          </div>
          <input
            id="pdf-upload"
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </label>
      </div>

      {isLoading && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Processing PDF...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
} 