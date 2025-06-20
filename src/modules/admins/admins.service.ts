import { CreateAdminDto, UpdateAdminDto } from './admins.dto';
import { AuthService } from '../../guards/guards.service';
import { AdminDocument, AdminModel } from './admins.schema';

export class AdminService {
  
  //Create New Admin
  async create(dto: CreateAdminDto): Promise<AdminDocument> {
    const existing = await AdminModel.findOne({ email: dto.email });
    if (existing) throw new Error('Email already exists');

    const hashedPassword = await AuthService.hashPassword(dto.password);
    const newAdmin = new AdminModel({ ...dto, password: hashedPassword });
    return newAdmin.save();
  }

  //Get All Admins
  async findAll(): Promise<AdminDocument[]> {
    return AdminModel.find().select('-password');
  }

  //Get One Admin
  async findOne(id: string): Promise<AdminDocument | null> {
    return AdminModel.findById(id).select('-password');
  }

  //Update Admin
  async update(id: string, dto: UpdateAdminDto): Promise<AdminDocument | null> {
    const updateData: Partial<UpdateAdminDto> = { ...dto };

    if (dto.password) {
      updateData.password = await AuthService.hashPassword(dto.password);
    }

    return AdminModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');
  }

  //Delete Admin
  async delete(id: string): Promise<AdminDocument | null> {
    return AdminModel.findByIdAndDelete(id);
  }
}