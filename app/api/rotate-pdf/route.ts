import { NextResponse } from 'next/server';
import { PDFDocument, degrees } from 'pdf-lib';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const rotationStr = formData.get('rotation') as string;
    const rotation = parseInt(rotationStr) || 0;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    if (rotation === 0) {
      return NextResponse.json(
        { error: 'No rotation specified' },
        { status: 400 }
      );
    }

    // Convert the file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const pdfBytes = new Uint8Array(arrayBuffer);

    // Load the PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);
    console.log('PDF document loaded, pages:', pdfDoc.getPageCount());

    // Create a new PDF document for the rotated content
    const rotatedPdfDoc = await PDFDocument.create();

    // Apply rotation to all pages
    const pages = pdfDoc.getPages();
    for (let i = 0; i < pages.length; i++) {
      try {
        const page = pages[i];
        const { width, height } = page.getSize();
        console.log(`Original page ${i + 1} size: ${width}x${height}`);
        
        // Create a new page with appropriate dimensions based on rotation
        let newPage;
        if (rotation === 90 || rotation === 270) {
          // For 90° and 270° rotations, swap width and height
          newPage = rotatedPdfDoc.addPage([height, width]);
          console.log(`Created new page ${i + 1} with swapped dimensions: ${height}x${width}`);
        } else {
          // For 180° rotation, keep same dimensions
          newPage = rotatedPdfDoc.addPage([width, height]);
          console.log(`Created new page ${i + 1} with same dimensions: ${width}x${height}`);
        }
        
        // Copy all content from the original page to the new page
        const [embeddedPage] = await rotatedPdfDoc.embedPdf(pdfBytes, [i]);
        console.log(`Embedded page ${i + 1} from original PDF`);
        
        // Get the new page dimensions
        const { width: newWidth, height: newHeight } = newPage.getSize();
        console.log(`New page ${i + 1} dimensions: ${newWidth}x${newHeight}`);
        
        // Apply the rotation transformation
        if (rotation === 90) {
          // Rotate 90° clockwise: translate to top-right, then rotate
          newPage.drawPage(embeddedPage, {
            x: newWidth,
            y: 0,
            width: width,
            height: height,
            rotate: degrees(90)
          });
          console.log(`Applied 90° rotation to page ${i + 1}`);
        } else if (rotation === 180) {
          // Rotate 180°: translate to top-right, then rotate
          newPage.drawPage(embeddedPage, {
            x: newWidth,
            y: newHeight,
            width: width,
            height: height,
            rotate: degrees(180)
          });
          console.log(`Applied 180° rotation to page ${i + 1}`);
        } else if (rotation === 270) {
          // Rotate 270° clockwise: translate to bottom-left, then rotate
          newPage.drawPage(embeddedPage, {
            x: 0,
            y: newHeight,
            width: width,
            height: height,
            rotate: degrees(270)
          });
          console.log(`Applied 270° rotation to page ${i + 1}`);
        }
        
        console.log(`Successfully processed page ${i + 1}`);
      } catch (pageError) {
        console.error(`Error processing page ${i + 1}:`, pageError);
        throw new Error(`Failed to rotate page ${i + 1}: ${pageError instanceof Error ? pageError.message : 'Unknown error'}`);
      }
    }
    
    console.log(`Applied ${rotation}° rotation to all pages`);

    // Save the rotated PDF
    const rotatedPdfBytes = await rotatedPdfDoc.save();
    console.log('Rotated PDF saved, size:', rotatedPdfBytes.length);
    console.log('Original PDF size:', pdfBytes.length);
    console.log('Rotation completed successfully');

    // Return the rotated PDF
    return new NextResponse(Buffer.from(rotatedPdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="rotated_${file.name}"`,
      },
    });
  } catch (error) {
    console.error('Error rotating PDF:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to rotate PDF' },
      { status: 500 }
    );
  }
} 