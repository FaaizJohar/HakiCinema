export interface StorageMetadata {
  size: number;
  type: string;
  lastModified: Date;
}

export interface StorageProvider {
  upload(file: File | Buffer, path: string, type: string): Promise<string>;
  delete(path: string): Promise<boolean>;
  getUrl(path: string): Promise<string>;
  exists(path: string): Promise<boolean>;
  metadata(path: string): Promise<StorageMetadata | null>;
}

export class MockStorageProvider implements StorageProvider {
  async upload(file: File | Buffer, path: string, type: string): Promise<string> {
    console.log(`[MockStorage] Uploading ${path}`);
    return `https://mock-storage.example.com/${path}`;
  }

  async delete(path: string): Promise<boolean> {
    console.log(`[MockStorage] Deleting ${path}`);
    return true;
  }

  async getUrl(path: string): Promise<string> {
    return `https://mock-storage.example.com/${path}`;
  }

  async exists(path: string): Promise<boolean> {
    return true;
  }

  async metadata(path: string): Promise<StorageMetadata | null> {
    return {
      size: 1024,
      type: "image/jpeg",
      lastModified: new Date(),
    };
  }
}

// In production, this would conditionally export S3StorageProvider or R2StorageProvider
export const storageService: StorageProvider = new MockStorageProvider();
