export interface StandardizeDocumentDTO {
  documentId: string;
  lessonPlanData: {
    objectives?: string[];
    activities?: string[];
    evaluation?: string;
    resources?: string;
    duration?: string;
    targetAudience?: string;
    subject?: string;
  };
}
