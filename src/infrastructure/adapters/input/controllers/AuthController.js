import { RegisterUseCase } from '../../../../application/use-cases/auth/RegisterUseCase.js';
import { RegisterAdminUseCase } from '../../../../application/use-cases/auth/RegisterAdminUseCase.js';
import { LoginUseCase } from '../../../../application/use-cases/auth/LoginUseCase.js';
import { LogoutUseCase } from '../../../../application/use-cases/auth/LogoutUseCase.js';

export class AuthController {
  constructor(userRepository, passwordHasher, tokenGenerator) {
    this.registerUseCase = new RegisterUseCase(userRepository, passwordHasher);
    this.registerAdminUseCase = new RegisterAdminUseCase(userRepository, passwordHasher);
    this.loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenGenerator);
    this.logoutUseCase = new LogoutUseCase(userRepository);
  }

  async register(req, res, next) {
    try {
      const result = await this.registerUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async registerAdmin(req, res, next) {
    try {
      const result = await this.registerAdminUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await this.loginUseCase.execute(req.body);
      
      // Configurar cookies
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
      };

      const refreshCookieOptions = {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
      };

      res.cookie('accessToken', result.accessToken, cookieOptions);
      res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
      
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
      const result = await this.logoutUseCase.execute(req.user.userId, refreshToken);
      
      // Limpiar cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}