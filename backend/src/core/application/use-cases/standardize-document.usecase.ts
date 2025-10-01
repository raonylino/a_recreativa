import { Document } from '@core/domain/entities/document.entity';
import { IDocumentRepository } from '@core/domain/repositories/id-document-repository.interface';
import { DocumentId } from '@core/domain/value-objects/document-id.vo';
import { AppError } from '@shared/errors/app.error';
import { DocumentResponseDTO } from '../dtos/document-response.dto';
import { StandardizeDocumentDTO } from '../dtos/standardize-document.dto';

export interface IPDFGenerator {
  generate(document: Document, outputPath: string): Promise<void>;
}

export class StandardizeDocumentUseCase {
  constructor(
    private documentRepository: IDocumentRepository,
    private pdfGenerator: IPDFGenerator
  ) { }

  async execute(data: StandardizeDocumentDTO): Promise<DocumentResponseDTO> {
    const { documentId, lessonPlanData } = data;

    // Find document
    const docId = new DocumentId(documentId);
    const document = await this.documentRepository.findById(docId);

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    // Update lesson plan data
    document.updateLessonPlanData(lessonPlanData);

    // Generate standardized PDF path
    const standardizedPath = `uploads/standardized/${documentId}-standardized.pdf`;

    // Generate PDF
    await this.pdfGenerator.generate(document, standardizedPath);

    // Mark as standardized
    document.markAsStandardized(standardizedPath);

    // Update in repository
    await this.documentRepository.update(document);

    return this.toDTO(document);
  }

  private toDTO(document: Document): DocumentResponseDTO {
    const lessonPlanData = document.getLessonPlanData();

    return {
      id: document.getId().getValue(),
      title: document.getTitle(),
      description: document.getDescription(),
      originalFileName: document.getOriginalFileName(),
      originalFilePath: document.getOriginalFilePath(),
      originalFileType: document.getOriginalFileType().toString(),
      lessonPlanData: lessonPlanData ? lessonPlanData.toJSON() : undefined,
      standardizedFilePath: document.getStandardizedFilePath(),
      standardizedAt: document.getStandardizedAt(),
      isStandardized: document.isStandardized(),
      hasLessonPlanData: document.hasLessonPlanData(),
      createdAt: document.getCreatedAt(),
      updatedAt: document.getUpdatedAt()
    };
  }
}
