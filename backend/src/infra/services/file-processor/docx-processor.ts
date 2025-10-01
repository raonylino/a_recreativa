import fs from 'fs';
import mammoth from 'mammoth';
import { ExtractedData, IFileProcessor } from './file-processor.interface';

export class DOCXProcessor implements IFileProcessor {
  supports(fileType: string): boolean {
    return fileType.toLowerCase() === 'docx';
  }

  async process(filePath: string): Promise<ExtractedData> {
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) {
      throw new Error(`DOCX file not found: ${filePath}`);
    }

    try {
      const result = await mammoth.extractRawText({ path: filePath });

      return {
        text: result.value,
        metadata: {
          title: 'Documento DOCX',
        }
      };
    } catch (error) {
      console.error('Error processing DOCX:', error);
      throw new Error('Failed to process DOCX file');
    }
  }
}
