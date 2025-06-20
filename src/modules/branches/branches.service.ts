import { BranchModel } from './branches.schema';
import { CreateBranchDto, UpdateBranchDto } from './branches.dto';
import { CashierModel } from '../cashiers/cashier.schema';

export class BranchService {
  // Create new branch
  async create(dto: CreateBranchDto) {
    const branch = new BranchModel(dto);
    return await branch.save();
  }

  // Get all branches with filters and pagination
  async findAllWithFilters(filters: any, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const data = await BranchModel.find(filters).skip(skip).limit(limit);
    const total = await BranchModel.countDocuments(filters);

    return {
      total,
      page,
      limit,
      data,
    };
  }

  // Get branch by ID
  async findOne(id: string) {
    return await BranchModel.findById(id);
  }

  // Update branch
  async update(id: string, dto: UpdateBranchDto) {
    return await BranchModel.findByIdAndUpdate(id, dto, { new: true });
  }

  // Delete branch only if no cashiers exist
  async deleteIfNoCashiers(branchId: string): Promise<'DELETED' | 'NOT_FOUND' | 'HAS_CASHIERS'> {
    const branch = await BranchModel.findById(branchId);
    if (!branch) return 'NOT_FOUND';

    const cashierCount = await CashierModel.countDocuments({ branch: branchId });
    if (cashierCount > 0) return 'HAS_CASHIERS';

    await BranchModel.findByIdAndDelete(branchId);
    return 'DELETED';
  }
}