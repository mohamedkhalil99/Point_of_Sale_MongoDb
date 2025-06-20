import { ReceiptModel } from './receipts.schema';
import { CreateReceiptDto } from './receipts.dto';
import mongoose from 'mongoose';
import { CashierModel } from '../cashiers/cashier.schema';
import { ProductModel } from '../products/products.schema';

export class ReceiptService {
  // Create Receipt
  async create(cashierId: string, dto: CreateReceiptDto) {
    // Check for Cashier
    const cashier = await CashierModel.findById(cashierId).populate('branch');
    if (!cashier) throw new Error('Cashier not found');

    let total = 0;
    const productItems = [];

    for (const item of dto.products) {
      const product = await ProductModel.findById(item.product);
      if (!product) throw new Error(`Product not found: ${item.product}`);

      const unitPrice = product.price;
      const lineTotal = unitPrice * item.quantity;

      productItems.push({
        product: product._id,
        quantity: item.quantity,
        unitPrice,
      });

      total += lineTotal;
    }

    const receipt = new ReceiptModel({
      cashier: cashier._id,
      branch: cashier.branch,
      products: productItems,
      totalPrice: total,
    });

    return await receipt.save();
  }

  // Get Receipts + pagination
  async findAllWithFilters(filters: any, page: number, limit: number) {
    const skip = (page - 1) * limit;

    // Get Receipts + aggregation
    if (filters.productName || filters.category) {
      const match: any = {
        ...(filters.cashier ? { cashier: new mongoose.Types.ObjectId(filters.cashier) } : {}),
        ...(filters.branch ? { branch: new mongoose.Types.ObjectId(filters.branch) } : {}),
        ...(filters.createdAt ? { createdAt: filters.createdAt } : {}),
        ...(filters.totalPrice ? { totalPrice: filters.totalPrice } : {}),
      };

      const pipeline = [
        { $match: match },
        {
          $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        {
          $match: {
            ...(filters.productName ? { 'productDetails.name': { $regex: filters.productName, $options: 'i' } } : {}),
            ...(filters.category ? { 'productDetails.category': { $regex: filters.category, $options: 'i' } } : {}),
          },
        },
        { $skip: skip },
        { $limit: limit },
      ];

      const data = await ReceiptModel.aggregate(pipeline);
      const total = (await ReceiptModel.aggregate([...pipeline.slice(0, -2), { $count: 'count' }]))[0]?.count || 0;

      return {
        total,
        page,
        limit,
        data,
      };
    }

    // Normal Filtering
    const cleanFilters = { ...filters };
    delete cleanFilters.productName;
    delete cleanFilters.category;

    const data = await ReceiptModel.find(cleanFilters)
      .populate('cashier')
      .populate('branch')
      .populate('products.product')
      .skip(skip)
      .limit(limit);

    const total = await ReceiptModel.countDocuments(cleanFilters);

    return {
      total,
      page,
      limit,
      data,
    };
  }
}