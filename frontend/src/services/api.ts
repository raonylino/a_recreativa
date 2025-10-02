import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipos
export enum DocumentStatus {
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  STRUCTURED = 'STRUCTURED',
  STANDARDIZED = 'STANDARDIZED',
  ERROR = 'ERROR'
}

export interface StructuredData {
  title?: string;
  subject?: string;
  grade?: string;
  duration?: string;
  objectives?: string[];
  content?: string[];
  methodology?: string;
  resources?: string[];
  evaluation?: string;
  references?: string;
}

export interface Document {
  id: string;
  originalFileName: string;
  originalFilePath: string;
  originalMimeType: string;
  fileSize: number;
  status: DocumentStatus;
  structuredData?: StructuredData;
  standardizedFilePath?: string;
  standardizedGeneratedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Funções da API
export const documentService = {
  // Upload de documento
  upload: async (file: File): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<Document>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Listar todos os documentos
  list: async (): Promise<Document[]> => {
    console.log("requisitando todos os documentos para /docuements")
    const { data } = await api.get('/documents');
    return data.data;
  },

  // Buscar documento por ID
  getById: async (id: string): Promise<Document> => {
    const { data } = await api.get<Document>(`/documents/${id}`);
    return data;
  },

  // Salvar dados estruturados
  saveStructuredData: async (id: string, structuredData: StructuredData): Promise<Document> => {
    const { data } = await api.put<Document>(`/documents/${id}/structured-data`, structuredData);
    return data;
  },

  // Gerar PDF padronizado
  generateStandardized: async (id: string): Promise<Document> => {
    const { data } = await api.post<Document>(`/documents/${id}/standardize`);
    return data;
  },

  // Download do arquivo original
  downloadOriginal: (id: string): string => {
    return `${api.defaults.baseURL}/documents/${id}/download/original`;
  },

  // Download do PDF padronizado
  downloadStandardized: (id: string): string => {
    return `${api.defaults.baseURL}/documents/${id}/download/standardized`;
  },

  // Preview do documento (iframe)
  previewOriginal: (id: string): string => {
    return `${api.defaults.baseURL}/documents/${id}/preview`;
  },
};
