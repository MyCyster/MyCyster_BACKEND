import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { CloudinaryService } from './cloudinary.service';

@Module({
  controllers: [ImageController],
  providers: [CloudinaryService],
})
export class ImageModule {}
