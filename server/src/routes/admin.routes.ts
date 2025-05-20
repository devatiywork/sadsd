import { Router } from 'express'
import {
	adminDeleteCard,
	approveCard,
	banUser,
	getCardsForModeration,
	getUsers,
	rejectCard,
	unbanUser,
} from '../controllers/admin.controller'
import { adminMiddleware } from '../middlewares/admin.middleware'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateRequest } from '../middlewares/validate.middleware'
import { moderateCardSchema } from '../validators/card.validator'

export const adminRouter = Router()

// Применяем middleware для проверки авторизации и админ прав
adminRouter.use(authMiddleware as any, adminMiddleware as any)

// Управление пользователями
adminRouter.get('/users', getUsers as any)
adminRouter.put('/users/:id/ban', banUser as any)
adminRouter.put('/users/:id/unban', unbanUser as any)

// Управление карточками
adminRouter.get('/cards/moderation', getCardsForModeration as any)
adminRouter.put('/cards/:id/approve', approveCard as any)
adminRouter.put(
	'/cards/:id/reject',
	validateRequest(moderateCardSchema) as any,
	rejectCard as any,
)
adminRouter.put(
	'/cards/:id/delete',
	validateRequest(moderateCardSchema) as any,
	adminDeleteCard as any,
)
