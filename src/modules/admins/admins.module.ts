import { adminRouter } from './admins.controller';
import { AdminModel } from './admins.schema';
import { AdminService } from './admins.service';

export class AdminModule {
  public router = adminRouter;
  public service = new AdminService();
  public model = AdminModel;
}