'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUpload, FiFile, FiCheck, FiX, FiEdit2, FiSave, FiDatabase, FiPlay, FiInfo } from 'react-icons/fi';

interface Well {
  propertyName: string;
  propertyDescription: string;
  decimalInterest: string;
  county: string;
}

interface DivisionOrder {
  id?: string;
  operator: string;
  entity: string;
  state: string;
  effectiveDate: string;
  wells: Well[];
  originalPdfPath?: string;
}

export default function Home() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<DivisionOrder[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResults, setEditedResults] = useState<DivisionOrder[]>([]);
  const [deploySuccess, setDeploySuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      // Add new files to selected files, avoiding duplicates
      const newFiles = acceptedFiles.filter(newFile => 
        !selectedFiles.some(existingFile => 
          newFile.name === existingFile.name && newFile.size === existingFile.size
        )
      );
      
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setError(null);
    }
  }, [selectedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const handleProcessFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsLoading(true);
    setError(null);

    const results: DivisionOrder[] = [];

    try {
      console.log(`=== Processing ${selectedFiles.length} files ===`);
      
      // Create FormData with all files
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

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

      // Process results from multiple upload
      responseData.results.forEach((result: any, index: number) => {
        if (result.success && result.data) {
          // Create the order object
          const order: DivisionOrder = {
            ...result.data,
            id: `result-${Date.now()}-${index}`,
            originalPdfPath: result.original_pdf_path
          };
          results.push(order);
        }
      });

    } catch (err) {
      console.error('Error processing files:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process files';
      setError(`Error processing files: ${errorMessage}`);
    }

    if (results.length > 0) {
      setResults(results);
      setEditedResults(results.map((result: DivisionOrder) => ({
        ...result,
        wells: result.wells.map((well: Well) => ({ ...well }))
      })));
    }
    
    setIsLoading(false);
  };

  const handleEdit = () => {
    if (results.length > 0) {
      setEditedResults(results.map((result: DivisionOrder) => ({
        ...result,
        wells: result.wells.map((well: Well) => ({ ...well }))
      })));
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editedResults.length > 0) {
      setResults(editedResults);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (results.length > 0) {
      setEditedResults(results.map((result: DivisionOrder) => ({
        ...result,
        wells: result.wells.map((well: Well) => ({ ...well }))
      })));
    }
    setIsEditing(false);
  };

  const handleFieldChange = (resultIndex: number, section: 'divisionOrder' | 'wells', field: string, value: string, wellIndex?: number) => {
    if (!editedResults[resultIndex]) return;

    const updatedResults = [...editedResults];
    
    if (section === 'divisionOrder') {
      updatedResults[resultIndex] = {
        ...updatedResults[resultIndex],
        [field]: value
      };
    } else if (section === 'wells' && wellIndex !== undefined) {
      const updatedWells = [...updatedResults[resultIndex].wells];
      updatedWells[wellIndex] = {
        ...updatedWells[wellIndex],
        [field]: value
      };
      updatedResults[resultIndex] = {
        ...updatedResults[resultIndex],
        wells: updatedWells
      };
    }
    
    setEditedResults(updatedResults);
  };

  const handleDeploy = async () => {
    if (editedResults.length === 0) return;
    
    setIsDeploying(true);
    setError(null);
    setDeploySuccess(false);

    try {
      console.log('Starting deployment with data:', editedResults);
      console.log('Sample result with PDF path:', editedResults.find(r => r.originalPdfPath));
      
      // Flatten all wells from all results for dashboard format
      const dashboardData = editedResults.flatMap(result => 
        result.wells.map(well => ({
          propertyName: well.propertyName || '',
          operator: result.operator || '',
          entity: result.entity || '',
          propertyDescription: well.propertyDescription || '',
          decimalInterest: well.decimalInterest || '',
          county: well.county || '',
          state: result.state || '',
          effectiveDate: result.effectiveDate || '',
          status: '',
          notes: '',
          originalPdfPath: result.originalPdfPath || null
        }))
      );

      console.log('Prepared dashboard data:', dashboardData);
      console.log('Sample record with PDF path:', dashboardData.find(record => record.originalPdfPath));
      console.log('Records with PDF paths:', dashboardData.filter(record => record.originalPdfPath).length);
      console.log('Full dashboard data being sent:', JSON.stringify(dashboardData, null, 2));

      const requestBody = JSON.stringify({ 
        records: dashboardData,
        replace: true  // Replace all existing records with new ones
      });
      console.log('Request body:', requestBody);
              console.log('Making request to:', `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/deploy`);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/deploy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: requestBody,
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
          throw new Error(data.error || `Failed to deploy to dashboard: ${response.status} ${response.statusText}`);
        }

        setDeploySuccess(true);
        setError(null);
        
        // Redirect immediately to dashboard
        router.push('/dashboard');
        
      } catch (fetchError: unknown) {
        console.error('Fetch error details:', {
          name: fetchError instanceof Error ? fetchError.name : 'Unknown',
          message: fetchError instanceof Error ? fetchError.message : String(fetchError),
          stack: fetchError instanceof Error ? fetchError.stack : undefined
        });
        
        if (fetchError instanceof TypeError && fetchError.message === 'Failed to fetch') {
          throw new Error(`Unable to connect to the server. Please make sure the backend server is running at ${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'} and CORS is properly configured.`);
        }
        throw fetchError;
      }
    } catch (err) {
      console.error('Deployment error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during deployment');
      setDeploySuccess(false);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setResults([]);
    setEditedResults([]);
    setError(null);
    setDeploySuccess(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
            Division Order Processor
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload and process division order PDFs with AI-powered extraction. Review, edit, and deploy to your dashboard seamlessly.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/dashboard"
            className="flex items-center justify-center px-6 py-3 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl border border-slate-200"
          >
            <FiDatabase className="mr-2" />
            View Dashboard
          </Link>
        </div>

        {/* Main Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Upload Division Orders
            </h2>
            <p className="text-slate-600">
              Process single or multiple PDF files with efficient batch processing. Perfect for both individual files and bulk operations.
            </p>
          </div>

          {/* Enhanced Drop Zone */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer
              transition-all duration-300
              ${isDragActive 
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 scale-105 shadow-lg' 
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
                <FiUpload className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <div className="text-xl font-semibold text-slate-700">
                  {isDragActive ? "Drop your PDFs here" : "Drag & drop PDF files here"}
                </div>
                <p className="text-slate-500">
                  or click to browse and select files
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mt-3">
                  <FiInfo className="h-4 w-4" />
                  <span>Supports single or multiple files with efficient batch processing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Files Section */}
          {selectedFiles.length > 0 && (
            <div className="mt-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiFile className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Selected Files ({selectedFiles.length})
                  </h3>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleProcessFiles}
                    disabled={isLoading || selectedFiles.length === 0}
                    className={`
                      flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg
                      ${!selectedFiles.length || isLoading
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5'
                      }
                    `}
                  >
                    <FiPlay className="mr-2" />
                    {isLoading ? 'Processing...' : 'Process Files'}
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={isLoading}
                    className="flex items-center px-4 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all duration-200"
                  >
                    <FiX className="mr-2" />
                    Clear
                  </button>
                </div>
              </div>

              {/* File List */}
              <div className="grid gap-3">
                {selectedFiles.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FiFile className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{file.name}</p>
                        <p className="text-sm text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      disabled={isLoading}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 flex items-center shadow-lg">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <FiX className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium">Processing Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Processed Orders ({results.length})
                  </h2>
                  <p className="text-slate-600">Review and edit the extracted information before deployment</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <FiSave className="mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-200"
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEdit}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <FiEdit2 className="mr-2" />
                      Edit Orders
                    </button>
                    <button
                      onClick={handleDeploy}
                      disabled={isEditing || isDeploying}
                      className={`
                        flex items-center px-6 py-3 rounded-xl transition-all duration-200 shadow-lg
                        ${isEditing || isDeploying
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:-translate-y-0.5'
                        }
                      `}
                    >
                      <FiDatabase className="mr-2" />
                      {isDeploying ? 'Deploying...' : 'Deploy to Dashboard'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Orders Display */}
            <div className="space-y-8">
              {(isEditing ? editedResults : results).map((result, resultIndex) => (
                <div key={result.id || resultIndex} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{resultIndex + 1}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800">
                      {result.operator} - {result.entity}
                    </h3>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Division Order Details */}
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="bg-white rounded-xl p-5 border border-slate-200">
                        <h4 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Division Order Details
                        </h4>
                        <div className="space-y-4">
                          {isEditing ? (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Operator</label>
                                <input
                                  type="text"
                                  value={editedResults[resultIndex]?.operator || ''}
                                  onChange={(e) => handleFieldChange(resultIndex, 'divisionOrder', 'operator', e.target.value)}
                                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Entity</label>
                                <input
                                  type="text"
                                  value={editedResults[resultIndex]?.entity || ''}
                                  onChange={(e) => handleFieldChange(resultIndex, 'divisionOrder', 'entity', e.target.value)}
                                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                                <input
                                  type="text"
                                  value={editedResults[resultIndex]?.state || ''}
                                  onChange={(e) => handleFieldChange(resultIndex, 'divisionOrder', 'state', e.target.value)}
                                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Effective Date</label>
                                <input
                                  type="text"
                                  value={editedResults[resultIndex]?.effectiveDate || ''}
                                  onChange={(e) => handleFieldChange(resultIndex, 'divisionOrder', 'effectiveDate', e.target.value)}
                                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                />
                              </div>
                            </>
                          ) : (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-sm text-slate-500">Operator</p>
                                <p className="font-medium text-slate-800">{result.operator}</p>
                              </div>
                              <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-sm text-slate-500">Entity</p>
                                <p className="font-medium text-slate-800">{result.entity}</p>
                              </div>
                              <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-sm text-slate-500">State</p>
                                <p className="font-medium text-slate-800">{result.state}</p>
                              </div>
                              <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-sm text-slate-500">Effective Date</p>
                                <p className="font-medium text-slate-800">{result.effectiveDate}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Wells Section */}
                      <div className="bg-white rounded-xl p-5 border border-slate-200">
                        <h4 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Wells ({result.wells.length})
                        </h4>
                        <div className="space-y-4 max-h-80 overflow-y-auto">
                          {(isEditing ? editedResults[resultIndex]?.wells : result.wells)?.map((well, wellIndex) => (
                            <div key={wellIndex} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                              <div className="grid grid-cols-1 gap-4">
                                {isEditing ? (
                                  <>
                                    <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-2">Property Name</label>
                                      <input
                                        type="text"
                                        value={editedResults[resultIndex]?.wells[wellIndex]?.propertyName || ''}
                                        onChange={(e) => handleFieldChange(resultIndex, 'wells', 'propertyName', e.target.value, wellIndex)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-2">Property Description</label>
                                      <input
                                        type="text"
                                        value={editedResults[resultIndex]?.wells[wellIndex]?.propertyDescription || ''}
                                        onChange={(e) => handleFieldChange(resultIndex, 'wells', 'propertyDescription', e.target.value, wellIndex)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Decimal Interest</label>
                                        <input
                                          type="text"
                                          value={editedResults[resultIndex]?.wells[wellIndex]?.decimalInterest || ''}
                                          onChange={(e) => handleFieldChange(resultIndex, 'wells', 'decimalInterest', e.target.value, wellIndex)}
                                          className="w-full px-3 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">County</label>
                                        <input
                                          type="text"
                                          value={editedResults[resultIndex]?.wells[wellIndex]?.county || ''}
                                          onChange={(e) => handleFieldChange(resultIndex, 'wells', 'county', e.target.value, wellIndex)}
                                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        />
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-slate-500">Property Name</p>
                                      <p className="font-medium text-slate-800">{well.propertyName}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-slate-500">Property Description</p>
                                      <p className="font-medium text-slate-800">{well.propertyDescription}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-slate-500">Decimal Interest</p>
                                      <p className="font-medium text-slate-800">{well.decimalInterest}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-slate-500">County</p>
                                      <p className="font-medium text-slate-800">{well.county}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
