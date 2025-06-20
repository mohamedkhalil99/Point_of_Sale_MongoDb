import { Router, Request, Response } from 'express';
import { CreateCashierDto, UpdateCashierDto } from './cashier.dto';
import { authenticate, authorize } from '../../guards/guards.middleware';
import { CashierService } from './cashier.service';

const cashierRouter = Router();
const cashierService = new CashierService();

// Desc: Admin can Create a new cashier
// Route: POST /cashiers
// Access: Private (admin only)
cashierRouter.post('/', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const dto: CreateCashierDto = req.body;
    const newCashier = await cashierService.create(dto);
    res.status(201).json(newCashier);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin can get all cashiers (with filters & pagination)
// Route: GET /cashiers
// Access: Private (admin only)
cashierRouter.get('/', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const { name, email, branchId, page = '1', limit = '10' } = req.query;

    const filters = {
      ...(name ? { name: { $regex: String(name), $options: 'i' } } : {}),
      ...(email ? { email: { $regex: String(email), $options: 'i' } } : {}),
      ...(branchId ? { branch: branchId } : {}),
    };

    const result = await cashierService.findAllWithFilters(filters, Number(page), Number(limit));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin can get one cashier by ID
// Route: GET /cashiers/:id
// Access: Private (admin only)
cashierRouter.get('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const cashier = await cashierService.findOne(req.params.id);
    if (!cashier) {
      res.status(404).json({ message: 'Cashier not found' });
      return;
    }
    res.status(200).json(cashier);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin can update cashier by ID
// Route: PATCH /cashiers/:id
// Access: Private (admin only)
cashierRouter.patch('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const dto: UpdateCashierDto = req.body;
    const updated = await cashierService.update(req.params.id, dto);
    if (!updated) {
      res.status(404).json({ message: 'Cashier not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin can delete cashier by ID
// Route: DELETE /cashiers/:id
// Access: Private (admin only)
cashierRouter.delete('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const deleted = await cashierService.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Cashier not found' });
      return;
    }
    res.status(200).json({ message: 'Cashier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin gets top 3 cashiers by receipt count
// Route: GET /cashiers/top
// Access: Private (admin only)
cashierRouter.get('/top', authenticate, authorize(['admin']), async (_req: Request, res: Response) => {
  try {
    const topCashiers = await cashierService.getTop3Cashiers();
    res.status(200).json(topCashiers);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

export { cashierRouter };