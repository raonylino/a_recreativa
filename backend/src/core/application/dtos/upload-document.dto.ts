export interface UploadDocumentDTO {
  file: {
    originalname: string;
    path: string;
    mimetype: string;
  };
  title: string;
  description?: string;
}
