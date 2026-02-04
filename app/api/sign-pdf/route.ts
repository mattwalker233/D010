import { NextResponse } from 'next/server';
import { PDFDocument, PDFForm, PDFTextField, PDFSignature, PDFPage, rgb, degrees } from 'pdf-lib';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { prisma } from '@/lib/prisma';

// Function to generate PDF filename based on Entity_DO_Operator_WellName format
function generatePdfFilename(operator: string, entity: string, wellName: string): string {
  // Clean and sanitize the inputs
  function sanitizeFilename(text: string): string {
    if (!text) return "Unknown";
    // Remove or replace invalid filename characters (including forward slash)
    const invalidChars = '<>:"/\\|?*&()[]{}#%+=!@$^~`';
    for (const char of invalidChars) {
      text = text.replace(new RegExp('\\' + char, 'g'), '_');
    }
    // Keep spaces within the text, just clean up extra spaces
    text = text.trim().replace(/\s+/g, ' ');
    // Remove multiple consecutive underscores
    while (text.includes('__')) {
      text = text.replace('__', '_');
    }
    // Remove leading/trailing underscores
    text = text.replace(/^_+|_+$/g, '');
    // Limit length to avoid filesystem issues
    return text.substring(0, 50);
  }
  
  // Sanitize inputs
  const cleanEntity = sanitizeFilename(entity);
  const cleanOperator = sanitizeFilename(operator);
  const cleanWellName = sanitizeFilename(wellName);
  
  // Generate filename: Entity-DO-Operator-WellName.pdf
  return `${cleanEntity} - DO - ${cleanOperator} - ${cleanWellName}.pdf`;
}

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
    const operatorName = formData.get('operatorName') as string;
    const wellName = formData.get('wellName') as string;
    const signaturePositionsStr = formData.get('signaturePositions') as string;
    
    const placeStickerOnEveryPageStr = formData.get('placeStickerOnEveryPage') as string;
    const placeStickerOnEveryPage = placeStickerOnEveryPageStr === 'true';
    
    const stickerPageSelection = formData.get('stickerPageSelection') as string;
    const selectedStickerPageStr = formData.get('selectedStickerPage') as string;
    const selectedStickerPage = parseInt(selectedStickerPageStr) || 1;
    
    const renameOnlyStr = formData.get('renameOnly') as string;
    const renameOnly = renameOnlyStr === 'true';
    
    console.log('=== SIGN PDF DEBUG ===');
    console.log('Received operatorName:', operatorName, '(type:', typeof operatorName, ')');
    console.log('Received wellName:', wellName, '(type:', typeof wellName, ')');
    console.log('Received entityId:', entityId, '(type:', typeof entityId, ')');
    console.log('Received renameOnly:', renameOnly, '(type:', typeof renameOnly, ')');
    console.log('Received stickerPageSelection:', stickerPageSelection);
    console.log('Received selectedStickerPage:', selectedStickerPage);
    console.log('File name:', file?.name);
    console.log('File size:', file?.size);

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

    console.log('Fetched entity:', entity);
    console.log('Rename-only mode:', renameOnly ? 'ENABLED - PDF will be renamed without signatures/stickers' : 'DISABLED - PDF will be processed normally');

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
        console.log('Received signature positions:', manualSignaturePositions);
      } catch (error) {
        console.error('Error parsing signature positions:', error);
      }
    } else {
      console.log('No signature positions provided');
    }

    // Convert the file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const pdfBytes = new Uint8Array(arrayBuffer);

    // Load the PDF (should already be upright from rotation step)
    const pdfDoc = await PDFDocument.load(pdfBytes);
    console.log('PDF document loaded, pages:', pdfDoc.getPageCount());

    // Process each page
    const pages = pdfDoc.getPages();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const pageNum = i + 1;
      const { width: pageWidth, height: pageHeight } = page.getSize();
      
      console.log(`Page ${pageNum} dimensions: ${pageWidth}x${pageHeight}`);
      
      // Get manual signature positions for this page
      const pageSignaturePositions = manualSignaturePositions.filter(pos => pos.page === pageNum);
      
      // Only process signatures and stickers if not in rename-only mode
      if (!renameOnly) {
        // Only place signatures if user actually clicked to place them
        if (pageSignaturePositions.length === 0) {
          console.log(`No signatures placed by user on page ${pageNum} - skipping signature placement`);
        } else {
      console.log(`Processing ${pageSignaturePositions.length} signatures for page ${pageNum}`);
      
      for (const position of pageSignaturePositions) {
        try {
          // Convert base64 signature to PNG
          const signatureData = entity.signature.split(',')[1];
          const signatureBytes = Buffer.from(signatureData, 'base64');
          console.log(`Signature data length: ${signatureData.length}, bytes length: ${signatureBytes.length}`);
          
          const signatureImage = await pdfDoc.embedPng(signatureBytes);
          console.log(`Signature image embedded successfully`);
          
          // Calculate signature size maintaining aspect ratio
          const maxWidth = 120;
          const maxHeight = 50;
          
          // Get the original image dimensions
          const originalWidth = signatureImage.width;
          const originalHeight = signatureImage.height;
          
          // Calculate aspect ratio
          const aspectRatio = originalWidth / originalHeight;
          
          // Calculate new dimensions maintaining aspect ratio
          let signatureWidth = maxWidth;
          let signatureHeight = maxWidth / aspectRatio;
          
          // If height exceeds max, scale down by height instead
          if (signatureHeight > maxHeight) {
            signatureHeight = maxHeight;
            signatureWidth = maxHeight * aspectRatio;
          }
          
          console.log(`Original signature dimensions: ${originalWidth}x${originalHeight}`);
          console.log(`Calculated signature dimensions: ${signatureWidth}x${signatureHeight} (aspect ratio: ${aspectRatio.toFixed(2)})`);
          
          // Draw signature at the exact position clicked (centered on click point)
          const signatureX = position.x - signatureWidth / 2;
          const signatureY = position.y - signatureHeight / 2;
          
          console.log(`Page ${pageNum} dimensions: ${pageWidth}x${pageHeight}`);
          console.log(`Click position: (${position.x}, ${position.y})`);
          console.log(`Signature size: ${signatureWidth}x${signatureHeight}`);
          console.log(`Drawing signature at (${signatureX}, ${signatureY}) on page ${pageNum}`);
          console.log(`Signature bounds: (${signatureX}, ${signatureY}) to (${signatureX + signatureWidth}, ${signatureY + signatureHeight})`);
          
          // Check if signature coordinates are within page bounds
          if (signatureX < 0 || signatureY < 0 || 
              signatureX + signatureWidth > pageWidth || 
              signatureY + signatureHeight > pageHeight) {
            console.warn(`Signature may be outside page bounds: x=${signatureX}, y=${signatureY}, page=${pageWidth}x${pageHeight}`);
          }
          
          page.drawImage(signatureImage, {
            x: signatureX,
            y: signatureY,
            width: signatureWidth,
            height: signatureHeight,
          });
                    console.log(`Signature successfully drawn at position (${position.x}, ${position.y}) on page ${pageNum}`);
        } catch (err) {
          console.error('Error processing signature:', err);
        }
        }
      }
      } // End of rename-only check for signatures
    } // End of rename-only check

    // Add sticker to pages based on user preference (only if not in rename-only mode)
    if (!renameOnly && stickerText && stickerText.trim() !== '') {
      // Determine which pages to add stickers to based on selection
      let pagesToSticker: any[] = [];
      
      if (stickerPageSelection === 'every') {
        pagesToSticker = pages;
      } else if (stickerPageSelection === 'specific') {
        // Add sticker to specific page (convert to 0-based index)
        const targetPage = pages[selectedStickerPage - 1];
        if (targetPage) {
          pagesToSticker = [targetPage];
        } else {
          console.warn(`Selected page ${selectedStickerPage} does not exist, using first page`);
          pagesToSticker = [pages[0]];
        }
      } else {
        // Default to first page
        pagesToSticker = [pages[0]];
      }
      
      console.log(`Sticker placement: ${stickerPageSelection}, pages to sticker: ${pagesToSticker.length}`);
      
      for (const page of pagesToSticker) {
        const { width, height } = page.getSize();
        console.log(`Page dimensions: ${width}x${height}`);
        
        // Process text to preserve original line breaks
        const fontSize = 8; // Slightly smaller font for more compact sticker
        const lineHeight = fontSize + 1; // Tighter line spacing
        const padding = 8; // Reduced padding for smaller sticker
        const cornerRadius = 4; // Smaller rounded corners
        const maxStickerWidth = Math.min(260, width * 0.26); // Slightly smaller max width
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
            actualStickerWidth = Math.min(lineRequiredWidth, width * 0.32); // Max 32% of page width
          }
        }
        
        // Position sticker in bottom right corner of the upright PDF
        const stickerX = width - actualStickerWidth - 10;
        const stickerY = 10;
        
        console.log(`Sticker positioning: x=${stickerX}, y=${stickerY}, width=${actualStickerWidth}, height=${stickerHeight}`);
        
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
          let centerX = finalStickerX + (finalStickerWidth / 2) - (lineWidth / 2);
          
          // Ensure text doesn't get cut off by adjusting position if needed
          if (centerX < finalStickerX + padding) {
            centerX = finalStickerX + padding; // Left-align if too close to left edge
          } else if (centerX + lineWidth > finalStickerX + finalStickerWidth - padding) {
            centerX = finalStickerX + finalStickerWidth - padding - lineWidth; // Right-align if too close to right edge
          }
          
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
    
    // Generate the new filename based on entity, operator, and well name
    let newFilename = `signed_${file.name}`; // fallback
    console.log('Filename generation check:');
    console.log('- operatorName:', operatorName, '(truthy:', !!operatorName, ')');
    console.log('- wellName:', wellName, '(truthy:', !!wellName, ')');
    console.log('- entity:', entity, '(truthy:', !!entity, ')');
    
    // Generate the new filename based on entity, operator, and well name
    if (operatorName && wellName && entity) {
      newFilename = generatePdfFilename(operatorName, entity.entity_name, wellName);
      console.log('Generated filename:', newFilename);
    } else {
      // Use fallback filename if data is missing
      newFilename = `signed_${file.name}`;
      console.log('Missing data, using fallback filename:', newFilename);
    }
    
    // Create a temporary file
    const tempFilePath = join(tmpdir(), newFilename);
    await writeFile(tempFilePath, modifiedPdfBytes);
    console.log('Temporary file created:', tempFilePath);

    // Return the modified PDF
    return new NextResponse(modifiedPdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${newFilename}"`,
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