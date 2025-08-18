import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(3)
  name: string

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: '1225665' })
  @IsString()
  phone: string

  @ApiProperty({ example: 'cliente' })
  @IsString()
  rol: string
}



