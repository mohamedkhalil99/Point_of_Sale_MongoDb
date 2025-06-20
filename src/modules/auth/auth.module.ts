import { authRouter } from './auth.controller';
import { AuthService } from './auth.service';

export const AuthModule = {
  router: authRouter,
  service: AuthService
};