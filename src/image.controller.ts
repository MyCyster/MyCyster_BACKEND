
import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    HttpStatus,
    HttpException,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { CloudinaryService } from './cloudinary.service';
  import {
    ApiBadRequestResponse,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
  } from '@nestjs/swagger';
  
  @ApiTags('Image')
  @Controller('image')
  export class ImageController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload an image to Cloudinary' })  
    @ApiCreatedResponse({ description: 'Image uploaded to Cloudinary successfully'})
    @ApiBadRequestResponse({ description: 'Invalid file format'})
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
      console.log('Uploaded file:', file); // Debugging
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
  
      try {
        const result = await this.cloudinaryService.uploadImage(file);
        console.log('Cloudinary upload result:', result); // Debugging
        return {
          message: 'Image uploaded successfully',
          data: result,
        };
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new HttpException(
          error.message || 'Failed to upload image',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }