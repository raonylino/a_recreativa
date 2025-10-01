import { Document } from '@core/domain/entities/document.entity';
import { FileUtils } from '@shared/utils/file.utils';
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { IPDFGenerator } from './pdf-generator.interface';

export class StandardizedPDFGenerator implements IPDFGenerator {
  async generate(document: Document, outputPath: string): Promise<void> {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    await FileUtils.ensureDirectory(outputDir);

    // Create PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a page
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();

    // Load fonts
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Colors
    const primaryColor = rgb(0.2, 0.4, 0.8);
    const textColor = rgb(0.1, 0.1, 0.1);
    const lightGray = rgb(0.9, 0.9, 0.9);

    let yPosition = height - 60;

    // Title - Header
    page.drawRectangle({
      x: 0,
      y: yPosition - 10,
      width: width,
      height: 60,
      color: primaryColor,
    });

    page.drawText('PLANO DE AULA PADRONIZADO', {
      x: 50,
      y: yPosition + 10,
      size: 24,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    yPosition -= 80;

    // Document Title
    page.drawText(document.getTitle(), {
      x: 50,
      y: yPosition,
      size: 18,
      font: boldFont,
      color: primaryColor,
    });

    yPosition -= 30;

    // Description
    if (document.getDescription()) {
      page.drawText('Descrição:', {
        x: 50,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: textColor,
      });

      yPosition -= 20;

      const description = document.getDescription() || '';
      const descLines = this.wrapText(description, 80);

      for (const line of descLines.slice(0, 2)) {
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: 10,
          font: regularFont,
          color: textColor,
        });
        yPosition -= 15;
      }

      yPosition -= 10;
    }

    const lessonPlanData = document.getLessonPlanData();

    if (lessonPlanData) {
      // Subject
      if (lessonPlanData.getSubject()) {
        yPosition = this.addSection(
          page,
          'Disciplina:',
          lessonPlanData.getSubject()!,
          yPosition,
          boldFont,
          regularFont,
          primaryColor,
          textColor
        );
      }

      // Target Audience
      if (lessonPlanData.getTargetAudience()) {
        yPosition = this.addSection(
          page,
          'Público-Alvo:',
          lessonPlanData.getTargetAudience()!,
          yPosition,
          boldFont,
          regularFont,
          primaryColor,
          textColor
        );
      }

      // Duration
      if (lessonPlanData.getDuration()) {
        yPosition = this.addSection(
          page,
          'Duração:',
          lessonPlanData.getDuration()!,
          yPosition,
          boldFont,
          regularFont,
          primaryColor,
          textColor
        );
      }

      // Objectives
      const objectives = lessonPlanData.getObjectives();
      if (objectives.length > 0) {
        page.drawText('Objetivos:', {
          x: 50,
          y: yPosition,
          size: 14,
          font: boldFont,
          color: primaryColor,
        });

        yPosition -= 20;

        objectives.slice(0, 3).forEach((obj: any, index: number) => {
          const text = `${index + 1}. ${obj}`;
          const lines = this.wrapText(text, 75);

          lines.forEach(line => {
            if (yPosition < 80) return;
            page.drawText(line, {
              x: 60,
              y: yPosition,
              size: 10,
              font: regularFont,
              color: textColor,
            });
            yPosition -= 15;
          });
        });

        yPosition -= 10;
      }

      // Activities
      const activities = lessonPlanData.getActivities();
      if (activities.length > 0 && yPosition > 150) {
        page.drawText('Atividades:', {
          x: 50,
          y: yPosition,
          size: 14,
          font: boldFont,
          color: primaryColor,
        });

        yPosition -= 20;

        activities.slice(0, 3).forEach((activity: any, index: number) => {
          const text = `${index + 1}. ${activity}`;
          const lines = this.wrapText(text, 75);

          lines.forEach(line => {
            if (yPosition < 80) return;
            page.drawText(line, {
              x: 60,
              y: yPosition,
              size: 10,
              font: regularFont,
              color: textColor,
            });
            yPosition -= 15;
          });
        });

        yPosition -= 10;
      }

      // Resources
      if (lessonPlanData.getResources() && yPosition > 100) {
        yPosition = this.addSection(
          page,
          'Recursos:',
          lessonPlanData.getResources()!,
          yPosition,
          boldFont,
          regularFont,
          primaryColor,
          textColor
        );
      }

      // Evaluation
      if (lessonPlanData.getEvaluation() && yPosition > 100) {
        yPosition = this.addSection(
          page,
          'Avaliação:',
          lessonPlanData.getEvaluation()!,
          yPosition,
          boldFont,
          regularFont,
          primaryColor,
          textColor
        );
      }
    }

    // Footer
    page.drawLine({
      start: { x: 50, y: 60 },
      end: { x: width - 50, y: 60 },
      thickness: 1,
      color: lightGray,
    });

    const footerText = `Gerado em: ${new Date().toLocaleDateString('pt-BR')} - Sistema de Planos de Aula`;
    page.drawText(footerText, {
      x: 50,
      y: 40,
      size: 8,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    await fs.promises.writeFile(outputPath, pdfBytes);
  }

  private addSection(
    page: any,
    title: string,
    content: string,
    yPosition: number,
    boldFont: any,
    regularFont: any,
    titleColor: any,
    textColor: any
  ): number {
    page.drawText(title, {
      x: 50,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: titleColor,
    });

    yPosition -= 18;

    const lines = this.wrapText(content, 80);
    lines.slice(0, 2).forEach(line => {
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: 10,
        font: regularFont,
        color: textColor,
      });
      yPosition -= 15;
    });

    return yPosition - 10;
  }

  private wrapText(text: string, maxChars: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;

      if (testLine.length <= maxChars) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);

    return lines;
  }
}
