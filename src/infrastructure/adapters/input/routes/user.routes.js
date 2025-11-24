import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

export const createUserRoutes = (userController) => {
  const router = Router();

  /**
   * @swagger
   * /api/users/profile:
   *   get:
   *     summary: Obtener perfil del usuario autenticado
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Perfil del usuario
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       401:
   *         description: No autenticado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Usuario no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
  */
  router.get('/profile', authMiddleware, (req, res, next) => 
    userController.getProfile(req, res, next)
  );

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Obtener todos los usuarios (solo administradores)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de todos los usuarios
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   *       401:
   *         description: No autenticado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Sin permisos de administrador
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/', authMiddleware, adminMiddleware, (req, res, next) => 
    userController.getAllUsers(req, res, next)
  );

  /**
   * @swagger
   * /api/users/admin-only:
   *   get:
   *     summary: Ruta solo para administradores
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Acceso permitido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Esta ruta es solo para administradores
   *       401:
   *         description: No autenticado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Sin permisos de administrador
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/admin-only', authMiddleware, adminMiddleware, (req, res) => {
    res.json({ message: 'Esta ruta es solo para administradores' });
  });

  /**
   * @swagger
   * /api/users/{id}/profile-picture:
   *   post:
   *     summary: Subir nueva foto de perfil
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *           examples:
   *             web:
   *               summary: Ejemplo web
   *               value: { }
   *             mobile:
   *               summary: Ejemplo móvil
   *               value: { }
   *     responses:
   *       201:
   *         description: Foto de perfil cargada
   *       400:
   *         description: Archivo requerido
   *       403:
   *         description: No autorizado
   *       413:
   *         description: Imagen demasiado grande
   *       415:
   *         description: Formato no soportado
   */
  router.post('/:id/profile-picture', authMiddleware, upload.single('file'), (req, res, next) =>
    userController.uploadProfilePicture(req, res, next)
  );

  /**
   * @swagger
   * /api/users/{id}/profile-picture:
   *   put:
   *     summary: Actualizar foto de perfil
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Foto de perfil actualizada
   *       400:
   *         description: Archivo requerido
   *       403:
   *         description: No autorizado
   *       413:
   *         description: Imagen demasiado grande
   *       415:
   *         description: Formato no soportado
   */
  router.put('/:id/profile-picture', authMiddleware, upload.single('file'), (req, res, next) =>
    userController.updateProfilePicture(req, res, next)
  );

  /**
   * @swagger
   * /api/users/{id}/profile-picture:
   *   delete:
   *     summary: Eliminar foto de perfil
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Foto de perfil eliminada
   *       403:
   *         description: No autorizado
   *       404:
   *         description: Usuario no encontrado
   */
  router.delete('/:id/profile-picture', authMiddleware, (req, res, next) =>
    userController.deleteProfilePicture(req, res, next)
  );

  /**
   * @swagger
   * /api/users/profile-picture:
   *   get:
   *     summary: Obtener la foto de perfil del usuario autenticado
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Imagen de perfil
   *         content:
   *           image/png:
   *             schema:
   *               type: string
   *               format: binary
   *           image/jpeg:
   *             schema:
   *               type: string
   *               format: binary
   *       401:
   *         description: No autenticado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Foto de perfil no encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/profile-picture', authMiddleware, (req, res, next) =>
    userController.getProfilePicture(req, res, next)
  );

  return router;
};
