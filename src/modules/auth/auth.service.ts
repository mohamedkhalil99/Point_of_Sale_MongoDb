import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SignInDto } from './auth.dto';
import { AdminModel } from '../admins/admins.schema';
import { CashierModel } from '../cashiers/cashier.schema';

const JWT_SECRET = process.env.JWT_KEY || 'your_secret_key';

export class AuthService {
  async signIn(dto: SignInDto) {
    // Try admin first
    let user = await AdminModel.findOne({ email: dto.email });
    let role = 'admin';

    // If not found as admin, try cashier
    if (!user) {
      user = await CashierModel.findOne({ email: dto.email });
      role = 'cashier';
    }

    if (!user) {
      throw Object.assign(new Error('Invalid email or password'), { status: 401 });
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw Object.assign(new Error('Invalid email or password'), { status: 401 });
    }

    const token = jwt.sign(
      { _id: user._id, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
      },
    };
  }
}