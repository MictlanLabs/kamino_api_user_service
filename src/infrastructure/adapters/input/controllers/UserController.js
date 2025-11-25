import { GetUserProfileUseCase } from '../../../../application/use-cases/user/GetUserProfileUseCase.js';
import { GetAllUsersUseCase } from '../../../../application/use-cases/user/GetAllUsersUseCase.js';
import { GetUserByIdUseCase } from '../../../../application/use-cases/user/GetUserByIdUseCase.js';
import { UpdateUserUseCase } from '../../../../application/use-cases/user/UpdateUserUseCase.js';
import { DeleteUserUseCase } from '../../../../application/use-cases/user/DeleteUserUseCase.js';
import { RegisterUseCase } from '../../../../application/use-cases/auth/RegisterUseCase.js';

export class UserController {
  constructor(userRepository, passwordHasher) {
    this.getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
    this.getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
    this.getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
    this.updateUserUseCase = new UpdateUserUseCase(userRepository);
    this.deleteUserUseCase = new DeleteUserUseCase(userRepository);
    this.registerUseCase = new RegisterUseCase(userRepository, passwordHasher);
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

  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const result = await this.getUserByIdUseCase.execute(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const result = await this.registerUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const result = await this.updateUserUseCase.execute(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const result = await this.deleteUserUseCase.execute(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
