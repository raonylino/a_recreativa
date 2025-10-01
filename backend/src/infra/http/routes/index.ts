import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller';
import { createDocumentRoutes } from './document.routes';

// Dependencies
import { GetDocumentUseCase } from '@core/application/use-cases/get-document.usecase';
import { ListDocumentsUseCase } from '@core/application/use-cases/list-document.usecase';
import { StandardizeDocumentUseCase } from '@core/application/use-cases/standardize-document.usecase';
import { UploadDocumentUseCase } from '@core/application/use-cases/upload-document.usecase';
import { prisma } from '@infra/database/prisma.client';
import { PrismaDocumentRepository } from '@infra/database/repositories/prisma-document.repository';
import { StandardizedPDFGenerator } from '@infra/services/pdf-generator/standardized-pdf-generator';

export function createRoutes(): Router {
  const router = Router();

  // Initialize repository
  const documentRepository = new PrismaDocumentRepository(prisma);

  // Initialize services
  const pdfGenerator = new StandardizedPDFGenerator();

  // Initialize use cases
  const uploadDocumentUseCase = new UploadDocumentUseCase(documentRepository);
  const getDocumentUseCase = new GetDocumentUseCase(documentRepository);
  const listDocumentsUseCase = new ListDocumentsUseCase(documentRepository);
  const standardizeDocumentUseCase = new StandardizeDocumentUseCase(
    documentRepository,
    pdfGenerator
  );

  // Initialize controller
  const documentController = new DocumentController(
    uploadDocumentUseCase,
    getDocumentUseCase,
    listDocumentsUseCase,
    standardizeDocumentUseCase
  );

  // Health check
  router.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  });

  // Document routes
  router.use('/documents', createDocumentRoutes(documentController));

  return router;
}
