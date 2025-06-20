import { ProductModel } from './products.schema';
import { CreateProductDto, UpdateProductDto } from './products.dto';

export class ProductService {
  // Create product
  async create(dto: CreateProductDto) {
    const product = new ProductModel(dto);
    return await product.save();
  }

  // Get all with filters + pagination
  async findAllWithPagination(filters: any, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const data = await ProductModel.find(filters).skip(skip).limit(limit);
    const total = await ProductModel.countDocuments(filters);

    return {
      total,
      page,
      limit,
      data,
    };
  }

  // Get product by ID
  async findOne(id: string) {
    return await ProductModel.findById(id);
  }

  // Update product
  async update(id: string, dto: UpdateProductDto) {
    return await ProductModel.findByIdAndUpdate(id, dto, { new: true });
  }

  // Delete product
  async delete(id: string) {
    return await ProductModel.findByIdAndDelete(id);
  }
}