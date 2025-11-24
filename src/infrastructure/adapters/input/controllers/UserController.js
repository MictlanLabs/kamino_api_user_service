import { GetUserProfileUseCase } from '../../../../application/use-cases/user/GetUserProfileUseCase.js';
import { GetAllUsersUseCase } from '../../../../application/use-cases/user/GetAllUsersUseCase.js';
import { UploadProfilePictureUseCase } from '../../../../application/use-cases/user/UploadProfilePictureUseCase.js';
import { UpdateProfilePictureUseCase } from '../../../../application/use-cases/user/UpdateProfilePictureUseCase.js';
import { DeleteProfilePictureUseCase } from '../../../../application/use-cases/user/DeleteProfilePictureUseCase.js';
import { ImageService } from '../../../services/ImageService.js';
import sharp from 'sharp';

export class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
    this.getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
    const imageService = new ImageService();
    this.uploadProfilePictureUseCase = new UploadProfilePictureUseCase(userRepository, imageService);
    this.updateProfilePictureUseCase = new UpdateProfilePictureUseCase(userRepository, imageService);
    this.deleteProfilePictureUseCase = new DeleteProfilePictureUseCase(userRepository);
  }

  async getProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const result = await this.getUserProfileUseCase.execute(userId);
      const buffer = await this.userRepository.getProfilePicture(userId);
      const profilePhotoUrl = buffer ? `${req.protocol}://${req.get('host')}/api/users/profile-picture` : null;
      res.status(200).json({ ...result, profile_photo: profilePhotoUrl });
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

  async uploadProfilePicture(req, res, next) {
    try {
      const userId = Number(req.params.id);
      if (!req.user || (req.user.userId !== userId && req.user.role !== 'ADMIN')) {
        const error = new Error('No autorizado');
        error.status = 403;
        throw error;
      }
      const file = req.file;
      if (!file) {
        const error = new Error('Archivo de imagen requerido');
        error.status = 400;
        throw error;
      }
      const result = await this.uploadProfilePictureUseCase.execute({ userId, buffer: file.buffer, mimetype: file.mimetype });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateProfilePicture(req, res, next) {
    try {
      const userId = Number(req.params.id);
      if (!req.user || (req.user.userId !== userId && req.user.role !== 'ADMIN')) {
        const error = new Error('No autorizado');
        error.status = 403;
        throw error;
      }
      const file = req.file;
      if (!file) {
        const error = new Error('Archivo de imagen requerido');
        error.status = 400;
        throw error;
      }
      const result = await this.updateProfilePictureUseCase.execute({ userId, buffer: file.buffer, mimetype: file.mimetype });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteProfilePicture(req, res, next) {
    try {
      const userId = Number(req.params.id);
      if (!req.user || (req.user.userId !== userId && req.user.role !== 'ADMIN')) {
        const error = new Error('No autorizado');
        error.status = 403;
        throw error;
      }
      const result = await this.deleteProfilePictureUseCase.execute({ userId });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProfilePicture(req, res, next) {
    try {
      const userId = req.user.userId;
      const buffer = await this.userRepository.getProfilePicture(userId);
      if (!buffer) {
        const error = new Error('Foto de perfil no encontrada');
        error.status = 404;
        throw error;
      }
      const meta = await sharp(buffer).metadata();
      const format = meta.format === 'png' ? 'image/png' : 'image/jpeg';
      res.setHeader('Content-Type', format);
      res.status(200).end(buffer);
    } catch (error) {
      next(error);
    }
  }
}
