import { GetUserProfileUseCase } from '../../../../application/use-cases/user/GetUserProfileUseCase.js';
import { GetAllUsersUseCase } from '../../../../application/use-cases/user/GetAllUsersUseCase.js';

export class UserController {
  constructor(userRepository) {
    this.getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
    this.getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
  }

  async getProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const result = await this.getUserProfileUseCase.execute(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const result = await this.getAllUsersUseCase.execute();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}