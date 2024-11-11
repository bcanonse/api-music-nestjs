import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSongDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public readonly title: string;

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  public readonly artists: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  public readonly releasedDate: Date;

  @ApiProperty({ type: Date })
  @IsMilitaryTime()
  @IsNotEmpty()
  public readonly duration: Date;

  @ApiProperty({ description: 'Lyrics of the song' })
  @IsString()
  @IsOptional()
  public readonly lyrics: string;
}
