import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetLocalesDTO {
  @IsString()
  @ApiProperty({ type: String, required: true })
  lang: string;

  @IsString()
  @ApiProperty({ type: String, required: true })
  namespace: string;
}

export class PostLocalesDTO extends GetLocalesDTO {}
