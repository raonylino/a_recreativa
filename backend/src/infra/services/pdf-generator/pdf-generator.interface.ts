import { Document } from '@core/domain/entities/document.entity';

export interface IPDFGenerator {
  generate(document: Document, outputPath: string): Promise<void>;
}
