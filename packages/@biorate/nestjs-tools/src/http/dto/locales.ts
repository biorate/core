import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ILocalesDTO } from '../../../interfaces';

/**
 * @description DTO for GET /locales/:lang/:namespace.
 */
export class GetLocalesDTO implements ILocalesDTO {
  @IsString()
  @ApiProperty({ type: String, required: true })
  lang: string;

  @IsString()
  @ApiProperty({ type: String, required: true })
  namespace: string;
}

/**
 * @description DTO for POST /locales/:lang/:namespace.
 */
export class PostLocalesDTO extends GetLocalesDTO {}
