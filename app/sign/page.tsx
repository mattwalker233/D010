'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import SignaturePad from 'react-signature-canvas';
import { Entity } from '@/lib/db/schema';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function SignPage() {
  const [file, setFile] = useState<File | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const signaturePadRef = useRef<SignaturePad>(null);

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
        const searchString = `${entity.name} ${entity.taxId} ${entity.email}`.toLowerCase();
        return searchString.includes(query.toLowerCase());
      });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedEntity) {
      setError('Please select a file and an entity');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const signature = signaturePadRef.current?.toDataURL() || '';
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityId', selectedEntity.id.toString());
      formData.append('signature', signature);
      formData.append('printedName', selectedEntity.name);
      formData.append('taxId', selectedEntity.taxId);
      formData.append('phone', selectedEntity.phone || '');
      formData.append('email', selectedEntity.email || '');
      formData.append('address', selectedEntity.address || '');

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
      signaturePadRef.current?.clear();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign PDF');
    } finally {
      setLoading(false);
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
                displayValue={(entity: Entity) => entity?.name || ''}
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
                              {entity.name}
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
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {/* Signature Pad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Signature
          </label>
          <div className="border rounded-md p-2">
            <SignaturePad
              ref={signaturePadRef}
              canvasProps={{
                className: 'w-full h-48 border rounded-md',
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => signaturePadRef.current?.clear()}
            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Clear Signature
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !file || !selectedEntity}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing...' : 'Sign PDF'}
        </button>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 text-green-700 rounded-md">
            PDF signed successfully!
          </div>
        )}
      </form>
    </div>
  );
} 