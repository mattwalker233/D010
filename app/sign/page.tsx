'use client';

import { useState, useEffect, Fragment, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

interface Entity {
  id: string;
  entity_name: string;
  signature: string;
  sticker_info: string;
}

interface SignaturePosition {
  x: number;
  y: number;
  page: number;
}

function SignPageContent() {
  const [file, setFile] = useState<File | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [signaturePositions, setSignaturePositions] = useState<SignaturePosition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [placeStickerOnEveryPage, setPlaceStickerOnEveryPage] = useState(false);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270 degrees
  const [rotatedFile, setRotatedFile] = useState<File | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [pdfDimensions, setPdfDimensions] = useState<{width: number, height: number} | null>(null);

  const searchParams = useSearchParams();

  // Load PDF from URL parameter if provided
  useEffect(() => {
    const pdfParam = searchParams.get('pdf');
    if (pdfParam) {
      loadPdfFromBackend(pdfParam);
    }
  }, [searchParams]);

  const loadPdfFromBackend = async (filename: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading PDF from backend:', filename);
      
      // Fetch the PDF from the backend
      const response = await fetch(`http://localhost:8000/api/pdf/${encodeURIComponent(filename)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`PDF file "${filename}" not found. This record may not have an associated PDF file.`);
        } else {
          throw new Error(`Failed to load PDF: ${response.status} ${response.statusText}`);
        }
      }
      
      // Convert the response to a blob
      const blob = await response.blob();
      
      // Create a File object from the blob
      const pdfFile = new File([blob], filename, { type: 'application/pdf' });
      
      // Set the file and create a preview URL
      setFile(pdfFile);
      setShowPreview(true);
      setSignaturePositions([]);
      setCurrentPage(1);
      setRotation(0);
      
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      
      console.log('PDF loaded successfully from backend');
      
    } catch (err) {
      console.error('Error loading PDF from backend:', err);
      setError(err instanceof Error ? err.message : 'Failed to load PDF from backend');
      // Clear any existing file state
      setFile(null);
      setPdfUrl(null);
      setShowPreview(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch entities
  useEffect(() => {
    async function fetchEntities() {
      try {
        const response = await fetch('/api/entities');
        if (!response.ok) throw new Error('Failed to fetch entities');
        const data = await response.json();
        setEntities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load entities');
      }
    }

    fetchEntities();
  }, []);

  // Filter entities based on search query
  const filteredEntities = query === ''
    ? entities
    : entities.filter((entity) => {
        const searchString = entity.entity_name.toLowerCase();
        return searchString.includes(query.toLowerCase());
      });

  // Handle PDF preview
  const handleFileSelect = async (selectedFile: File | null) => {
    setFile(selectedFile);
    setPdfError(null);
    if (selectedFile) {
      setShowPreview(true);
      setSignaturePositions([]);
      setCurrentPage(1);
      setRotation(0); // Reset rotation for new file
      // Create a Blob URL for the PDF file
      const url = URL.createObjectURL(selectedFile);
      setPdfUrl(url);
    } else {
      setPdfUrl(null);
    }
  };

  // Handle PDF load
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setTotalPages(numPages);
  };

  // Handle page load to get dimensions
  const onPageLoadSuccess = (page: any) => {
    const { width, height } = page;
    setPdfDimensions({ width, height });
    console.log(`PDF dimensions from page: ${width}x${height}`);
  };

  // Handle page click for signature placement
  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>, pageNumber: number) => {
    // Only allow signature placement if we have a rotated file (upright PDF)
    if (!rotatedFile) {
      setError('Please rotate and save the PDF first before placing signatures');
      return;
    }

    // Get the page element (the actual PDF page)
    const pageElement = e.currentTarget;
    const pageRect = pageElement.getBoundingClientRect();
    
    // Calculate position relative to the page element
    const x = e.clientX - pageRect.left;
    const y = e.clientY - pageRect.top;
    
    // Calculate relative position within the page (0-1 range)
    const relativeX = x / pageRect.width;
    const relativeY = y / pageRect.height;

    // Convert to PDF coordinates for the upright PDF
    // Since the rotated PDF is now upright, we use standard coordinates
    const pdfWidth = pdfDimensions?.width || 612;
    const pdfHeight = pdfDimensions?.height || 792;
    
    // Calculate coordinates for the upright PDF
    // For the rotated PDF, coordinates are now standard (0,0 at bottom-left)
    const pdfX = relativeX * pdfWidth;
    const pdfY = (1 - relativeY) * pdfHeight;

    console.log(`Page rect: ${pageRect.width}x${pageRect.height}`);
    console.log(`PDF dimensions: ${pdfWidth}x${pdfHeight}`);
    console.log(`Click at (${x}, ${y}) -> relative (${relativeX.toFixed(3)}, ${relativeY.toFixed(3)}) -> PDF (${pdfX.toFixed(1)}, ${pdfY.toFixed(1)})`);
    console.log(`PDF coordinate system: (0,0) at bottom-left, (${pdfWidth}, ${pdfHeight}) at top-right`);

    // Add signature position
    const newPosition: SignaturePosition = {
      x: pdfX,
      y: pdfY,
      page: pageNumber
    };

    console.log(`Adding signature position:`, newPosition);
    setSignaturePositions(prev => {
      const newPositions = [...prev, newPosition];
      console.log(`Updated signature positions:`, newPositions);
      return newPositions;
    });
    setError(null); // Clear any previous error
  };

  // Clean up Blob URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // PDF load error handler
  const onDocumentLoadError = (error: any) => {
    setPdfError(error?.message || 'Failed to load PDF file.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine which file to use
    const fileToSign = rotatedFile || file;
    if (!fileToSign) {
      setError('Please select a file');
      return;
    }
    
    if (!selectedEntity) {
      setError('Please select an entity');
      return;
    }

    if (!selectedEntity.signature) {
      setError('Selected entity does not have a signature');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false); // Clear any previous success message

    try {
      const formData = new FormData();
      formData.append('file', fileToSign);
      formData.append('entityId', selectedEntity.id);
      
      // Add signature positions if any
      if (signaturePositions.length > 0) {
        console.log('Sending signature positions to backend:', signaturePositions);
        formData.append('signaturePositions', JSON.stringify(signaturePositions));
      } else {
        console.log('No signature positions to send - PDF will be signed without signatures');
      }
      
      // Add sticker placement option
      formData.append('placeStickerOnEveryPage', placeStickerOnEveryPage.toString());

      const response = await fetch('/api/sign-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to sign PDF');
      }

      // Get the signed PDF as a blob
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signed_${fileToSign.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Clear form
      setFile(null);
      setRotatedFile(null);
      setSelectedEntity(null);
      setSignaturePositions([]);
      setShowPreview(false);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign PDF');
    } finally {
      setLoading(false);
    }
  };

  // Remove signature position
  const removeSignature = (index: number) => {
    setSignaturePositions(prev => prev.filter((_, i) => i !== index));
  };

  // Handle PDF rotation and save
  const handleRotateAndSave = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    // If no rotation is needed, just save the original file
    if (rotation === 0) {
      setIsRotating(true);
      setError(null);
      
      try {
        console.log('No rotation needed, saving original PDF');
        
        // Create a new File object from the original file
        const savedPdfFile = new File([file], `saved_${file.name}`, { type: 'application/pdf' });
        setRotatedFile(savedPdfFile);
        
        // Create a new Blob URL for the PDF
        const newPdfUrl = URL.createObjectURL(file);
        setPdfUrl(newPdfUrl);
        
        // Reset signature positions since we have a new PDF
        setSignaturePositions([]);
        
        // Reset PDF dimensions since we have a new PDF
        setPdfDimensions(null);
        
        // Show success message
        setSuccess(true);
        
        console.log('Original PDF saved and ready for signing');
      } catch (err) {
        console.error('Error saving original PDF:', err);
        setError(err instanceof Error ? err.message : 'Failed to save PDF');
      } finally {
        setIsRotating(false);
      }
      return;
    }

    setIsRotating(true);
    setError(null);

    try {
      console.log(`Starting rotation process for ${rotation}° rotation`);
      console.log(`Original file: ${file.name}, size: ${file.size} bytes`);
      
      // Calculate the actual rotation needed to make the PDF upright
      // If the PDF is visually rotated X degrees to look upright, 
      // we need to apply -X degrees to make it actually upright
      const actualRotation = (360 - rotation) % 360;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('rotation', actualRotation.toString());
      
      console.log(`Visual rotation: ${rotation}°, sending actual rotation: ${actualRotation}° to backend`);

      console.log('Sending rotation request to backend...');
      const response = await fetch('/api/rotate-pdf', {
        method: 'POST',
        body: formData,
      });

      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Backend error:', errorData);
        throw new Error(errorData.error || 'Failed to rotate PDF');
      }

      // Get the rotated PDF as a blob
      const blob = await response.blob();
      console.log(`Received blob: size=${blob.size} bytes, type=${blob.type}`);
      
      if (blob.size === 0) {
        throw new Error('Received empty PDF blob from server');
      }
      
      // Create a new File object from the blob
      const rotatedPdfFile = new File([blob], `rotated_${file.name}`, { type: 'application/pdf' });
      console.log(`Created rotated file: ${rotatedPdfFile.name}, size: ${rotatedPdfFile.size} bytes`);
      
      setRotatedFile(rotatedPdfFile);
      
      // Create a new Blob URL for the rotated PDF
      const newPdfUrl = URL.createObjectURL(blob);
      setPdfUrl(newPdfUrl);
      
      // Reset signature positions since we have a new PDF
      setSignaturePositions([]);
      
      // Reset PDF dimensions since the rotated PDF might have different dimensions
      setPdfDimensions(null);
      
      // Show success message
      setSuccess(true);
      
      console.log('Rotated PDF saved and ready for signing');
    } catch (err) {
      console.error('Rotation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to rotate PDF');
    } finally {
      setIsRotating(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign Division Order</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Entity Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Entity
          </label>
          <Combobox value={selectedEntity} onChange={setSelectedEntity}>
            <div className="relative">
              <Combobox.Input
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(entity: Entity) => entity?.entity_name ?? ''}
                placeholder="Search by entity..."
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </Combobox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery('')}
              >
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredEntities.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    filteredEntities.map((entity) => (
                      <Combobox.Option
                        key={entity.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-blue-600 text-white' : 'text-gray-900'
                          }`
                        }
                        value={entity}
                      >
                        {({ selected, active }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {entity.entity_name}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-white' : 'text-blue-600'
                                }`}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Division Order
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {/* Sticker Placement Option */}
        <div>
          <div className="flex items-center">
            <input
              id="placeStickerOnEveryPage"
              type="checkbox"
              checked={placeStickerOnEveryPage}
              onChange={(e) => setPlaceStickerOnEveryPage(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="placeStickerOnEveryPage" className="ml-2 block text-sm text-gray-700">
              Place sticker on every page
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {placeStickerOnEveryPage 
              ? "Sticker will be placed on all pages of the document" 
              : "Sticker will only be placed on the first page"}
          </p>
        </div>

        {/* PDF Rotation Controls */}
        {showPreview && file && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rotate PDF
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Rotate 90° Clockwise
              </button>
              <button
                type="button"
                onClick={() => setRotation(0)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reset Rotation
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Current rotation: {rotation}° - Click "Save Rotated PDF" to apply the rotation
            </p>
            {rotation !== 0 && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                <strong>Note:</strong> PDF is rotated {rotation}°. Click "Save Rotated PDF" to apply the rotation, then place signatures on the rotated PDF.
              </div>
            )}
            
            {/* Save PDF Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleRotateAndSave}
                disabled={isRotating}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
              >
                {isRotating ? 'Saving PDF...' : rotation === 0 ? 'Save PDF' : 'Save Rotated PDF'}
              </button>
              <p className="mt-1 text-xs text-gray-500">
                {rotation === 0 
                  ? 'This will save the PDF as-is for signing'
                  : 'This will create a new rotated PDF that you can then sign'
                }
              </p>
            </div>
          </div>
        )}

        {/* PDF Preview and Signature Placement */}
        {showPreview && (file || rotatedFile) && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">
              {rotatedFile ? 'Rotated PDF - Click where you want to place signatures' : 'PDF Preview - Rotate and save first, then place signatures'}
            </h3>
            {!rotatedFile && rotation !== 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                <strong>Important:</strong> You have rotated the PDF but haven't saved it yet. Click "Save Rotated PDF" above to apply the rotation, then place your signatures on the upright PDF.
              </div>
            )}
            {!rotatedFile && rotation === 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                <strong>Tip:</strong> If your PDF is already upright, click "Save PDF" to proceed with signing. If it needs rotation, use the rotation controls above first.
              </div>
            )}
            {/* Error message for PDF loading */}
            {pdfError && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{pdfError}</div>
            )}
            {/* Signature positions list */}
            {signaturePositions.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Placed Signatures:</h4>
                <div className="space-y-1">
                  {signaturePositions.map((pos, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>Signature {index + 1} - Page {pos.page} at ({Math.round(pos.x)}, {Math.round(pos.y)})</span>
                      <button
                        type="button"
                        onClick={() => removeSignature(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* PDF Viewer */}
            <div ref={containerRef} className="border border-gray-300 rounded overflow-auto max-h-96">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                className="flex flex-col items-center"
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <div key={`page_${index + 1}`} className="relative mb-4">
                    <Page
                      pageNumber={index + 1}
                      width={600}
                      rotate={rotatedFile ? 0 : rotation}
                      className="cursor-crosshair"
                      onClick={(e) => handlePageClick(e, index + 1)}
                      onLoadSuccess={onPageLoadSuccess}
                    />
                    {/* Display placed signatures on this page */}
                    {signaturePositions
                      .filter(pos => pos.page === index + 1)
                      .map((pos, sigIndex) => {
                        const globalIndex = signaturePositions.findIndex(p => p === pos);
                        return (
                          <div
                            key={`sig_${globalIndex}`}
                            className="absolute bg-red-500 text-white text-xs px-1 py-0.5 rounded pointer-events-none"
                            style={{
                              left: `${(pos.x / (pdfDimensions?.width || 612)) * 100}%`,
                              top: `${(1 - pos.y / (pdfDimensions?.height || 792)) * 100}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          >
                            Sig {globalIndex + 1}
                          </div>
                        );
                      })}
                  </div>
                ))}
              </Document>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {signaturePositions.length} signature(s) placed
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !rotatedFile}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing PDF...' : rotatedFile ? 'Sign PDF' : 'Rotate and Save PDF First'}
        </button>
      </form>

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                {rotatedFile ? 'Rotated PDF saved successfully!' : 'PDF signed successfully!'}
              </h3>
              <p className="text-sm text-green-700 mt-1">
                {rotatedFile 
                  ? 'The rotated PDF is now ready for signing. Place signatures and click "Sign PDF".'
                  : 'The signed PDF has been downloaded.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SignPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignPageContent />
    </Suspense>
  );
} 