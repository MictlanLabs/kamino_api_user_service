import { Router } from 'express';
import { validateRegister, validateLogin } from '../middlewares/validationMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

export const createAuthRoutes = (authController) => {
  const router = Router();

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Registrar un nuevo usuario
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       201:
   *         description: Usuario registrado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Datos inválidos
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: El usuario ya existe
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/register', validateRegister, (req, res, next) => 
    authController.register(req, res, next)
  );

  /**
   * @swagger
   * /api/auth/register-admin:
   *   post:
   *     summary: Registrar un nuevo administrador (solo administradores)
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - firstName
   *               - lastName
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: admin@example.com
   *               password:
   *                 type: string
   *                 minLength: 8
   *                 example: password123
   *               firstName:
   *                 type: string
   *                 example: Admin
   *               lastName:
   *                 type: string
   *                 example: Sistema
   *     responses:
   *       201:
   *         description: Administrador registrado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Datos inválidos
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
   *       409:
   *         description: El usuario ya existe
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/register-admin', authMiddleware, adminMiddleware, validateRegister, (req, res, next) => 
    authController.registerAdmin(req, res, next)
  );

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Iniciar sesión
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login exitoso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *         headers:
   *           Set-Cookie:
   *             schema:
   *               type: string
   *               example: accessToken=abcde12345; Path=/; HttpOnly
   *       401:
   *         description: Credenciales inválidas
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
  router.post('/login', validateLogin, (req, res, next) => 
    authController.login(req, res, next)
  );

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: Cerrar sesión
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Sesión cerrada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Sesión cerrada exitosamente
   *       401:
   *         description: Token no válido
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/logout', authMiddleware, (req, res, next) => 
    authController.logout(req, res, next)
  );

  return router;
};