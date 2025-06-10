'use client';

import { useState, useEffect } from 'react';
import { Entity } from '@/lib/db/schema';

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } finally {
        setLoading(false);
      }
    }

    fetchEntities();
  }, []);

  // Delete entity
  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this entity?')) return;

    try {
      const response = await fetch(`/api/entities?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete entity');

      setEntities(entities.filter(entity => entity.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete entity');
    }
  }

  if (loading) return <div className="p-4">Loading entities...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Saved Entities</h1>
      
      {entities.length === 0 ? (
        <p className="text-gray-500">No entities saved yet.</p>
      ) : (
        <div className="grid gap-4">
          {entities.map((entity) => (
            <div
              key={entity.id}
              className="bg-white p-4 rounded-lg shadow border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{entity.name}</h2>
                  <p className="text-gray-600">Tax ID: {entity.taxId}</p>
                  {entity.phone && (
                    <p className="text-gray-600">Phone: {entity.phone}</p>
                  )}
                  {entity.email && (
                    <p className="text-gray-600">Email: {entity.email}</p>
                  )}
                  {entity.address && (
                    <p className="text-gray-600">Address: {entity.address}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(entity.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 