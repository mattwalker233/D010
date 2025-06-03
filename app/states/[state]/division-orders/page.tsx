'use client';

import { useState } from 'react';
import { DivisionOrderUploader } from '@/app/components/DivisionOrderUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { stateData } from '@/lib/state-data';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { DivisionOrder } from '@/lib/types';

export default function StateDivisionOrders() {
  const params = useParams();
  const stateCode = typeof params.state === 'string' ? params.state.toUpperCase() : '';
  const state = stateData.find(s => s.code.toLowerCase() === stateCode.toLowerCase());
  const [uploadedOrder, setUploadedOrder] = useState<DivisionOrder | null>(null);

  if (!state) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">State Not Found</h1>
        <p>The requested state could not be found.</p>
        <Button asChild className="mt-4">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  const handleUploadComplete = (order: DivisionOrder) => {
    setUploadedOrder(order);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
          Home
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">{state.name} Division Orders</span>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-primary">{state.code}</span>
              </div>
              {state.name} Division Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">State-Specific Requirements</h3>
              <p className="text-muted-foreground">{state.description}</p>
            </div>
            
            <div className="border-t pt-8">
              <div className="grid gap-4">
                <DivisionOrderUploader 
                  stateCode={state.code}
                  onUploadComplete={handleUploadComplete}
                />
                {uploadedOrder && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Uploaded Division Order</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold">Common Properties</h3>
                          <p>Operator: {uploadedOrder.operator}</p>
                          <p>Entity: {uploadedOrder.entity}</p>
                          <p>County: {uploadedOrder.county}</p>
                          <p>Effective Date: {uploadedOrder.effectiveDate}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Wells</h3>
                          <div className="grid gap-4">
                            {uploadedOrder.wells.map((well, index) => (
                              <div key={index} className="border p-3 rounded">
                                <p>Well Name: {well.wellName}</p>
                                <p>Property Description: {well.propertyDescription}</p>
                                {well.decimalInterest && (
                                  <p>Decimal Interest: {well.decimalInterest}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 