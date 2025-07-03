'use client';

import { useState, useEffect, Fragment, useRef } from 'react';
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

export default function SignPage() {
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

  // Handle page click for signature placement
  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>, pageNumber: number) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Get the page element to calculate PDF coordinates
    const pageElement = e.currentTarget;
    const pageRect = pageElement.getBoundingClientRect();
    
    // Calculate relative position within the page
    const relativeX = (x - (pageRect.left - rect.left)) / pageRect.width;
    const relativeY = (y - (pageRect.top - rect.top)) / pageRect.height;

    // Convert to PDF coordinates (standard PDF size is 612x792 points)
    const pdfX = relativeX * 612;
    const pdfY = (1 - relativeY) * 792; // Flip Y coordinate (PDF origin is bottom-left)

    // Add signature position
    const newPosition: SignaturePosition = {
      x: pdfX,
      y: pdfY,
      page: pageNumber
    };

    setSignaturePositions(prev => [...prev, newPosition]);
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
    if (!file || !selectedEntity) {
      setError('Please select a file and an entity');
      return;
    }

    if (!selectedEntity.signature) {
      setError('Selected entity does not have a signature');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityId', selectedEntity.id);
      
      // Add signature positions if any
      if (signaturePositions.length > 0) {
        formData.append('signaturePositions', JSON.stringify(signaturePositions));
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
      a.download = `signed_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Clear form
      setFile(null);
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

        {/* PDF Preview and Signature Placement */}
        {showPreview && file && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Click where you want to place signatures</h3>
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
                      className="cursor-crosshair"
                      onClick={(e) => handlePageClick(e, index + 1)}
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
                              left: `${(pos.x / 612) * 100}%`,
                              top: `${(1 - pos.y / 792) * 100}%`,
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
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing PDF...' : 'Sign PDF'}
        </button>
      </form>

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">PDF signed successfully!</h3>
              <p className="text-sm text-green-700 mt-1">The signed PDF has been downloaded.</p>
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