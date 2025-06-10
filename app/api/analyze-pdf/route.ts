import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;

    if (!pdfFile) {
      return NextResponse.json(
        { error: 'PDF file is required' },
        { status: 400 }
      );
    }

    // Convert the PDF file to ArrayBuffer
    const pdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Get the first page
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Get the form fields
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    // Initialize required fields
    const requiredFields = {
      signature: false,
      taxId: false,
      phone: false,
      email: false,
      address: false
    };

    // Check for signature field
    const hasSignatureField = fields.some(field => {
      const name = field.getName().toLowerCase();
      return name.includes('signature') || name.includes('sign');
    });

    // Check for other fields
    fields.forEach(field => {
      const name = field.getName().toLowerCase();
      
      if (name.includes('tax') || name.includes('ssn') || name.includes('ein')) {
        requiredFields.taxId = true;
      }
      if (name.includes('phone') || name.includes('tel')) {
        requiredFields.phone = true;
      }
      if (name.includes('email') || name.includes('e-mail')) {
        requiredFields.email = true;
      }
      if (name.includes('address')) {
        requiredFields.address = true;
      }
    });

    // If no signature field is found but there's a signature line or box in the PDF
    if (!hasSignatureField) {
      // Check for signature-related text in field names
      const hasSignatureText = fields.some(field => {
        const name = field.getName().toLowerCase();
        return name.includes('signature') || 
               name.includes('sign here') || 
               name.includes('signature line') ||
               name.includes('signature block');
      });

      if (hasSignatureText) {
        requiredFields.signature = true;
      }
    } else {
      requiredFields.signature = true;
    }

    return NextResponse.json({ requiredFields });
  } catch (error) {
    console.error('Error analyzing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to analyze PDF' },
      { status: 500 }
    );
  }
} 