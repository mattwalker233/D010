'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileUp, X, CheckCircle, AlertCircle, Upload, Trash2, Play } from 'lucide-react';
import { DivisionOrderPreview } from './DivisionOrderPreview';
import type { DivisionOrder } from '@/lib/types';

interface FileUploadStatus {
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  result?: DivisionOrder;
}

interface MultiDivisionOrderUploaderProps {
  onUploadComplete?: (orders: DivisionOrder[]) => void;
  onError?: (error: string) => void;
}

export function MultiDivisionOrderUploader({ onUploadComplete, onError }: MultiDivisionOrderUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [fileStatuses, setFileStatuses] = useState<FileUploadStatus[]>([]);
  const [processedOrders, setProcessedOrders] = useState<DivisionOrder[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles.map(f => f.name));
    
    // Add new files to selected files
    const newFiles = acceptedFiles.filter(newFile => 
      !selectedFiles.some(existingFile => 
        existingFile.name === newFile.name && existingFile.size === newFile.size
      )
    );
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
  }, [selectedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const handleProcessAll = async () => {
    if (selectedFiles.length === 0) return;

    // Initialize file statuses
    const initialStatuses: FileUploadStatus[] = selectedFiles.map(file => ({
      file,
      status: 'pending',
      progress: 0
    }));

    setFileStatuses(initialStatuses);
    setUploading(true);
    setProcessedOrders([]);

    try {
      console.log(`=== Processing ${selectedFiles.length} files ===`);
      
      // Create FormData with all files
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      // Update all files to processing status
      setFileStatuses(prev => prev.map(status => ({ 
        ...status, 
        status: 'processing', 
        progress: 50 
      })));

      // Send all files to backend for processing
      const response = await fetch('http://localhost:8000/api/upload-multiple', {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || 'Failed to process PDFs');
      }

      if (!responseData.success || !responseData.results) {
        throw new Error('No results received from server');
      }

      console.log('Processing results:', responseData);

      // Update file statuses based on results
      const results: DivisionOrder[] = [];
      
      responseData.results.forEach((result: any, index: number) => {
        if (result.success && result.data) {
          // Create the order object
          const order: DivisionOrder = {
            ...result.data,
            id: `preview-${Date.now()}-${index}`
          };
          results.push(order);

          // Update status to completed
          setFileStatuses(prev => prev.map((status, i) => 
            i === index ? { 
              ...status, 
              status: 'completed', 
              progress: 100, 
              result: order 
            } : status
          ));
        } else {
          // Update status to error
          setFileStatuses(prev => prev.map((status, i) => 
            i === index ? { 
              ...status, 
              status: 'error', 
              progress: 0, 
              error: result.error || 'Unknown error'
            } : status
          ));
        }
      });

      setProcessedOrders(results);

      if (results.length > 0 && onUploadComplete) {
        onUploadComplete(results);
      }

    } catch (err) {
      console.error('Error processing files:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process files';
      
      // Update all files to error status
      setFileStatuses(prev => prev.map(status => ({ 
        ...status, 
        status: 'error', 
        progress: 0, 
        error: errorMessage 
      })));

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setFileStatuses([]);
    setProcessedOrders([]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusIcon = (status: FileUploadStatus['status']) => {
    switch (status) {
      case 'pending':
        return <FileUp className="h-4 w-4 text-muted-foreground" />;
      case 'processing':
        return <Upload className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: FileUploadStatus['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing...';
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Error';
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-2">
          <FileUp className="h-12 w-12 mx-auto text-muted-foreground" />
          <div className="text-lg font-medium">
            {isDragActive ? (
              "Drop PDF files here"
            ) : (
              "Drag & drop division order PDFs here"
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            or click to select multiple files
          </p>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Selected Files ({selectedFiles.length})</h3>
            <div className="flex gap-2">
              <Button
                onClick={handleProcessAll}
                disabled={uploading || selectedFiles.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="h-4 w-4 mr-2" />
                {uploading ? 'Processing...' : 'Process All Files'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={uploading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processing Status */}
      {fileStatuses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Processing Status</h3>
          <div className="space-y-3">
            {fileStatuses.map((fileStatus, index) => (
              <div
                key={`${fileStatus.file.name}-${index}`}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(fileStatus.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{fileStatus.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getStatusText(fileStatus.status)}
                      </p>
                    </div>
                  </div>
                </div>

                {fileStatus.status === 'processing' && (
                  <Progress value={fileStatus.progress} />
                )}

                {fileStatus.status === 'error' && (
                  <p className="text-sm text-red-600">{fileStatus.error}</p>
                )}

                {fileStatus.status === 'completed' && fileStatus.result && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      Successfully processed: {fileStatus.result.operator} - {fileStatus.result.entity}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Orders */}
      {processedOrders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Processed Orders ({processedOrders.length})</h3>
          {processedOrders.map((order, index) => (
            <DivisionOrderPreview
              key={order.id}
              order={order}
              onUpdate={(updatedOrder) => {
                const updatedOrders = [...processedOrders];
                updatedOrders[index] = updatedOrder;
                setProcessedOrders(updatedOrders);
                if (onUploadComplete) {
                  onUploadComplete(updatedOrders);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
} 