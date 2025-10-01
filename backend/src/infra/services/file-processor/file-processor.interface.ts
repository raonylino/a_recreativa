export interface ExtractedData {
  text: string;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
  };
}

export interface IFileProcessor {
  process(filePath: string): Promise<ExtractedData>;
  supports(fileType: string): boolean;
}
