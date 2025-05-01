import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ILocalesDTO } from '../../../../../interfaces';

export class GetLocalesDTO implements ILocalesDTO {
  @IsString()
  @ApiProperty({ type: String, required: true })
  lang: string;

  @IsString()
  @ApiProperty({ type: String, required: true })
  namespace: string;
}

export class PostLocalesDTO extends GetLocalesDTO {}
