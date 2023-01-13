import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Product title', nullable: false, minLength: 1 })
  @IsString()
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @ApiProperty()
  price?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  slug?: string;

  @IsInt()
  @IsOptional()
  @IsPositive()
  @ApiProperty()
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  @ApiProperty()
  sizes: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiProperty()
  tags?: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiProperty()
  images?: string[];

  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;
}
