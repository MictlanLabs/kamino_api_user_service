import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { validateUuidParam } from '../middlewares/validationMiddleware.js';

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
   * /api/users/{id}:
   *   get:
   *     summary: Obtener usuario por ID (solo administradores)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
    *           type: string
    *           format: uuid
   *     responses:
   *       200:
   *         description: Usuario encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       401:
   *         description: No autenticado
   *       403:
   *         description: Sin permisos de administrador
   *       404:
   *         description: Usuario no encontrado
   */
  router.get('/:id', authMiddleware, adminMiddleware, validateUuidParam('id'), (req, res, next) => 
    userController.getById(req, res, next)
  );

  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Crear usuario (solo administradores)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       201:
   *         description: Usuario creado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       401:
   *         description: No autenticado
   *       403:
   *         description: Sin permisos de administrador
   */
  router.post('/', authMiddleware, adminMiddleware, (req, res, next) => 
    userController.create(req, res, next)
  );

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     summary: Actualizar usuario (solo administradores)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
    *           type: string
    *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               role:
   *                 type: string
   *                 enum: ['USER','ADMIN']
   *               isActive:
   *                 type: boolean
   *               profilePhotoUrl:
   *                 type: string
   *               gender:
   *                 type: string
   *                 enum: ['MALE','FEMALE','NON_BINARY','OTHER']
   *     responses:
   *       200:
   *         description: Usuario actualizado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       401:
   *         description: No autenticado
   *       403:
   *         description: Sin permisos de administrador
   *       404:
   *         description: Usuario no encontrado
   */
  router.put('/:id', authMiddleware, adminMiddleware, validateUuidParam('id'), (req, res, next) => 
    userController.update(req, res, next)
  );

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Eliminar usuario (solo administradores)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
    *           type: string
    *           format: uuid
   *     responses:
   *       200:
   *         description: Usuario eliminado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *       401:
   *         description: No autenticado
   *       403:
   *         description: Sin permisos de administrador
   *       404:
   *         description: Usuario no encontrado
   */
  router.delete('/:id', authMiddleware, adminMiddleware, validateUuidParam('id'), (req, res, next) => 
    userController.delete(req, res, next)
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

  return router;
};
