'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import { FiUpload, FiFile, FiCheck, FiX, FiEdit2, FiSave, FiDatabase } from 'react-icons/fi';

interface Well {
  propertyName: string;
  propertyDescription: string;
  decimalInterest: string;
}

interface DivisionOrder {
  operator: string;
  entity: string;
  state: string;
  county: string;
  effectiveDate: string;
  wells: Well[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DivisionOrder | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResult, setEditedResult] = useState<DivisionOrder | null>(null);
  const [deploySuccess, setDeploySuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const handleSubmit = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const data = await response.json();
      const parsedResult = JSON.parse(data.result);
      setResult(parsedResult);
      setEditedResult(parsedResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Here we'll add the API call to save the edited data
    setIsEditing(false);
    setResult(editedResult);
    // TODO: Add API call to save to dashboard
  };

  const handleFieldChange = (section: 'divisionOrder' | 'wells', field: string, value: string, wellIndex?: number) => {
    if (!editedResult) return;

    if (section === 'divisionOrder') {
      setEditedResult({
        ...editedResult,
        [field]: value
      });
    } else if (section === 'wells' && wellIndex !== undefined) {
      const updatedWells = [...editedResult.wells];
      updatedWells[wellIndex] = {
        ...updatedWells[wellIndex],
        [field]: value
      };
      setEditedResult({
        ...editedResult,
        wells: updatedWells
      });
    }
  };

  const handleDeploy = async () => {
    if (!editedResult) return;
    
    setIsDeploying(true);
    setError(null);
    setDeploySuccess(false);

    try {
      console.log('Starting deployment with data:', editedResult);
      
      // Flatten the wells data for dashboard format
      const dashboardData = editedResult.wells.map(well => ({
        propertyName: well.propertyName || '',
        operator: editedResult.operator || '',
        entity: editedResult.entity || '',
        propertyDescription: well.propertyDescription || '',
        decimalInterest: well.decimalInterest || '',
        county: editedResult.county || '',
        state: editedResult.state || '',
        effectiveDate: editedResult.effectiveDate || '',
        status: '',  // Empty for now
        notes: ''    // Empty for now
      }));

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Division Order Processor
          </h1>
          <Link
            href="/dashboard"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FiDatabase className="mr-2" />
            View Dashboard
          </Link>
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
                ? "Drop the PDF here"
                : "Drag and drop a PDF file here, or click to select"}
            </p>
          </div>

          {file && (
            <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                <FiFile className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{file.name}</span>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!file || isLoading}
            className={`mt-4 w-full py-2 px-4 rounded-lg text-white font-medium
              ${!file || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Process PDF'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 flex items-center">
            <FiX className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Division Order Details</h2>
              <div className="flex items-center space-x-4">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <FiEdit2 className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="flex items-center text-green-600 hover:text-green-700"
                  >
                    <FiSave className="h-4 w-4 mr-1" />
                    Save
                  </button>
                )}
                <button
                  onClick={handleDeploy}
                  disabled={isDeploying || isEditing}
                  className={`flex items-center px-4 py-2 rounded-lg text-white font-medium
                    ${isDeploying || isEditing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                  {isDeploying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deploying...
                    </>
                  ) : (
                    <>
                      <FiUpload className="h-4 w-4 mr-1" />
                      Deploy to Dashboard
                    </>
                  )}
                </button>
              </div>
            </div>

            {deploySuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                <FiCheck className="h-5 w-5 mr-2" />
                Successfully deployed to dashboard!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Operator</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedResult?.operator || ''}
                      onChange={(e) => handleFieldChange('divisionOrder', 'operator', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{result.operator || 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Entity</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedResult?.entity || ''}
                      onChange={(e) => handleFieldChange('divisionOrder', 'entity', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{result.entity || 'Not specified'}</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500">State</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedResult?.state || ''}
                          onChange={(e) => handleFieldChange('divisionOrder', 'state', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{result.state || 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">County</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedResult?.county || ''}
                          onChange={(e) => handleFieldChange('divisionOrder', 'county', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{result.county || 'Not specified'}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Effective Date</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedResult?.effectiveDate || ''}
                      onChange={(e) => handleFieldChange('divisionOrder', 'effectiveDate', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{result.effectiveDate || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Wells Information</h3>
              <div className="space-y-4">
                {result.wells.map((well, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Property Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedResult?.wells[index]?.propertyName || ''}
                            onChange={(e) => handleFieldChange('wells', 'propertyName', e.target.value, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{well.propertyName || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Property Description</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedResult?.wells[index]?.propertyDescription || ''}
                            onChange={(e) => handleFieldChange('wells', 'propertyDescription', e.target.value, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{well.propertyDescription || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Decimal Interest</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedResult?.wells[index]?.decimalInterest || ''}
                            onChange={(e) => handleFieldChange('wells', 'decimalInterest', e.target.value, index)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{well.decimalInterest || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
