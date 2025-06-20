import { CashierModel } from './cashier.schema';
import { CreateCashierDto, UpdateCashierDto } from './cashier.dto';
import bcrypt from 'bcryptjs';
import { ReceiptModel } from '../receipts/receipts.schema';

export class CashierService {
  // Create a new cashier
  async create(dto: CreateCashierDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const cashier = new CashierModel({
      ...dto,
      password: hashedPassword,
      role: 'cashier',
    });
    return await cashier.save();
  }

  // Get all cashiers with filters and pagination
  async findAllWithFilters(filters: any, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const cashiers = await CashierModel.find(filters)
      .populate('branch')
      .skip(skip)
      .limit(limit);

    const total = await CashierModel.countDocuments(filters);

    return {
      total,
      page,
      limit,
      data: cashiers,
    };
  }

  // Get cashier by ID
  async findOne(id: string) {
    return await CashierModel.findById(id).populate('branch');
  }

  // Update cashier
  async update(id: string, dto: UpdateCashierDto) {
    return await CashierModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).populate('branch');
  }

  // Delete cashier
  async delete(id: string) {
    return await CashierModel.findByIdAndDelete(id);
  }

  // Get top 3 cashiers by number of receipts
  async getTop3Cashiers() {
    const result = await ReceiptModel.aggregate([
      {
        $group: {
          _id: '$cashier',
          purchaseCount: { $sum: 1 },
        },
      },
      { $sort: { purchaseCount: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'cashiers',
          localField: '_id',
          foreignField: '_id',
          as: 'cashier',
        },
      },
      { $unwind: '$cashier' },
      {
        $project: {
          _id: '$cashier._id',
          name: '$cashier.name',
          email: '$cashier.email',
          branch: '$cashier.branch',
          purchaseCount: 1,
        },
      },
    ]);

    return result;
  }
}