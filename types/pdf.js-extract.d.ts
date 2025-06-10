declare module 'pdf.js-extract' {
  interface PDFPage {
    content: Array<{
      str: string;
      dir: string;
      transform: number[];
      width: number;
      height: number;
    }>;
    pageInfo: {
      num: number;
      scale: number;
    };
  }

  interface PDFData {
    pages: PDFPage[];
  }

  interface PDFExtract {
    extractBuffer(buffer: Buffer): Promise<PDFData>;
  }

  const PDFExtract: () => PDFExtract;
  export default PDFExtract;
} 