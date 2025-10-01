export enum FileTypeEnum {
  PDF = 'pdf',
  DOCX = 'docx'
}

export class FileType {
  private readonly value: FileTypeEnum;

  constructor(value: string) {
    const normalized = value.toLowerCase();
    if (!Object.values(FileTypeEnum).includes(normalized as FileTypeEnum)) {
      throw new Error(`Invalid file type: ${value}. Only PDF and DOCX are allowed.`);
    }
    this.value = normalized as FileTypeEnum;
  }

  public getValue(): FileTypeEnum {
    return this.value;
  }

  public isPDF(): boolean {
    return this.value === FileTypeEnum.PDF;
  }

  public isDOCX(): boolean {
    return this.value === FileTypeEnum.DOCX;
  }

  public toString(): string {
    return this.value;
  }
}
