import { Document } from '@core/domain/entities/document.entity';
import { IDocumentRepository } from '@core/domain/repositories/id-document-repository.interface';
import { DocumentId } from '@core/domain/value-objects/document-id.vo';
import { AppError } from '@shared/errors/app.error';
import { DocumentResponseDTO } from '../dtos/document-response.dto';

export class GetDocumentUseCase {
  constructor(private documentRepository: IDocumentRepository) { }

  async execute(id: string): Promise<DocumentResponseDTO> {
    const documentId = new DocumentId(id);
    const document = await this.documentRepository.findById(documentId);

    if (!document) {
      throw new AppError('Document not found', 404);
    }

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
