import { Document } from '@core/domain/entities/document.entity';
import { IDocumentRepository } from '@core/domain/repositories/id-document-repository.interface';
import { DocumentResponseDTO } from '../dtos/document-response.dto';

export class ListDocumentsUseCase {
  constructor(private documentRepository: IDocumentRepository) { }

  async execute(): Promise<DocumentResponseDTO[]> {
    const documents = await this.documentRepository.findAll();
    return documents.map(doc => this.toDTO(doc));
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
