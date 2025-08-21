import { IsEmail, IsString, MinLength, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {

  @ApiProperty({ example: 'Teclado', required: true })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'Teclado es de...' })
  @IsString()
  @MinLength(3)
  description: string


  @ApiProperty({ example: '10.000', required: true })
  @IsInt()
  @IsNotEmpty()
  price: number


  @ApiProperty({ example: '50', required: true })
  @IsInt()
  @IsNotEmpty()
  stock: number


  @ApiProperty({ example: 'Apple' })
  @IsString()
  @MinLength(3)
  brand: string

  @ApiProperty({ example: 'clxxx123456', required: false })
  @IsString()
  @IsOptional()
  categoryId?: string

}
