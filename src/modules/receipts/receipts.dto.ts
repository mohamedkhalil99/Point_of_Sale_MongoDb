import { IsArray, IsMongoId, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ReceiptProductDto {
  @IsMongoId()
  product: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateReceiptDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceiptProductDto)
  products: ReceiptProductDto[];
}