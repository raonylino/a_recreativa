import { Document } from '@core/domain/entities/document.entity';
import { IDocumentRepository } from '@core/domain/repositories/id-document-repository.interface';
import { AppError } from '@shared/errors/app.error';
import { DocumentResponseDTO } from '../dtos/document-response.dto';
import { UploadDocumentDTO } from '../dtos/upload-document.dto';

export class UploadDocumentUseCase {
  constructor(private documentRepository: IDocumentRepository) { }

  async execute(data: UploadDocumentDTO): Promise<DocumentResponseDTO> {
    const { file, title, description } = data;

    // Validate file type
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    if (!fileExtension || !['pdf', 'docx'].includes(fileExtension)) {
      throw new AppError('Only PDF and DOCX files are allowed', 400);
    }

    // Create domain entity
    const document = Document.create(
      title,
      file.originalname,
      file.path,
      fileExtension,
      description
    );

    // Save to repository
    await this.documentRepository.save(document);

    // Return DTO
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
