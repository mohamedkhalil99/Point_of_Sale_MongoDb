import { Router, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './auth.dto';

const authRouter = Router();
const authService = new AuthService();

// Desc: Sign in (Admin or Cashier)
// Route: POST /auth/signin
// Access: Public
authRouter.post('/signin', async (req: Request, res: Response) => {
  try {
    const dto: SignInDto = req.body;
    const result = await authService.signIn(dto);
    res.status(200).json(result);
  } 
  catch (error: any) {
    res.status(error.status || 401).json({ message: error.message });
  }
});

export { authRouter };