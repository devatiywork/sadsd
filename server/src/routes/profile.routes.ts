import { Router } from 'express'
import {
	archiveUserCard,
	getProfile,
	getUserCards,
} from '../controllers/profile.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

export const profileRouter = Router()

// Все маршруты требуют авторизации
profileRouter.use(authMiddleware as any)

// Получение информации о профиле
profileRouter.get('/', getProfile as any)

// Получение карточек пользователя
profileRouter.get('/cards', getUserCards as any)

// Архивация карточки
profileRouter.put('/cards/:id/archive', archiveUserCard as any)
