import fs from 'fs';
import { ExtractedData, IFileProcessor } from './file-processor.interface';

export class PDFProcessor implements IFileProcessor {
  supports(fileType: string): boolean {
    return fileType.toLowerCase() === 'pdf';
  }

  async process(filePath: string): Promise<ExtractedData> {
    // Nota: Para produção, usar bibliotecas como pdf-parse ou pdfjs-dist
    // Por enquanto, retornamos dados simulados para estrutura

    const fileExists = fs.existsSync(filePath);
    if (!fileExists) {
      throw new Error(`PDF file not found: ${filePath}`);
    }

    // Simulação de extração de texto
    return {
      text: 'Conteúdo extraído do PDF (simulado)',
      metadata: {
        title: 'Plano de Aula',
        author: 'Professor',
        subject: 'Educação Física'
      }
    };
  }
}
