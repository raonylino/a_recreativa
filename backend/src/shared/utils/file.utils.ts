import fs from 'fs';
import path from 'path';

export class FileUtils {
  static async ensureDirectory(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  static getFileExtension(filename: string): string {
    return path.extname(filename).toLowerCase().replace('.', '');
  }

  static async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  static async deleteFile(filePath: string): Promise<void> {
    try {
      if (await this.fileExists(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }
}
