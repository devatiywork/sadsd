import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { MESSAGES } from '../constants/messages'
import { CardStatus, ModerateCardDto } from '../types'

const prisma = new PrismaClient()

export const getUsers = async (req: Request, res: Response) => {
	try {
		// Получаем список всех пользователей (кроме текущего админа)
		const currentAdminId = req.user.id

		const users = await prisma.user.findMany({
			where: {
				id: {
					not: currentAdminId,
				},
			},
			select: {
				id: true,
				login: true,
				FIO: true,
				email: true,
				phone: true,
				dateRegister: true,
				status: true,
				isAdmin: true,
				_count: {
					select: {
						cards: true,
					},
				},
			},
			orderBy: {
				dateRegister: 'desc',
			},
		})

		return res.json({ success: true, data: users })
	} catch (error: any) {
		return res.status(500).json({ success: false, error: error.message })
	}
}

export const banUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const userId = Number(id)

		// Проверяем существование пользователя
		const user = await prisma.user.findUnique({
			where: { id: userId },
		})

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: 'Пользователь не найден' })
		}

		// Нельзя забанить админа
		if (user.isAdmin) {
			return res
				.status(403)
				.json({ success: false, message: 'Невозможно забанить администратора' })
		}

		// Обновляем статус пользователя на "забанен"
		const bannedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				status: 1, // Забанен
			},
		})

		return res.json({
			success: true,
			data: bannedUser,
			message: 'Пользователь заблокирован',
		})
	} catch (error: any) {
		return res.status(500).json({ success: false, error: error.message })
	}
}

export const unbanUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const userId = Number(id)

		// Проверяем существование пользователя
		const user = await prisma.user.findUnique({
			where: { id: userId },
		})

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: 'Пользователь не найден' })
		}

		// Обновляем статус пользователя на "активен"
		const unbannedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				status: 0, // Активен
			},
		})

		return res.json({
			success: true,
			data: unbannedUser,
			message: 'Пользователь разблокирован',
		})
	} catch (error: any) {
		return res.status(500).json({ success: false, error: error.message })
	}
}

export const getCardsForModeration = async (req: Request, res: Response) => {
	try {
		// Получаем карточки, ожидающие модерации
		const cards = await prisma.card.findMany({
			where: {
				status: CardStatus.AWAITING_MODERATION,
			},
			include: {
				user: {
					select: {
						id: true,
						FIO: true,
					},
				},
			},
			orderBy: {
				dateCreate: 'asc', // Сначала старые
			},
		})

		return res.json({ success: true, data: cards })
	} catch (error: any) {
		return res.status(500).json({ success: false, error: error.message })
	}
}

export const approveCard = async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		// Проверяем существование карточки
		const existingCard = await prisma.card.findUnique({
			where: { id: Number(id) },
		})

		if (!existingCard) {
			return res
				.status(404)
				.json({ success: false, message: MESSAGES.CARDS.CARD_NOT_FOUND })
		}

		// Подтверждаем карточку, меняя статус на активный
		const approvedCard = await prisma.card.update({
			where: { id: Number(id) },
			data: {
				status: CardStatus.ACTIVE,
			},
		})

		return res.json({
			success: true,
			data: approvedCard,
			message: MESSAGES.CARDS.CARD_APPROVED,
		})
	} catch (error: any) {
		return res.status(500).json({ success: false, error: error.message })
	}
}

export const rejectCard = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const { reason } = req.body as ModerateCardDto

		// Проверяем существование карточки
		const existingCard = await prisma.card.findUnique({
			where: { id: Number(id) },
		})

		if (!existingCard) {
			return res
				.status(404)
				.json({ success: false, message: MESSAGES.CARDS.CARD_NOT_FOUND })
		}

		// Отклоняем карточку, указывая причину
		const rejectedCard = await prisma.card.update({
			where: { id: Number(id) },
			data: {
				status: CardStatus.REJECTED,
				removeReason: reason,
			},
		})

		return res.json({
			success: true,
			data: rejectedCard,
			message: MESSAGES.CARDS.CARD_REJECTED,
		})
	} catch (error: any) {
		return res.status(500).json({ success: false, error: error.message })
	}
}

export const adminDeleteCard = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const { reason } = req.body as ModerateCardDto

		// Проверяем существование карточки
		const existingCard = await prisma.card.findUnique({
			where: { id: Number(id) },
		})

		if (!existingCard) {
			return res
				.status(404)
				.json({ success: false, message: MESSAGES.CARDS.CARD_NOT_FOUND })
		}

		// Помечаем карточку как удаленную
		const deletedCard = await prisma.card.update({
			where: { id: Number(id) },
			data: {
				status: CardStatus.DELETED,
				removeReason: reason,
			},
		})

		return res.json({
			success: true,
			data: deletedCard,
			message: MESSAGES.CARDS.CARD_DELETED,
		})
	} catch (error: any) {
		return res.status(500).json({ success: false, error: error.message })
	}
}
