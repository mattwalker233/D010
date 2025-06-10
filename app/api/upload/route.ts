import { NextRequest, NextResponse } from 'next/server';
import { createWorker } from 'tesseract.js';
import { PDFDocument } from 'pdf-lib';
import { fromPath } from 'pdf2pic';
import { processWithClaude } from '../../../lib/claude-service';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdf-'));
    const pdfPath = path.join(tempDir, 'input.pdf');
    fs.writeFileSync(pdfPath, Buffer.from(buffer));

    const convert = fromPath(pdfPath, {
      density: 300,
      saveFilename: 'page',
      savePath: tempDir,
      format: 'png',
      width: 2480,
      height: 3508,
    });

    const pageToPNG = async (pageNumber: number) => {
      const options = {
        responseType: 'buffer' as const,
        page: pageNumber,
      };
      await convert(pageNumber, options);
      return path.join(tempDir, `page_${pageNumber}.png`);
    };

    const pdfDoc = await PDFDocument.load(buffer);
    const numPages = pdfDoc.getPageCount();
    let fullText = '';

    // Initialize Tesseract worker with Node.js specific options
    const worker = await createWorker({
      logger: m => console.log(m),
      errorHandler: err => console.error(err),
      workerPath: path.join(process.cwd(), 'node_modules/tesseract.js/dist/worker.min.js'),
      corePath: path.join(process.cwd(), 'node_modules/tesseract.js-core/tesseract-core.wasm.js'),
      langPath: path.join(process.cwd(), 'node_modules/tesseract.js-core/tessdata'),
      gzip: false,
      cachePath: tempDir,
      workerBlobURL: false,
    });

    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    for (let i = 1; i <= numPages; i++) {
      const imagePath = await pageToPNG(i);
      const { data: { text } } = await worker.recognize(imagePath);
      fullText += text + '\n';
    }

    await worker.terminate();
    fs.rmSync(tempDir, { recursive: true, force: true });

    const structuredData = await processWithClaude(fullText);
    return NextResponse.json(structuredData);
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 });
  }
} 