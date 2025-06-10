'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { getDocument } from 'pdfjs-dist';

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const convertPdfToImage = async (pdfFile: File): Promise<Blob> => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await getDocument(arrayBuffer).promise;
    const page = await pdf.getPage(1); // Get first page
    const viewport = page.getViewport({ scale: 2.0 }); // Scale up for better OCR

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }

    // Render PDF page to canvas
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Could not convert canvas to blob'));
        }
      }, 'image/png');
    });
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert PDF to image if it's a PDF
      let fileToUpload = file;
      if (file.type === 'application/pdf') {
        console.log('Converting PDF to image...');
        const imageBlob = await convertPdfToImage(file);
        fileToUpload = new File([imageBlob], file.name.replace('.pdf', '.png'), { type: 'image/png' });
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);

      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process file');
      }

      const data = await response.json();
      setSuccess('File processed successfully!');
      console.log('Processed data:', data);
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while processing the file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Division Order</CardTitle>
        <CardDescription>
          Upload a scanned PDF division order to process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="file">File</Label>
          <Input
            id="file"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>
        <Button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="mt-4 w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Upload'
          )}
        </Button>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-4">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 