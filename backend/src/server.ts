import cors from 'cors';
import 'dotenv/config';
import express, { Express } from 'express';
import path from 'path';
import { errorHandler } from './infra/http/middlewares/error-handler';
import { createRoutes } from './infra/http/routes';
import { FileUtils } from './shared/utils/file.utils';

class Server {
  private app: Express;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000');

    this.setupDirectories();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  private async setupDirectories(): Promise<void> {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';

    await FileUtils.ensureDirectory(path.join(uploadDir, 'original'));
    await FileUtils.ensureDirectory(path.join(uploadDir, 'standardized'));

    console.log('📁 Upload directories created');
  }

  private setupMiddlewares(): void {
    // CORS
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }));

    // Body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Static files (for serving uploaded files)
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.app.use('/files', express.static(uploadDir));

    console.log('✅ Middlewares configured');
  }

  private setupRoutes(): void {
    const routes = createRoutes();
    this.app.use('/api', routes);

    console.log('🛣️  Routes configured');
  }

  private setupErrorHandler(): void {
    this.app.use(errorHandler);
    console.log('🛡️  Error handler configured');
  }

  public async start(): Promise<void> {
    this.app.listen(this.port, () => {
      console.log('🚀 Server started!');
      console.log(`📍 Server running on port ${this.port}`);
      console.log(`🌐 API: http://localhost:${this.port}/api`);
      console.log(`💚 Health: http://localhost:${this.port}/api/health`);
      console.log('');
      console.log('📋 Available endpoints:');
      console.log('  POST   /api/documents/upload');
      console.log('  GET    /api/documents');
      console.log('  GET    /api/documents/:id');
      console.log('  POST   /api/documents/:id/standardize');
      console.log('  GET    /api/documents/:id/download/original');
      console.log('  GET    /api/documents/:id/download/standardized');
      console.log('');
      console.log(`📂 Upload directory: ${process.env.UPLOAD_DIR || './uploads'}`);
      console.log(`🗄️  Database: ${process.env.DATABASE_URL}`);
      console.log('');
    });
  }
}

// Start server
const server = new Server();
server.start().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
