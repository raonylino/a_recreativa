import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller';
import { uploadMiddleware } from '../middlewares/upload';

export function createDocumentRoutes(controller: DocumentController): Router {
  const router = Router();

  // Upload document
  router.post(
    '/upload',
    uploadMiddleware.single('file'),
    (req, res, next) => controller.upload(req, res, next)
  );

  // List all documents
  router.get(
    '/',
    (req, res, next) => controller.list(req, res, next)
  );

  // Get document by ID
  router.get(
    '/:id',
    (req, res, next) => controller.getById(req, res, next)
  );

  // Standardize document (generate PDF)
  router.post(
    '/:id/standardize',
    (req, res, next) => controller.standardize(req, res, next)
  );

  // Download original file
  router.get(
    '/:id/download/original',
    (req, res, next) => controller.downloadOriginal(req, res, next)
  );

  // Download standardized PDF
  router.get(
    '/:id/download/standardized',
    (req, res, next) => controller.downloadStandardized(req, res, next)
  );

  return router;
}
