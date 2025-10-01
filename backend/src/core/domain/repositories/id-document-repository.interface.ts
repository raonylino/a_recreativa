import { Document } from '../entities/document.entity';
import { DocumentId } from '../value-objects/document-id.vo';

export interface IDocumentRepository {
  save(document: Document): Promise<void>;
  findById(id: DocumentId): Promise<Document | null>;
  findAll(): Promise<Document[]>;
  update(document: Document): Promise<void>;
  delete(id: DocumentId): Promise<void>;
}
