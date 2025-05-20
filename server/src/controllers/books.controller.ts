import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { MESSAGES } from '../constants/messages'
import { CardStatus, CardType, CreateCardDto, UpdateCardDto } from '../types'

const prisma = new PrismaClient()

export const getAllPublishedCards = async (req: Request, res: Response) => {
	try {
		// Получаем только опубликованные карточки с типом "поделиться"
		const cards = await prisma.card.findMany({
			where: {
				status: CardStatus.ACTIVE,
				type: CardType.SHARE,
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
				dateCreate: 'desc',
			},
		})

		return res.json({ success: true, data: cards })
	} catch (error: any) {
		return res.status(500).json({ success: false, error: error.message })
	}
}

export const getCardById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		const card = await prisma.card.findUnique({
			where: { id: Number(id) },
			include: {
				user: {
					select: {
						id: true,
						FIO: true,
					},
				},
			},
		})

		if (!card) {
			return res
				.status(404)
				.json({ success: false, message: MESSAGES.CARDS.CARD_NOT_FOUND })
		}

		// Проверяем доступ: либо карточка активна, либо пользователь владелец/админ
		if (
			card.status !== CardStatus.ACTIVE &&
			card.userId !== req.user.id &&
			!req.user.isAdmin
		) {
			return res
				.status(403)
				.json({ success: false, message: MESSAGES.CARDS.NOT_OWNER })
		}

		return res.json({ success: true, data: card })
	} catch (error: any) {
		return res.status(500).json({ success: false, error: error.message })
	}
}

export const createCard = async (req: Request, res: Response) => {
	try {
		const cardData = req.body as CreateCardDto
		const userId = req.user.id
		const isAdmin = req.user.isAdmin

		// Определяем начальный статус карточки
		// Для админа - сразу активна, для обычного пользователя - на модерации
		const initialStatus = isAdmin
			? CardStatus.ACTIVE
			: CardStatus.AWAITING_MODERATION

		const card = await prisma.card.create({
			data: {
				...cardData,
				userId,
				status: initialStatus,
			},
		})

		const message = isAdmin
			? MESSAGES.CARDS.CARD_CREATED
			: MESSAGES.CARDS.CARD_CREATED_MODERATION

		return res.status(201).json({
			success: true,
			data: card,
			message,
		})
	} catch (error: any) {
		return res.status(500).json({ success: false, error: error.message })
	}
}

export const updateCard = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const cardData = req.body as UpdateCardDto
		const userId = req.user.id
		const isAdmin = req.user.isAdmin

		// Проверяем существование карточки
		const existingCard = await prisma.card.findUnique({
			where: { id: Number(id) },
		})

		if (!existingCard) {
			return res
				.status(404)
				.json({ success: false, message: MESSAGES.CARDS.CARD_NOT_FOUND })
		}

		// Проверяем права доступа (владелец или админ)
		if (existingCard.userId !== userId && !isAdmin) {
			return res
				.status(403)
				.json({ success: false, message: MESSAGES.CARDS.NOT_OWNER })
		}

		// Определяем статус после обновления (для не-админа и не архивированной/удаленной карточки - на модерацию)
		let newStatus = existingCard.status
		if (
			!isAdmin &&
			existingCard.status === CardStatus.ACTIVE &&
			Object.keys(cardData).length > 0
		) {
			newStatus = CardStatus.AWAITING_MODERATION
		}

		const updatedCard = await prisma.card.update({
			where: { id: Number(id) },
			data: {
				...cardData,
				status: newStatus,
			},
		})

		return res.json({
			success: true,
			data: updatedCard,
			message: MESSAGES.CARDS.CARD_UPDATED,
		})
	} catch (error: any) {
		return res.status(500).json({ success: false, error: error.message })
	}
}

export const deleteCard = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const userId = req.user.id
		const isAdmin = req.user.isAdmin

		// Проверяем существование карточки
		const existingCard = await prisma.card.findUnique({
			where: { id: Number(id) },
		})

		if (!existingCard) {
			return res
				.status(404)
				.json({ success: false, message: MESSAGES.CARDS.CARD_NOT_FOUND })
		}

		// Проверяем права доступа (владелец или админ)
		if (existingCard.userId !== userId && !isAdmin) {
			return res
				.status(403)
				.json({ success: false, message: MESSAGES.CARDS.NOT_OWNER })
		}

		// Мягкое удаление (изменение статуса)
		const deletedCard = await prisma.card.update({
			where: { id: Number(id) },
			data: {
				status: CardStatus.DELETED,
				removeReason: 'Удалено пользователем',
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

export const archiveCard = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const userId = req.user.id

		// Проверяем существование карточки
		const existingCard = await prisma.card.findUnique({
			where: { id: Number(id) },
		})

		if (!existingCard) {
			return res
				.status(404)
				.json({ success: false, message: MESSAGES.CARDS.CARD_NOT_FOUND })
		}

		// Проверяем права доступа (только владелец)
		if (existingCard.userId !== userId) {
			return res
				.status(403)
				.json({ success: false, message: MESSAGES.CARDS.NOT_OWNER })
		}

		// Обновляем статус карточки на "архивировано"
		const archivedCard = await prisma.card.update({
			where: { id: Number(id) },
			data: {
				status: CardStatus.ARCHIVED,
			},
		})

		return res.json({
			success: true,
			data: archivedCard,
			message: MESSAGES.CARDS.CARD_ARCHIVED,
		})
	} catch (error: any) {
		return res.status(500).json({ success: false, error: error.message })
	}
}
