export interface ImageStorageService {
  uploadImage(buffer: Buffer): Promise<string>;
  deleteImage(publicId: string): Promise<void>;
}
