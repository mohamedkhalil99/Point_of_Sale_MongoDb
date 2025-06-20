import { IsString, IsEmail, IsNotEmpty, IsMongoId, MinLength, IsOptional } from 'class-validator';

export class CreateCashierDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsMongoId()
  @IsNotEmpty()
  branch: string;
}

export class UpdateCashierDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;

  @IsMongoId()
  @IsOptional()
  branch?: string;
}