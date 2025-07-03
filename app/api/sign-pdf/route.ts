import { NextResponse } from 'next/server';
import { PDFDocument, PDFForm, PDFTextField, PDFSignature, PDFPage, rgb } from 'pdf-lib';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { prisma } from '@/lib/prisma';

interface FieldLocation {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'signature' | 'text';
  label?: string;
  fieldType?: 'name' | 'phone' | 'email' | 'address';
  field?: PDFTextField | PDFSignature;
}

// Common field patterns to look for
const FIELD_PATTERNS = {
  name: /(?:printed\s*name|full\s*name|owner\s*name|name\s*of\s*owner)/i,
  phone: /(?:phone|telephone|contact\s*number|phone\s*number)/i,
  email: /(?:email|e-mail|electronic\s*mail|email\s*address)/i,
  address: /(?:address|mailing\s*address|physical\s*address|street\s*address)/i
};

// Signature field patterns
const SIGNATURE_PATTERNS = [
  /signature/i,
  /sign\s*here/i,
  /sign\s*name/i,
  /sign\s*below/i,
  /sign\s*above/i,
  /sign\s*line/i,
  /signature\s*line/i,
  /signature\s*block/i,
  /owner\s*signature/i,
  /authorized\s*signature/i,
  /sign\s*and\s*date/i,
  /date\s*and\s*signature/i
];

// Visual signature indicators to look for
const SIGNATURE_INDICATORS = [
  /signature/i,
  /sign\s*here/i,
  /owner\s*signature/i,
  /authorized\s*signature/i,
  /sign\s*and\s*date/i,
  /date\s*and\s*signature/i,
  /signature\s*line/i,
  /signature\s*block/i,
  /x\s*here/i,
  /sign\s*above/i,
  /sign\s*below/i
];

async function detectFields(pdfDoc: PDFDocument): Promise<Map<number, FieldLocation[]>> {
  const fieldsByPage = new Map<number, FieldLocation[]>();
  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const fields: FieldLocation[] = [];

    try {
      // Get form fields if they exist
      const form = pdfDoc.getForm();
      const formFields = form.getFields();
      
      for (const field of formFields) {
        const fieldType = field.constructor.name;
        const fieldName = field.getName();
        
        // Get page dimensions for positioning
        const { width, height } = page.getSize();
        
        // Check if this is a signature field
        const isSignatureField = fieldType === 'PDFSignature' || 
          SIGNATURE_PATTERNS.some(pattern => pattern.test(fieldName.toLowerCase()));

        // Calculate field position
        let x = width * 0.1;
        let y = height * 0.1;
        let fieldWidth = width * 0.3;
        let fieldHeight = height * 0.1;

        // For signature fields, position them at the bottom of the page
        if (isSignatureField) {
          // Position signature field at the bottom of the page
          y = height * 0.2;
          fieldWidth = 200; // Default width for signature
          fieldHeight = 50; // Default height for signature
        } else {
          // Position text fields in a vertical stack
          const fieldIndex = fields.length;
          y = height * (0.7 - fieldIndex * 0.1);
        }
        
        const fieldLocation: FieldLocation = {
          x,
          y,
          width: fieldWidth,
          height: fieldHeight,
          type: isSignatureField ? 'signature' : 'text',
          label: fieldName,
          field: field
        };

        // For non-signature fields, determine field type based on name
        if (!isSignatureField) {
          const name = fieldName.toLowerCase();
          for (const [type, pattern] of Object.entries(FIELD_PATTERNS)) {
            if (pattern.test(name)) {
              fieldLocation.fieldType = type as FieldLocation['fieldType'];
              break;
            }
          }
        }

        fields.push(fieldLocation);
      }
    } catch (error) {
      console.error('Error processing form fields:', error);
    }

    // Enhanced signature detection for visual elements
    const { width, height } = page.getSize();
    
    // Look for common signature areas based on typical PDF layouts
    const signatureAreas = await findSignatureAreas(page);

    // Add signature areas if no signature field was found
    if (!fields.some(f => f.type === 'signature')) {
      // Use the first signature area as default
      const defaultSignatureArea = signatureAreas[0];
      fields.push({
        x: defaultSignatureArea.x,
        y: defaultSignatureArea.y,
        width: defaultSignatureArea.width,
        height: defaultSignatureArea.height,
        type: 'signature',
        label: defaultSignatureArea.label
      });
    }

    fieldsByPage.set(i + 1, fields);
  }

  return fieldsByPage;
}

async function findSignatureAreas(page: PDFPage): Promise<FieldLocation[]> {
  const { width, height } = page.getSize();
  const signatureAreas: FieldLocation[] = [];
  
  // Common signature area positions based on typical document layouts
  const commonPositions = [
    // Bottom right (most common for business documents)
    { x: width * 0.65, y: height * 0.12, w: 140, h: 50 },
    // Bottom center (common for forms)
    { x: width * 0.35, y: height * 0.12, w: 140, h: 50 },
    // Bottom left (less common but possible)
    { x: width * 0.05, y: height * 0.12, w: 140, h: 50 },
    // Right side middle (for contracts)
    { x: width * 0.75, y: height * 0.35, w: 120, h: 45 },
    // Right side upper (for letters)
    { x: width * 0.75, y: height * 0.65, w: 120, h: 45 }
  ];
  
  // Add signature areas at common positions
  commonPositions.forEach((pos, index) => {
    signatureAreas.push({
      x: pos.x,
      y: pos.y,
      width: pos.w,
      height: pos.h,
      type: 'signature',
      label: `Signature Area ${index + 1}`
    });
  });
  
  return signatureAreas;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const entityId = formData.get('entityId') as string;
    const signaturePositionsStr = formData.get('signaturePositions') as string;
    const placeStickerOnEveryPageStr = formData.get('placeStickerOnEveryPage') as string;
    const placeStickerOnEveryPage = placeStickerOnEveryPageStr === 'true';

    if (!file || !entityId) {
      return NextResponse.json(
        { error: 'File and entity ID are required' },
        { status: 400 }
      );
    }

    // Fetch entity data from Prisma
    const entity = await prisma.entity.findUnique({
      where: { id: entityId }
    });

    if (!entity) {
      return NextResponse.json(
        { error: 'Entity not found' },
        { status: 404 }
      );
    }

    if (!entity.signature) {
      return NextResponse.json(
        { error: 'Entity does not have a signature' },
        { status: 400 }
      );
    }

    // Use entity's sticker_info
    const stickerText = entity.sticker_info || '';

    // Parse signature positions if provided
    let manualSignaturePositions: Array<{x: number, y: number, page: number}> = [];
    if (signaturePositionsStr) {
      try {
        manualSignaturePositions = JSON.parse(signaturePositionsStr);
      } catch (error) {
        console.error('Error parsing signature positions:', error);
      }
    }

    // Convert the file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const pdfBytes = new Uint8Array(arrayBuffer);

    // Load the PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);
    console.log('PDF document loaded, pages:', pdfDoc.getPageCount());

    // Process each page
    const pages = pdfDoc.getPages();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const pageNum = i + 1;
      
      // Get manual signature positions for this page
      const pageSignaturePositions = manualSignaturePositions.filter(pos => pos.page === pageNum);
      
      // Only place signatures where user manually clicked
      for (const position of pageSignaturePositions) {
        try {
          // Convert base64 signature to PNG
          const signatureData = entity.signature.split(',')[1];
          const signatureBytes = Buffer.from(signatureData, 'base64');
          const signatureImage = await pdfDoc.embedPng(signatureBytes);
          
          // Calculate signature size (standard size)
          const signatureWidth = 120;
          const signatureHeight = 50;
          
          // Draw signature at the exact position
          page.drawImage(signatureImage, {
            x: position.x - signatureWidth / 2, // Center the signature on the click point
            y: position.y - signatureHeight / 2,
            width: signatureWidth,
            height: signatureHeight,
          });
          console.log(`Signature added at position (${position.x}, ${position.y}) on page ${pageNum}`);
        } catch (err) {
          console.error('Error processing signature:', err);
        }
      }
    }

    // Add sticker to pages based on user preference
    if (stickerText && stickerText.trim() !== '') {
      // Determine which pages to add stickers to
      const pagesToSticker = placeStickerOnEveryPage ? pages : [pages[0]];
      
      for (const page of pagesToSticker) {
        const { width, height } = page.getSize();
        
        // Process text to preserve original line breaks
        const fontSize = 9; // Slightly larger font for better readability
        const lineHeight = fontSize + 2; // Better line spacing
        const padding = 12; // Increased padding for better spacing
        const cornerRadius = 6; // Rounded corners
        const maxStickerWidth = Math.min(320, width * 0.35); // Slightly smaller max width
        const textMaxWidth = maxStickerWidth - (padding * 2);
        
        // Split text by original line breaks first
        const originalLines = stickerText.split('\n');
        const processedLines: string[] = [];
        
        // Process each original line
        for (const originalLine of originalLines) {
          const words = originalLine.trim().split(' ');
          let currentLine = '';
          
          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            // More accurate width estimation using character count
            const estimatedWidth = testLine.length * fontSize * 0.6; // More accurate multiplier
            
            if (estimatedWidth > textMaxWidth && currentLine) {
              processedLines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
          
          if (currentLine) {
            processedLines.push(currentLine);
          }
        }
        
        // Calculate required height based on content - no line limit
        const displayLines = processedLines;
        const totalTextHeight = displayLines.length * lineHeight;
        const requiredHeight = totalTextHeight + (padding * 2);
        const stickerHeight = Math.max(50, requiredHeight); // Minimum 50 points
        
        // Calculate actual sticker width based on longest line
        let actualStickerWidth = maxStickerWidth;
        for (const line of displayLines) {
          const lineWidth = line.length * fontSize * 0.6;
          const lineRequiredWidth = lineWidth + (padding * 2);
          if (lineRequiredWidth > actualStickerWidth) {
            actualStickerWidth = Math.min(lineRequiredWidth, width * 0.45); // Max 45% of page width
          }
        }
        
        // Position sticker in bottom right corner with dynamic sizing
        const stickerX = width - actualStickerWidth - 20; // 20 points from right edge
        const stickerY = 20; // 20 points from bottom
        
        // Ensure sticker doesn't go off the page
        const finalStickerX = Math.max(20, stickerX);
        const finalStickerWidth = Math.min(actualStickerWidth, width - 40); // Ensure it fits on page
        
        // Draw subtle shadow effect (multiple rectangles with decreasing opacity)
        const shadowOffset = 2;
        const shadowOpacity = 0.1;
        for (let i = 0; i < 3; i++) {
          page.drawRectangle({
            x: finalStickerX + (i * shadowOffset / 3),
            y: stickerY - (i * shadowOffset / 3),
            width: finalStickerWidth,
            height: stickerHeight,
            color: rgb(0, 0, 0),
            opacity: shadowOpacity * (1 - i / 3),
          });
        }
        
        // Draw main sticker background with gradient-like effect
        // Create a more sophisticated background with multiple layers
        
        // Base background (slightly darker)
        page.drawRectangle({
          x: finalStickerX,
          y: stickerY,
          width: finalStickerWidth,
          height: stickerHeight,
          color: rgb(0.98, 0.96, 0.9), // Very light cream background
          borderColor: rgb(0.85, 0.75, 0.5), // Warm border color
          borderWidth: 1.5,
        });
        
        // Add a subtle top highlight
        page.drawRectangle({
          x: finalStickerX + 1,
          y: stickerY + stickerHeight - 8,
          width: finalStickerWidth - 2,
          height: 8,
          color: rgb(1, 1, 1),
          opacity: 0.3,
        });
        
        // Add a subtle bottom shadow
        page.drawRectangle({
          x: finalStickerX + 1,
          y: stickerY + 1,
          width: finalStickerWidth - 2,
          height: 6,
          color: rgb(0, 0, 0),
          opacity: 0.05,
        });
        
        // Calculate vertical centering offset
        const textBlockHeight = displayLines.length * lineHeight;
        const verticalOffset = (stickerHeight - textBlockHeight) / 2;
        
        // Draw each line of text with improved styling
        displayLines.forEach((line, index) => {
          const lineY = stickerY + stickerHeight - padding - (index * lineHeight) - verticalOffset;
          
          // Calculate center position for the line with improved accuracy
          const lineWidth = line.length * fontSize * 0.55; // More accurate multiplier for centering
          const centerX = finalStickerX + (finalStickerWidth / 2) - (lineWidth / 2);
          
          // Add subtle text shadow for better readability
          page.drawText(line, {
            x: centerX + 0.5,
            y: lineY - 0.5,
            size: fontSize,
            color: rgb(0.1, 0.1, 0.1),
            opacity: 0.3,
          });
          
          // Main text
          page.drawText(line, {
            x: centerX,
            y: lineY,
            size: fontSize,
            color: rgb(0.25, 0.2, 0.15), // Warmer, more professional text color
            maxWidth: finalStickerWidth - (padding * 2),
          });
        });
        
        // Add a subtle accent line at the top
        page.drawRectangle({
          x: finalStickerX + 2,
          y: stickerY + stickerHeight - 2,
          width: finalStickerWidth - 4,
          height: 2,
          color: rgb(0.7, 0.6, 0.4), // Accent color
        });
        
        const pageNumber = pages.indexOf(page) + 1;
        console.log(`Professional sticker added to bottom right corner of page ${pageNumber} with ${displayLines.length} lines`);
      }
    }

    console.log('All fields processed');

    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    console.log('PDF saved, size:', modifiedPdfBytes.length);
    
    // Create a temporary file
    const tempFilePath = join(tmpdir(), `signed_${Date.now()}.pdf`);
    await writeFile(tempFilePath, modifiedPdfBytes);
    console.log('Temporary file created:', tempFilePath);

    // Return the modified PDF
    return new NextResponse(modifiedPdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="signed_${file.name}"`,
      },
    });
  } catch (error) {
    console.error('Error signing PDF:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sign PDF' },
      { status: 500 }
    );
  }
} 