export class DocumentId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('DocumentId cannot be empty');
    }
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: DocumentId): boolean {
    return this.value === other.value;
  }
}
