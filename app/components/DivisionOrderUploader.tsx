'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileUp, X, CheckCircle, AlertCircle } from 'lucide-react';
import { loadDivisionOrder } from '@/lib/utils/division-order-loader';
import { DivisionOrderPreview } from './DivisionOrderPreview';
import type { DivisionOrder } from '@/lib/types';

interface DivisionOrderUploaderProps {
  stateCode: string;
  onUploadComplete?: (order: DivisionOrder) => void;
  onError?: (error: string) => void;
}

export function DivisionOrderUploader({ stateCode, onUploadComplete, onError }: DivisionOrderUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processedOrder, setProcessedOrder] = useState<DivisionOrder | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadedFile(file);
    setProcessedOrder(null);

    try {
      // Start file upload and OCR processing
      const formData = new FormData();
      formData.append('file', file);
      formData.append('stateCode', stateCode);

      setUploadProgress(20);
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      setUploadProgress(50);
      const { extractedText, ocrConfidence } = await response.json();

      // Process the extracted text with Claude API
      setUploadProgress(70);
      const claudeResponse = await fetch('/api/claude/extract-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: extractedText,
          stateCode,
          confidence: ocrConfidence,
        }),
      });

      if (!claudeResponse.ok) {
        throw new Error('Failed to extract data from text');
      }

      setUploadProgress(90);
      const extractedData = await claudeResponse.json();

      // Load the division order with the extracted data
      const result = await loadDivisionOrder({
        fileName: file.name,
        extractedData
      });

      setUploadProgress(100);
      setProcessedOrder(result);
      
      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
      setUploadError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setUploading(false);
    }
  }, [stateCode, onUploadComplete, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleClear = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setUploadError(null);
    setProcessedOrder(null);
  };

  return (
    <div className="space-y-8">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
          ${uploadedFile ? 'border-solid' : 'border-dashed'}
        `}
      >
        <input {...getInputProps()} />
        
        {uploadedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileUp className="h-5 w-5 text-primary" />
                <span className="font-medium">{uploadedFile.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-sm text-muted-foreground">
                  {uploadProgress < 20 && "Preparing upload..."}
                  {uploadProgress >= 20 && uploadProgress < 50 && "Processing PDF..."}
                  {uploadProgress >= 50 && uploadProgress < 70 && "Extracting text..."}
                  {uploadProgress >= 70 && uploadProgress < 90 && "Analyzing with Claude..."}
                  {uploadProgress >= 90 && "Finalizing..."}
                </p>
              </div>
            )}

            {uploadError && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{uploadError}</span>
              </div>
            )}

            {!uploading && !uploadError && processedOrder && (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Upload complete!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <FileUp className="h-12 w-12 mx-auto text-muted-foreground" />
            <div className="text-lg font-medium">
              {isDragActive ? (
                "Drop the PDF file here"
              ) : (
                "Drag & drop a division order PDF here"
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              or click to select a file
            </p>
          </div>
        )}
      </div>

      {processedOrder && (
        <DivisionOrderPreview
          order={processedOrder}
          onUpdate={(updatedOrder) => {
            setProcessedOrder(updatedOrder);
            if (onUploadComplete) {
              onUploadComplete(updatedOrder);
            }
          }}
        />
      )}
    </div>
  );
} 