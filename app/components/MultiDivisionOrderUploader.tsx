'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileUp, X, CheckCircle, AlertCircle, Upload, Trash2, Play, FileText, Clock, CheckSquare } from 'lucide-react';
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/upload-multiple`, {
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
    <div className="space-y-8">
      {/* Enhanced File Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer
          transition-all duration-300
          ${isDragActive 
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 scale-105 shadow-xl' 
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className={`
            w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-300
            ${isDragActive 
              ? 'bg-blue-100 text-blue-600 scale-110' 
              : 'bg-slate-100 text-slate-400'
            }
          `}>
            <FileUp className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <div className="text-xl font-semibold text-slate-700">
              {isDragActive ? (
                "Drop your PDFs here"
              ) : (
                "Drag & drop division order PDFs here"
              )}
            </div>
            <p className="text-slate-500">
              or click to browse and select multiple files
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mt-3">
              <FileText className="h-4 w-4" />
              <span>Supports multiple PDF files</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Files Section */}
      {selectedFiles.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                Selected Files ({selectedFiles.length})
              </h3>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleProcessAll}
                disabled={uploading || selectedFiles.length === 0}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Play className="h-4 w-4 mr-2" />
                {uploading ? 'Processing...' : 'Process All Files'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={uploading}
                className="px-4 py-3 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Enhanced File List */}
          <div className="grid gap-3">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{file.name}</p>
                    <p className="text-sm text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Processing Status */}
      {fileStatuses.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
              <Clock className="h-4 w-4 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Processing Status</h3>
          </div>
          <div className="grid gap-4">
            {fileStatuses.map((fileStatus, index) => (
              <div
                key={`${fileStatus.file.name}-${index}`}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center
                      ${fileStatus.status === 'completed' ? 'bg-green-100' : 
                        fileStatus.status === 'error' ? 'bg-red-100' : 
                        fileStatus.status === 'processing' ? 'bg-blue-100' : 'bg-slate-100'
                      }
                    `}>
                      {getStatusIcon(fileStatus.status)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{fileStatus.file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`
                          text-xs px-2 py-1 rounded-full font-medium
                          ${fileStatus.status === 'completed' ? 'bg-green-100 text-green-700' : 
                            fileStatus.status === 'error' ? 'bg-red-100 text-red-700' : 
                            fileStatus.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                          }
                        `}>
                          {getStatusText(fileStatus.status)}
                        </span>
                        {fileStatus.status === 'processing' && (
                          <span className="text-xs text-slate-500">{fileStatus.progress}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {fileStatus.status === 'processing' && (
                  <div className="space-y-2">
                    <Progress value={fileStatus.progress} className="h-2" />
                    <p className="text-xs text-slate-500 text-center">Processing document...</p>
                  </div>
                )}

                {fileStatus.status === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {fileStatus.error}
                    </p>
                  </div>
                )}

                {fileStatus.status === 'completed' && fileStatus.result && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckSquare className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Successfully processed: {fileStatus.result.operator} - {fileStatus.result.entity}
                      </span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      {fileStatus.result.wells.length} well{fileStatus.result.wells.length !== 1 ? 's' : ''} extracted
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Processed Orders */}
      {processedOrders.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
              Processed Orders ({processedOrders.length})
            </h3>
          </div>
          <div className="grid gap-6">
            {processedOrders.map((order, index) => (
              <div key={order.id} className="bg-gradient-to-br from-slate-50 to-green-50 rounded-xl border border-slate-200">
                <DivisionOrderPreview
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 