import { Router, Request, Response } from 'express';
import { BranchService } from './branches.service';
import { authenticate, authorize } from '../../guards/guards.middleware';
import { CreateBranchDto, UpdateBranchDto } from './branches.dto';

const branchRouter = Router();
const branchService = new BranchService();

// Desc: Admin can Create a new Branch
// Route: POST /branches
// Access: Private (admin only)
branchRouter.post('/', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const dto: CreateBranchDto = req.body;
    const newBranch = await branchService.create(dto);
    res.status(201).json(newBranch);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin can Get all Branches (with filters & pagination)
// Route: GET /branches
// Access: Private (admin only)
branchRouter.get('/', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const { name, phone, page = '1', limit = '10' } = req.query;

    const filters = {
      ...(name ? { name: { $regex: String(name), $options: 'i' } } : {}),
      ...(phone ? { phone: { $regex: String(phone), $options: 'i' } } : {}),
    };

    const result = await branchService.findAllWithFilters(filters, Number(page), Number(limit));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin can Get Branch by id
// Route: GET /branches
// Access: Private (admin only)
branchRouter.get('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const branch = await branchService.findOne(req.params.id);
    if (!branch) {
      res.status(404).json({ message: 'Branch not found' });
      return;
    }
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin can Update Branch by id
// Route: Patch /branches
// Access: Private (admin only)
branchRouter.patch('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const dto: UpdateBranchDto = req.body;
    const updated = await branchService.update(req.params.id, dto);
    if (!updated) {
      res.status(404).json({ message: 'Branch not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin can Delete Branch by id only if no cashiers are linked to it
// Route: Delete /branches
// Access: Private (admin only)
branchRouter.delete('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const deleted = await branchService.deleteIfNoCashiers(req.params.id);
    if (deleted === 'NOT_FOUND') {
      res.status(404).json({ message: 'Branch not found' });
    } else if (deleted === 'HAS_CASHIERS') {
      res.status(400).json({ message: 'Branch has cashiers. Cannot delete.' });
    } else {
      res.status(200).json({ message: 'Branch deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

export { branchRouter };