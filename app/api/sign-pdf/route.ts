import { NextResponse } from 'next/server';
import { PDFDocument, PDFPage } from 'pdf-lib';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import * as pdfjsLib from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FieldLocation {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'signature' | 'text';
  label?: string;
  fieldType?: 'name' | 'taxId' | 'phone' | 'email' | 'address';
}

// Common field patterns to look for
const FIELD_PATTERNS = {
  name: /(?:printed\s*name|full\s*name|owner\s*name|name\s*of\s*owner)/i,
  taxId: /(?:tax\s*id|ssn|social\s*security|tax\s*identification|ein)/i,
  phone: /(?:phone|telephone|contact\s*number|phone\s*number)/i,
  email: /(?:email|e-mail|electronic\s*mail|email\s*address)/i,
  address: /(?:address|mailing\s*address|physical\s*address|street\s*address)/i
};

async function detectFields(pdfBytes: Uint8Array): Promise<Map<number, FieldLocation[]>> {
  const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
  const pdf = await loadingTask.promise;
  const fieldsByPage = new Map<number, FieldLocation[]>();

  // Process each page
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const fields: FieldLocation[] = [];

    // First, try to get form fields
    const annotations = await page.getAnnotations();
    
    for (const annotation of annotations) {
      if (annotation.fieldType) {
        const rect = annotation.rect;
        const [x1, y1, x2, y2] = rect;
        
        // Convert coordinates to PDF-lib format
        const field: FieldLocation = {
          x: x1,
          y: page.view[3] - y2,
          width: x2 - x1,
          height: y2 - y1,
          type: annotation.fieldType === 'Sig' ? 'signature' : 'text',
          label: annotation.fieldName || annotation.fieldValue
        };

        // Determine field type based on label
        const label = field.label?.toLowerCase() || '';
        for (const [type, pattern] of Object.entries(FIELD_PATTERNS)) {
          if (pattern.test(label)) {
            field.fieldType = type as FieldLocation['fieldType'];
            break;
          }
        }

        fields.push(field);
      }
    }

    // If no form fields found or we need more fields, analyze text content
    const textContent = await page.getTextContent();
    const items = textContent.items;
    
    // Group text items that are close to each other
    const textGroups: { text: string; x: number; y: number }[] = [];
    let currentGroup = { text: '', x: 0, y: 0 };
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if ('str' in item) {
        const textItem = item as TextItem;
        const text = textItem.str.trim();
        if (!text) continue;

        const x = textItem.transform[4];
        const y = textItem.transform[5];

        // If this item is close to the current group, add to it
        if (Math.abs(y - currentGroup.y) < 5) {
          currentGroup.text += ' ' + text;
        } else {
          if (currentGroup.text) {
            textGroups.push({ ...currentGroup });
          }
          currentGroup = { text, x, y };
        }
      }
    }
    if (currentGroup.text) {
      textGroups.push(currentGroup);
    }

    // Look for field labels and their corresponding input areas
    for (let i = 0; i < textGroups.length; i++) {
      const group = textGroups[i];
      const text = group.text.toLowerCase();

      // Check if this text matches any field pattern
      for (const [type, pattern] of Object.entries(FIELD_PATTERNS)) {
        if (pattern.test(text)) {
          // Look for the input area (usually a line or box after the label)
          const nextGroup = textGroups[i + 1];
          if (nextGroup) {
            const field: FieldLocation = {
              x: nextGroup.x,
              y: page.view[3] - nextGroup.y,
              width: 300, // Default width for text fields
              height: 30, // Default height for text fields
              type: 'text',
              label: group.text,
              fieldType: type as FieldLocation['fieldType']
            };
            fields.push(field);
          }
          break;
        }
      }
    }

    fieldsByPage.set(pageNum, fields);
  }

  return fieldsByPage;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const entityId = formData.get('entityId') as string;
    const signature = formData.get('signature') as string;
    const printedName = formData.get('printedName') as string;
    const taxId = formData.get('taxId') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;

    console.log('Received data:', {
      hasFile: !!file,
      entityId,
      hasSignature: !!signature,
      printedName,
      taxId,
      phone,
      email,
      address
    });

    if (!file || !entityId) {
      return NextResponse.json(
        { error: 'File and entity ID are required' },
        { status: 400 }
      );
    }

    // Convert the file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const pdfBytes = new Uint8Array(arrayBuffer);
    console.log('PDF loaded, size:', pdfBytes.length);

    // Detect fields in the PDF
    const fieldsByPage = await detectFields(pdfBytes);
    console.log('Detected fields by page:', Object.fromEntries(fieldsByPage));

    const pdfDoc = await PDFDocument.load(pdfBytes);
    console.log('PDF document loaded, pages:', pdfDoc.getPageCount());

    // Process each page
    const pages = pdfDoc.getPages();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const pageFields = fieldsByPage.get(i + 1) || [];
      console.log(`Processing page ${i + 1}, found ${pageFields.length} fields`);

      // Process each field
      for (const field of pageFields) {
        if (field.type === 'signature' && signature) {
          try {
            // Convert base64 signature to PNG
            const signatureData = signature.split(',')[1];
            const signatureBytes = Buffer.from(signatureData, 'base64');
            const signatureImage = await pdfDoc.embedPng(signatureBytes);
            
            page.drawImage(signatureImage, {
              x: field.x,
              y: field.y,
              width: field.width,
              height: field.height,
            });
            console.log('Signature added to field:', field.label);
          } catch (err) {
            console.error('Error processing signature:', err);
          }
        } else if (field.type === 'text') {
          // Get the appropriate text based on field type
          let text = '';
          switch (field.fieldType) {
            case 'name':
              text = printedName;
              break;
            case 'taxId':
              text = taxId;
              break;
            case 'phone':
              text = phone;
              break;
            case 'email':
              text = email;
              break;
            case 'address':
              text = address;
              break;
          }

          // Only fill the field if we have a value
          if (text && text.trim() !== '') {
            // Calculate font size to fit the field
            const fontSize = Math.min(field.height * 0.8, 12);
            
            page.drawText(text, {
              x: field.x + 2,
              y: field.y + (field.height - fontSize) / 2,
              size: fontSize,
              maxWidth: field.width - 4,
            });
            console.log('Text added to field:', field.label, 'with value:', text);
          } else {
            console.log('No value provided for field:', field.label);
          }
        }
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