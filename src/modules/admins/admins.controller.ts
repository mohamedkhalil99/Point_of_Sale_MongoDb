import { Router, Request, Response } from 'express';
import { CreateAdminDto, UpdateAdminDto } from './admins.dto';
import { authenticate, authorize } from '../../guards/guards.middleware';
import { AdminService } from './admins.service';

const adminRouter = Router();
const adminService = new AdminService();

// Desc: Admin can Create a new Admin
// Route: POST /admins
// Access: Private (admin only)
adminRouter.post('/', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const dto: CreateAdminDto = req.body;
    const newAdmin = await adminService.create(dto);
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin can Get All Admins
// Route: GET /admins
// Access: Private (admin only)
adminRouter.get('/', authenticate, authorize(['admin']), async (_req: Request, res: Response) => {
  try {
    const admins = await adminService.findAll();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin can Get an Admin by id
// Route: GET /admins/:id
// Access: Private (admin only)
adminRouter.get('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const admin = await adminService.findOne(req.params.id);
    if (!admin) {
      res.status(404).json({ message: 'Admin not found' });
      return;
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin can Update an Admin
// Route: PATCH /admins/:id
// Access: Private (admin only)
adminRouter.patch('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const dto: UpdateAdminDto = req.body;
    const updated = await adminService.update(req.params.id, dto);
    if (!updated) {
      res.status(404).json({ message: 'Admin not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin can Delete an Admin
// Route: DELETE /admins/:id
// Access: Private (admin only)
adminRouter.delete('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const deleted = await adminService.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Admin not found' });
      return;
    }
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

export { adminRouter as adminRouter };