'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const MAX_ENTITIES = 30;

interface Entity {
  id: string;
  entity_name: string;
  sticker_info: string;
  signature: string;
}

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntity, setNewEntity] = useState({
    entity_name: '',
    sticker_info: '',
    signature: ''
  });

  useEffect(() => {
    fetchEntities();
  }, []);

  async function fetchEntities() {
    try {
      const response = await fetch('/api/entities');
      if (!response.ok) {
        throw new Error('Failed to fetch entities');
      }
      const data = await response.json();
      setEntities(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching entities:', error);
      setLoading(false);
    }
  }

  // Handle form input changes
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setNewEntity(prev => ({ ...prev, [name]: value }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEntity(prev => ({
          ...prev,
          signature: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleAddEntity(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('/api/entities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntity),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add entity');
      }

      setNewEntity({
        entity_name: '',
        sticker_info: '',
        signature: ''
      });
      setShowAddForm(false);
      setError(null); // Clear any previous errors
      fetchEntities();
    } catch (error) {
      console.error('Error adding entity:', error);
      setError(error instanceof Error ? error.message : 'Failed to add entity');
    }
  }

  async function handleDeleteEntity(id: string) {
    try {
      const response = await fetch(`/api/entities?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entity');
      }

      fetchEntities();
    } catch (error) {
      console.error('Error deleting entity:', error);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Entities</h1>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setError(null); // Clear any previous errors
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showAddForm ? 'Cancel' : 'Add New Entity'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Entity</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <form onSubmit={handleAddEntity} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Entity Name</label>
              <input
                type="text"
                value={newEntity.entity_name}
                onChange={(e) => setNewEntity({ ...newEntity, entity_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sticker Info</label>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-2">
                <p className="text-sm text-yellow-800 mb-1">
                  <strong>Note:</strong> This information will be placed as a sticker next to the signature on PDFs.
                </p>
                <p className="text-xs text-yellow-700">
                  Paste any information you want to appear on the sticker (e.g., notes, references, dates, etc.)
                </p>
              </div>
              <textarea
                value={newEntity.sticker_info}
                onChange={(e) => setNewEntity({ ...newEntity, sticker_info: e.target.value })}
                placeholder="Paste or type information to be included on the sticker..."
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Signature</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
              {newEntity.signature && (
                <img src={newEntity.signature} alt="Signature Preview" className="mt-2 h-12" />
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Entity
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entities.map((entity) => (
            <div key={entity.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">{entity.entity_name}</h3>
              {entity.sticker_info && (
                <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm font-medium text-yellow-800 mb-1">Sticker Info:</p>
                  <p className="text-sm text-yellow-700">{entity.sticker_info}</p>
                </div>
              )}
              {entity.signature && (
                <div className="mb-2">
                  <p className="text-gray-600 mb-1">Signature:</p>
                  <img src={entity.signature} alt="Signature" className="h-12" />
                </div>
              )}
              <button
                onClick={() => handleDeleteEntity(entity.id)}
                className="mt-4 text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 