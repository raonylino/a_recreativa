export interface DocumentResponseDTO {
  id: string;
  title: string;
  description?: string;
  originalFileName: string;
  originalFilePath: string;
  originalFileType: string;
  lessonPlanData?: {
    objectives?: string[];
    activities?: string[];
    evaluation?: string;
    resources?: string;
    duration?: string;
    targetAudience?: string;
    subject?: string;
  };
  standardizedFilePath?: string;
  standardizedAt?: Date;
  isStandardized: boolean;
  hasLessonPlanData: boolean;
  createdAt: Date;
  updatedAt: Date;
}
