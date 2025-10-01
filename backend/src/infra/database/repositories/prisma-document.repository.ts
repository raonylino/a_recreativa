import { Document } from '@core/domain/entities/document.entity';
import { IDocumentRepository } from '@core/domain/repositories/id-document-repository.interface';
import { DocumentId } from '@core/domain/value-objects/document-id.vo';
import { FileType } from '@core/domain/value-objects/file-type.vo';
import { LessonPlanData } from '@core/domain/value-objects/lesson-plan-data.vo';
import { PrismaClient } from '@prisma/client';

export class PrismaDocumentRepository implements IDocumentRepository {
  constructor(private prisma: PrismaClient) { }

  async save(document: Document): Promise<void> {
    const lessonPlanData = document.getLessonPlanData();

    await this.prisma.document.create({
      data: {
        id: document.getId().getValue(),
        title: document.getTitle(),
        description: document.getDescription(),
        originalFileName: document.getOriginalFileName(),
        originalFilePath: document.getOriginalFilePath(),
        originalFileType: document.getOriginalFileType().toString(),
        objectives: lessonPlanData ? JSON.stringify(lessonPlanData.getObjectives()) : null,
        activities: lessonPlanData ? JSON.stringify(lessonPlanData.getActivities()) : null,
        evaluation: lessonPlanData?.getEvaluation(),
        resources: lessonPlanData?.getResources(),
        duration: lessonPlanData?.getDuration(),
        targetAudience: lessonPlanData?.getTargetAudience(),
        subject: lessonPlanData?.getSubject(),
        standardizedFilePath: document.getStandardizedFilePath(),
        standardizedAt: document.getStandardizedAt(),
        createdAt: document.getCreatedAt(),
        updatedAt: document.getUpdatedAt()
      }
    });
  }

  async findById(id: DocumentId): Promise<Document | null> {
    const data = await this.prisma.document.findUnique({
      where: { id: id.getValue() }
    });

    if (!data) return null;

    return this.toDomain(data);
  }

  async findAll(): Promise<Document[]> {
    const documents = await this.prisma.document.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return documents.map((doc: any) => this.toDomain(doc));
  }

  async update(document: Document): Promise<void> {
    const lessonPlanData = document.getLessonPlanData();

    await this.prisma.document.update({
      where: { id: document.getId().getValue() },
      data: {
        title: document.getTitle(),
        description: document.getDescription(),
        objectives: lessonPlanData ? JSON.stringify(lessonPlanData.getObjectives()) : null,
        activities: lessonPlanData ? JSON.stringify(lessonPlanData.getActivities()) : null,
        evaluation: lessonPlanData?.getEvaluation(),
        resources: lessonPlanData?.getResources(),
        duration: lessonPlanData?.getDuration(),
        targetAudience: lessonPlanData?.getTargetAudience(),
        subject: lessonPlanData?.getSubject(),
        standardizedFilePath: document.getStandardizedFilePath(),
        standardizedAt: document.getStandardizedAt(),
        updatedAt: document.getUpdatedAt()
      }
    });
  }

  async delete(id: DocumentId): Promise<void> {
    await this.prisma.document.delete({
      where: { id: id.getValue() }
    });
  }

  private toDomain(data: any): Document {
    let lessonPlanData: LessonPlanData | undefined;

    if (data.objectives || data.activities || data.evaluation || data.resources) {
      lessonPlanData = new LessonPlanData({
        objectives: data.objectives ? JSON.parse(data.objectives) : undefined,
        activities: data.activities ? JSON.parse(data.activities) : undefined,
        evaluation: data.evaluation || undefined,
        resources: data.resources || undefined,
        duration: data.duration || undefined,
        targetAudience: data.targetAudience || undefined,
        subject: data.subject || undefined
      });
    }

    return Document.reconstitute({
      id: new DocumentId(data.id),
      title: data.title,
      description: data.description || undefined,
      originalFileName: data.originalFileName,
      originalFilePath: data.originalFilePath,
      originalFileType: new FileType(data.originalFileType),
      lessonPlanData,
      standardizedFilePath: data.standardizedFilePath || undefined,
      standardizedAt: data.standardizedAt || undefined,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    });
  }
}
