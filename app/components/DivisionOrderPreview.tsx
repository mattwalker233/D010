'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { DivisionOrder } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

interface DivisionOrderPreviewProps {
  order: DivisionOrder;
  onUpdate: (order: DivisionOrder) => void;
}

export function DivisionOrderPreview({ order, onUpdate }: DivisionOrderPreviewProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState(order);

  const handleInputChange = (field: keyof DivisionOrder, value: string) => {
    setEditedOrder(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWellChange = (wellIndex: number, field: string, value: string) => {
    setEditedOrder(prev => ({
      ...prev,
      wells: prev.wells.map((well, index) => 
        index === wellIndex 
          ? { ...well, [field]: field === 'decimalInterest' ? parseFloat(value) || 0 : value }
          : well
      )
    }));
  };

  const handleSave = () => {
    onUpdate(editedOrder);
    setIsEditing(false);
  };

  const handleDeploy = async () => {
    try {
      const response = await fetch('/api/division-orders/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedOrder),
      });

      if (!response.ok) {
        throw new Error('Failed to deploy division order');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error deploying division order:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Division Order Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Operator</Label>
            <Input
              value={editedOrder.operator}
              onChange={(e) => handleInputChange('operator', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label>Entity</Label>
            <Input
              value={editedOrder.entity}
              onChange={(e) => handleInputChange('entity', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label>County</Label>
            <Input
              value={editedOrder.county}
              onChange={(e) => handleInputChange('county', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label>Effective Date</Label>
            <Input
              type="date"
              value={editedOrder.effectiveDate.split('T')[0]}
              onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Wells</Label>
          {editedOrder.wells.map((well, index) => (
            <Card key={index}>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Well Name</Label>
                    <Input
                      value={well.wellName}
                      onChange={(e) => handleWellChange(index, 'wellName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Property Description</Label>
                    <Input
                      value={well.propertyDescription}
                      onChange={(e) => handleWellChange(index, 'propertyDescription', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Decimal Interest</Label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={well.decimalInterest}
                      onChange={(e) => handleWellChange(index, 'decimalInterest', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => setIsEditing(false)}
          className={isEditing ? 'visible' : 'hidden'}
        >
          Cancel
        </Button>
        <Button
          variant="default"
          onClick={handleDeploy}
          className="bg-green-600 hover:bg-green-700"
          disabled={isEditing}
        >
          Deploy to Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
} 