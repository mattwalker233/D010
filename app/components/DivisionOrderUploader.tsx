'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileUp, X, CheckCircle, AlertCircle } from 'lucide-react';
import { loadDivisionOrder } from '@/lib/utils/division-order-loader';
import { DivisionOrderPreview } from './DivisionOrderPreview';
import type { DivisionOrder } from '@/lib/types';

interface DivisionOrderUploaderProps {
  onUploadComplete?: (order: DivisionOrder) => void;
  onError?: (error: string) => void;
}

export function DivisionOrderUploader({ onUploadComplete, onError }: DivisionOrderUploaderProps) {
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
      // Start file upload and processing
      console.log('=== Starting file upload ===');
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const formData = new FormData();
      formData.append('file', file);
      console.log('FormData created with file');

      setUploadProgress(20);
      console.log('Making request to /api/upload...');
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      });
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        console.error('API Error Response:', responseData);
        throw new Error(responseData.error || responseData.details || 'Failed to process PDF');
      }

      setUploadProgress(70);
      console.log('API Response:', responseData);

      if (!responseData.success || !responseData.data) {
        throw new Error('No data extracted from PDF');
      }

      // Debug logging
      console.log('Raw extracted data:', responseData.data);

      // The data is already in the correct format from claude-client.ts
      const previewOrder: DivisionOrder = {
        ...responseData.data,
        id: `preview-${Date.now()}`
      };

      setUploadProgress(100);
      setProcessedOrder(previewOrder);
      
      if (onUploadComplete) {
        onUploadComplete(previewOrder);
      }
    } catch (err) {
      console.error('Error processing file:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
      setUploadError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete, onError]);

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
      {!processedOrder && (
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
                  <span className="text-sm font-medium">{uploadedFile.name}</span>
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
      )}

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