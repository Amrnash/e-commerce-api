import cloudinary from "../config/cloudinary.js";
import { ImageStorageService } from "../interfaces/ImageStorage.js";

export class CloudinaryImageStorageService implements ImageStorageService {
  uploadImage(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          format: "jpg",
          folder: "e-commerce-api",
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            if (result) resolve(result.secure_url);
          }
        }
      );

      uploadStream.end(buffer);
    });
  }

  deleteImage(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (err: any, res) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
