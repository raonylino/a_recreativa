import { GetDocumentUseCase } from '@core/application/use-cases/get-document.usecase';
import { ListDocumentsUseCase } from '@core/application/use-cases/list-document.usecase';
import { StandardizeDocumentUseCase } from '@core/application/use-cases/standardize-document.usecase';
import { UploadDocumentUseCase } from '@core/application/use-cases/upload-document.usecase';
import { AppError } from '@shared/errors/app.error';
import { NextFunction, Request, Response } from 'express';
import path from 'path';

export class DocumentController {
  constructor(
    private uploadDocumentUseCase: UploadDocumentUseCase,
    private getDocumentUseCase: GetDocumentUseCase,
    private listDocumentsUseCase: ListDocumentsUseCase,
    private standardizeDocumentUseCase: StandardizeDocumentUseCase
  ) { }

  async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('File is required', 400);
      }

      const { title, description } = req.body;

      if (!title) {
        throw new AppError('Title is required', 400);
      }

      const result = await this.uploadDocumentUseCase.execute({
        file: {
          originalname: req.file.originalname,
          path: req.file.path,
          mimetype: req.file.mimetype
        },
        title,
        description
      });

      res.status(201).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const result = await this.getDocumentUseCase.execute(id);

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.listDocumentsUseCase.execute();

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async standardize(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { lessonPlanData } = req.body;

      if (!lessonPlanData) {
        throw new AppError('Lesson plan data is required', 400);
      }

      const result = await this.standardizeDocumentUseCase.execute({
        documentId: id,
        lessonPlanData
      });

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async downloadOriginal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const document = await this.getDocumentUseCase.execute(id);

      const filePath = path.resolve(document.originalFilePath);

      res.download(filePath, document.originalFileName, (err) => {
        if (err) {
          next(new AppError('File not found', 404));
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async downloadStandardized(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const document = await this.getDocumentUseCase.execute(id);

      if (!document.standardizedFilePath) {
        throw new AppError('Standardized document not found', 404);
      }

      const filePath = path.resolve(document.standardizedFilePath);
      const fileName = `${document.title}-padronizado.pdf`;

      res.download(filePath, fileName, (err) => {
        if (err) {
          next(new AppError('File not found', 404));
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
