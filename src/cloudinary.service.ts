

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File) {
    try {
      if (!file.buffer && !file.path) {
        throw new Error('File buffer and path are undefined');
      }

      const uploadOptions = {
        folder: 'MyCyster', // Optional: specify folder on Cloudinary
      };

      let result;
      if (file.buffer) {
        result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, uploadOptions);
      } else if (file.path) {
        result = await cloudinary.uploader.upload(file.path, uploadOptions);
      } else {
        throw new Error('No valid file data found');
      }

      return {
        public_id: result.public_id,
        url: result.url,
        secure_url: result.secure_url

      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Error uploading image to Cloudinary');
    }
  }
}