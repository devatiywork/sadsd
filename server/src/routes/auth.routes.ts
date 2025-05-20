import { Router } from 'express'
import { checkAuth, login, register } from '../controllers/auth.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateRequest } from '../middlewares/validate.middleware'
import { loginSchema, registerSchema } from '../validators/auth.validator'

export const authRouter = Router()

// Маршруты для авторизации
authRouter.post('/login', validateRequest(loginSchema) as any, login as any)
authRouter.post(
	'/register',
	validateRequest(registerSchema) as any,
	register as any,
)
authRouter.get('/check', authMiddleware as any, checkAuth as any)
