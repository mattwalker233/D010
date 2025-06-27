'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUpload, FiFile, FiCheck, FiX, FiEdit2, FiSave, FiDatabase, FiPlay } from 'react-icons/fi';

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
          existingFile.name === newFile.name && existingFile.size === newFile.size
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

    // Process files sequentially using the original successful method
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      try {
        console.log(`Processing file ${i + 1}/${selectedFiles.length}: ${file.name}`);
        
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:8000/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to process ${file.name}`);
        }

        const data = await response.json();
        
        if (!data.success || !data.data) {
          throw new Error(`No data extracted from ${file.name}`);
        }

        // Create the order object
        const order: DivisionOrder = {
          ...data.data,
          id: `result-${Date.now()}-${i}`
        };

        results.push(order);
        console.log(`Successfully processed ${file.name}`);

      } catch (err) {
        console.error(`Error processing ${file.name}:`, err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
        setError(`Error processing ${file.name}: ${errorMessage}`);
        // Continue processing other files even if one fails
      }
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
          notes: ''
        }))
      );

      console.log('Prepared dashboard data:', dashboardData);

      const requestBody = JSON.stringify({ records: dashboardData });
      console.log('Request body:', requestBody);
      console.log('Making request to:', 'http://localhost:8000/api/deploy');

      try {
        const response = await fetch('http://localhost:8000/api/deploy', {
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
          throw new Error('Unable to connect to the server. Please make sure the backend server is running at http://localhost:8000 and CORS is properly configured.');
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Division Order Processor
          </h1>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <FiDatabase className="mr-2" />
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
          >
            <input {...getInputProps()} />
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
                ? "Drop PDF files here"
                : "Drag and drop PDF files here, or click to select"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Supports single or multiple files
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Selected Files ({selectedFiles.length})</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleProcessFiles}
                    disabled={isLoading || selectedFiles.length === 0}
                    className={`flex items-center px-4 py-2 rounded-lg text-white font-medium
                      ${!selectedFiles.length || isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                  >
                    <FiPlay className="mr-2" />
                    {isLoading ? 'Processing...' : 'Process All Files'}
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <FiX className="mr-2" />
                    Clear All
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <FiFile className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      disabled={isLoading}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 flex items-center">
            <FiX className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Processed Orders ({results.length})
              </h2>
              <div className="flex gap-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <FiSave className="mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEdit}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <FiEdit2 className="mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={handleDeploy}
                      disabled={isEditing || isDeploying}
                      className={`flex items-center px-4 py-2 rounded-lg ${
                        isEditing || isDeploying
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white`}
                    >
                      <FiDatabase className="mr-2" />
                      {isDeploying ? 'Deploying...' : 'Deploy to Dashboard'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {(isEditing ? editedResults : results).map((result, resultIndex) => (
                <div key={result.id || resultIndex} className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Order {resultIndex + 1}: {result.operator} - {result.entity}
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-md font-semibold text-gray-700 mb-2">Division Order Details</h4>
                        <div className="space-y-2">
                          {isEditing ? (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Operator</label>
                                <input
                                  type="text"
                                  value={editedResults[resultIndex]?.operator || ''}
                                  onChange={(e) => handleFieldChange(resultIndex, 'divisionOrder', 'operator', e.target.value)}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Entity</label>
                                <input
                                  type="text"
                                  value={editedResults[resultIndex]?.entity || ''}
                                  onChange={(e) => handleFieldChange(resultIndex, 'divisionOrder', 'entity', e.target.value)}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">State</label>
                                <input
                                  type="text"
                                  value={editedResults[resultIndex]?.state || ''}
                                  onChange={(e) => handleFieldChange(resultIndex, 'divisionOrder', 'state', e.target.value)}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Effective Date</label>
                                <input
                                  type="text"
                                  value={editedResults[resultIndex]?.effectiveDate || ''}
                                  onChange={(e) => handleFieldChange(resultIndex, 'divisionOrder', 'effectiveDate', e.target.value)}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <p><span className="font-medium">Operator:</span> {result.operator}</p>
                              <p><span className="font-medium">Entity:</span> {result.entity}</p>
                              <p><span className="font-medium">State:</span> {result.state}</p>
                              <p><span className="font-medium">Effective Date:</span> {result.effectiveDate}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-semibold text-gray-700 mb-4">Wells ({result.wells.length})</h4>
                      <div className="space-y-4">
                        {(isEditing ? editedResults[resultIndex]?.wells : result.wells)?.map((well, wellIndex) => (
                          <div key={wellIndex} className="border rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                {isEditing ? (
                                  <>
                                    <div className="mb-2">
                                      <label className="block text-sm font-medium text-gray-700">Property Name</label>
                                      <input
                                        type="text"
                                        value={editedResults[resultIndex]?.wells[wellIndex]?.propertyName || ''}
                                        onChange={(e) => handleFieldChange(resultIndex, 'wells', 'propertyName', e.target.value, wellIndex)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700">Property Description</label>
                                      <input
                                        type="text"
                                        value={editedResults[resultIndex]?.wells[wellIndex]?.propertyDescription || ''}
                                        onChange={(e) => handleFieldChange(resultIndex, 'wells', 'propertyDescription', e.target.value, wellIndex)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p><span className="font-medium">Property Name:</span> {well.propertyName}</p>
                                    <p><span className="font-medium">Property Description:</span> {well.propertyDescription}</p>
                                  </>
                                )}
                              </div>
                              <div>
                                {isEditing ? (
                                  <>
                                    <div className="mb-2">
                                      <label className="block text-sm font-medium text-gray-700">Decimal Interest</label>
                                      <input
                                        type="text"
                                        value={editedResults[resultIndex]?.wells[wellIndex]?.decimalInterest || ''}
                                        onChange={(e) => handleFieldChange(resultIndex, 'wells', 'decimalInterest', e.target.value, wellIndex)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700">County</label>
                                      <input
                                        type="text"
                                        value={editedResults[resultIndex]?.wells[wellIndex]?.county || ''}
                                        onChange={(e) => handleFieldChange(resultIndex, 'wells', 'county', e.target.value, wellIndex)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p><span className="font-medium">Decimal Interest:</span> {well.decimalInterest}</p>
                                    <p><span className="font-medium">County:</span> {well.county}</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
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
