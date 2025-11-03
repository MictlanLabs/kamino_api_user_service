import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

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

  return router;
};