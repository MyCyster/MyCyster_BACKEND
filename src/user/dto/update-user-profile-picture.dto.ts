import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateImageDto{

      @ApiPropertyOptional({
        description: 'Profile photo image url',
      })
      @IsOptional()
      @IsString()
      image_url?: string;
    
}