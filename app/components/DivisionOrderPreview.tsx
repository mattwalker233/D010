'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { DivisionOrder } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface DivisionOrderPreviewProps {
  order: DivisionOrder;
  onUpdate: (order: DivisionOrder) => void;
}

interface WellInterest {
  value: number | null;
}

interface Well {
  id?: string;
  wellName: string;
  propertyDescription: string;
  decimalInterest: number | null;
}

export function DivisionOrderPreview({ order, onUpdate }: DivisionOrderPreviewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeploying, setIsDeploying] = useState(false);
  const [editedOrder, setEditedOrder] = useState({
    ...order,
    wells: order.wells || [] // Ensure wells is always an array
  });
  const [wellInterests, setWellInterests] = useState(
    (order.wells || []).map(well => ({
      value: well.decimalInterest ?? null
    }))
  );

  const handleInputChange = (field: keyof DivisionOrder, value: string) => {
    setEditedOrder(prev => {
      const updated = { ...prev, [field]: value };
      onUpdate(updated);
      return updated;
    });
  };

  const handleWellChange = (index: number, field: keyof Well, value: string | number) => {
    const updatedWells = [...editedOrder.wells];
    if (field === 'decimalInterest') {
      const numValue = value === '' ? null : Number(value);
      updatedWells[index] = {
        ...updatedWells[index],
        decimalInterest: numValue
      };
      setWellInterests(prev => {
        const updated = [...prev];
        updated[index] = { value: numValue };
        return updated;
      });
    } else {
      updatedWells[index] = {
        ...updatedWells[index],
        [field]: value
      };
    }
    setEditedOrder(prev => ({
      ...prev,
      wells: updatedWells
    }));
  };

  const handleDeploy = async () => {
    try {
      setIsDeploying(true);

      // Validate required fields before sending
      if (!editedOrder.operator?.trim()) throw new Error("Operator is required");
      if (!editedOrder.entity?.trim()) throw new Error("Entity is required");
      if (!editedOrder.county?.trim()) throw new Error("County is required");
      if (!editedOrder.state?.trim()) throw new Error("State is required");
      if (!editedOrder.effectiveDate) throw new Error("Effective date is required");

      // Validate wells
      const wellErrors: string[] = [];
      editedOrder.wells.forEach((well, index) => {
        if (!well.wellName?.trim()) {
          wellErrors.push(`Well ${index + 1}: Property name is required`);
        }
        if (!well.propertyDescription?.trim()) {
          wellErrors.push(`Well ${index + 1}: Property description is required`);
        }
        if (well.decimalInterest !== null && (isNaN(well.decimalInterest) || well.decimalInterest < 0 || well.decimalInterest > 1)) {
          wellErrors.push(`Well ${index + 1}: Decimal interest must be between 0 and 1`);
        }
      });

      if (wellErrors.length > 0) {
        throw new Error(wellErrors.join('\n'));
      }

      // Prepare the order data
      const orderData = {
        ...editedOrder,
        wells: editedOrder.wells.map(well => ({
          wellName: well.wellName.trim(),
          propertyDescription: well.propertyDescription.trim(),
          decimalInterest: well.decimalInterest === null ? null : Number(well.decimalInterest)
        })),
        status: 'in_process',
        effectiveDate: new Date(editedOrder.effectiveDate).toISOString().split('T')[0]
      };

      // Send to API
      const response = await fetch('/api/division-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!result.success) {
        // Handle validation errors from API
        if (result.details && Array.isArray(result.details)) {
          throw new Error(result.details.join('\n'));
        }
        throw new Error(result.error || 'Failed to save division order');
      }

      toast({
        title: "Success",
        description: result.message || "Division order has been saved",
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save division order",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  // If we're deploying, show a loading state
  if (isDeploying) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">Deploying to Dashboard...</p>
            <p className="text-sm text-muted-foreground">Please wait while we process your division order.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              disabled={isDeploying}
            />
          </div>
          <div className="space-y-2">
            <Label>Entity</Label>
            <Input
              value={editedOrder.entity}
              onChange={(e) => handleInputChange('entity', e.target.value)}
              disabled={isDeploying}
            />
          </div>
          <div className="space-y-2">
            <Label>County</Label>
            <Input
              value={editedOrder.county}
              onChange={(e) => handleInputChange('county', e.target.value)}
              disabled={isDeploying}
            />
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Input
              value={editedOrder.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              disabled={isDeploying}
            />
          </div>
          <div className="space-y-2">
            <Label>Effective Date</Label>
            <Input
              type="date"
              value={editedOrder.effectiveDate.split('T')[0]}
              onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
              disabled={isDeploying}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Wells</Label>
          <div className="grid gap-4">
          {editedOrder.wells.map((well, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="grid gap-4">
                <div className="space-y-2">
                      <Label>Property Name</Label>
                  <Input
                    value={well.wellName}
                    onChange={(e) => handleWellChange(index, 'wellName', e.target.value)}
                        disabled={isDeploying}
                  />
                </div>
                <div className="space-y-2">
                      <Label>Property Description</Label>
                      <Textarea
                    value={well.propertyDescription}
                    onChange={(e) => handleWellChange(index, 'propertyDescription', e.target.value)}
                        disabled={isDeploying}
                  />
                </div>
                <div className="space-y-2">
                      <Label>Decimal Interest</Label>
                      <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.000001"
                          value={wellInterests[index].value || ''}
                    onChange={(e) => handleWellChange(index, 'decimalInterest', e.target.value)}
                          placeholder="Enter decimal interest"
                          disabled={isDeploying}
                          className="flex-1"
                  />
                </div>
              </div>
                  </div>
                </CardContent>
            </Card>
          ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="default"
          onClick={handleDeploy}
          className="bg-green-600 hover:bg-green-700"
          disabled={isDeploying}
        >
          {isDeploying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deploying...
            </>
          ) : (
            'Deploy to Dashboard'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 