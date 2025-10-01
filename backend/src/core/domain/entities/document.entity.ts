import { DocumentId } from '../value-objects/document-id.vo';
import { FileType } from '../value-objects/file-type.vo';
import { LessonPlanData, LessonPlanDataProps } from '../value-objects/lesson-plan-data.vo';

export interface DocumentProps {
  id: DocumentId;
  title: string;
  description?: string;
  originalFileName: string;
  originalFilePath: string;
  originalFileType: FileType;
  lessonPlanData?: LessonPlanData;
  standardizedFilePath?: string;
  standardizedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Document {
  private props: DocumentProps;

  constructor(props: DocumentProps) {
    this.validate(props);
    this.props = props;
  }

  private validate(props: DocumentProps): void {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Document title is required');
    }
    if (!props.originalFileName || props.originalFileName.trim().length === 0) {
      throw new Error('Original file name is required');
    }
    if (!props.originalFilePath || props.originalFilePath.trim().length === 0) {
      throw new Error('Original file path is required');
    }
  }

  // Getters
  public getId(): DocumentId {
    return this.props.id;
  }

  public getTitle(): string {
    return this.props.title;
  }

  public getDescription(): string | undefined {
    return this.props.description;
  }

  public getOriginalFileName(): string {
    return this.props.originalFileName;
  }

  public getOriginalFilePath(): string {
    return this.props.originalFilePath;
  }

  public getOriginalFileType(): FileType {
    return this.props.originalFileType;
  }

  public getLessonPlanData(): LessonPlanData | undefined {
    return this.props.lessonPlanData;
  }

  public getStandardizedFilePath(): string | undefined {
    return this.props.standardizedFilePath;
  }

  public getStandardizedAt(): Date | undefined {
    return this.props.standardizedAt;
  }

  public getCreatedAt(): Date {
    return this.props.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business methods
  public isStandardized(): boolean {
    return !!this.props.standardizedFilePath;
  }

  public hasLessonPlanData(): boolean {
    return !!this.props.lessonPlanData && !this.props.lessonPlanData.isEmpty();
  }

  public updateLessonPlanData(data: LessonPlanDataProps): void {
    this.props.lessonPlanData = new LessonPlanData(data);
    this.props.updatedAt = new Date();
  }

  public markAsStandardized(filePath: string): void {
    if (!filePath || filePath.trim().length === 0) {
      throw new Error('Standardized file path is required');
    }
    this.props.standardizedFilePath = filePath;
    this.props.standardizedAt = new Date();
    this.props.updatedAt = new Date();
  }

  public updateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
    this.props.title = title;
    this.props.updatedAt = new Date();
  }

  public updateDescription(description: string): void {
    this.props.description = description;
    this.props.updatedAt = new Date();
  }

  // Factory method
  public static create(
    title: string,
    originalFileName: string,
    originalFilePath: string,
    fileType: string,
    description?: string
  ): Document {
    return new Document({
      id: new DocumentId(this.generateId()),
      title,
      description,
      originalFileName,
      originalFilePath,
      originalFileType: new FileType(fileType),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Reconstitute from persistence
  public static reconstitute(props: DocumentProps): Document {
    return new Document(props);
  }
}
