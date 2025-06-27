'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiDatabase, FiArrowLeft } from 'react-icons/fi';
import { MultiDivisionOrderUploader } from '../components/MultiDivisionOrderUploader';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { DivisionOrder } from '@/lib/types';

export default function MultiUploadPage() {
  const router = useRouter();
  const [processedOrders, setProcessedOrders] = useState<DivisionOrder[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [deploySuccess, setDeploySuccess] = useState(false);

  const handleUploadComplete = (orders: DivisionOrder[]) => {
    setProcessedOrders(orders);
  };

  const handleError = (error: string) => {
    console.error('Upload error:', error);
    // You could show a toast notification here
  };

  const handleDeployAll = async () => {
    if (processedOrders.length === 0) return;

    setIsDeploying(true);
    setDeployError(null);
    setDeploySuccess(false);

    try {
      console.log('Starting deployment of', processedOrders.length, 'orders');
      
      // Flatten all wells from all orders for dashboard format
      const dashboardData = processedOrders.flatMap(order => 
        order.wells.map(well => ({
          propertyName: well.wellName || '',
          operator: order.operator || '',
          entity: order.entity || '',
          propertyDescription: well.propertyDescription || '',
          decimalInterest: well.decimalInterest?.toString() || '',
          county: order.county || '',
          state: order.state || '',
          effectiveDate: order.effectiveDate || '',
          status: '',
          notes: ''
        }))
      );

      console.log('Prepared dashboard data:', dashboardData);

      const response = await fetch('http://localhost:8000/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ records: dashboardData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to deploy to dashboard: ${response.status} ${response.statusText}`);
      }

      setDeploySuccess(true);
      setDeployError(null);
      
      // Redirect to dashboard after successful deployment
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('Deployment error:', err);
      setDeployError(err instanceof Error ? err.message : 'An error occurred during deployment');
      setDeploySuccess(false);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Single Upload
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">
              Multi-File Division Order Processor
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FiDatabase className="mr-2" />
            View Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Upload Multiple Division Orders
            </h2>
            <p className="text-gray-600">
              Drag and drop multiple PDF files or click to select them. Each file will be processed individually 
              and you can review the results before deploying to the dashboard.
            </p>
          </div>

          <MultiDivisionOrderUploader
            onUploadComplete={handleUploadComplete}
            onError={handleError}
          />
        </div>

        {processedOrders.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Ready to Deploy ({processedOrders.length} orders)
              </h2>
              <Button
                onClick={handleDeployAll}
                disabled={isDeploying}
                className="bg-green-600 hover:bg-green-700"
              >
                {isDeploying ? 'Deploying...' : `Deploy All to Dashboard`}
              </Button>
            </div>

            {deployError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{deployError}</AlertDescription>
              </Alert>
            )}

            {deploySuccess && (
              <Alert className="mb-4">
                <AlertDescription>
                  Successfully deployed {processedOrders.length} orders to dashboard! Redirecting...
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4">
              {processedOrders.map((order, index) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">
                      Order {index + 1}: {order.operator} - {order.entity}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {order.wells.length} wells
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>State: {order.state} | County: {order.county}</p>
                    <p>Effective Date: {order.effectiveDate}</p>
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