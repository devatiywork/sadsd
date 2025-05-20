import { Router } from 'express'
import {
	archiveCard,
	createCard,
	deleteCard,
	getAllPublishedCards,
	getCardById,
	updateCard,
} from '../controllers/books.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { validateRequest } from '../middlewares/validate.middleware'
import {
	createCardSchema,
	updateCardSchema,
} from '../validators/card.validator'

export const booksRouter = Router()

// Применяем authMiddleware ко всем маршрутам
booksRouter.use(authMiddleware as any)

// Теперь все маршруты ниже требуют авторизации
booksRouter.get('/', getAllPublishedCards as any)
booksRouter.get('/:id', getCardById as any)

// Создание карточки
booksRouter.post(
	'/',
	validateRequest(createCardSchema) as any,
	createCard as any,
)

// Обновление карточки
booksRouter.put(
	'/:id',
	validateRequest(updateCardSchema) as any,
	updateCard as any,
)

// Удаление карточки
booksRouter.delete('/:id', deleteCard as any)

// Архивация карточки
booksRouter.put('/:id/archive', archiveCard as any)
