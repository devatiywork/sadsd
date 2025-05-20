import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { MESSAGES } from '../constants/messages'
import { CardStatus } from '../types'

const prisma = new PrismaClient()

export const getProfile = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id

		// Получаем информацию о пользователе из базы данных
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				login: true,
				FIO: true,
				phone: true,
				email: true,
				dateRegister: true,
				status: true,
				isAdmin: true,
			},
		})

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: 'Пользователь не найден' })
		}

		// Возвращаем данные о пользователе
		return res.json({ success: true, data: user })
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message })
	}
}

export const getUserCards = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id

		// Получаем все карточки пользователя (кроме удаленных)
		const cards = await prisma.card.findMany({
			where: {
				userId,
				status: {
					not: CardStatus.DELETED,
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

export const archiveUserCard = async (req: Request, res: Response) => {
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

		// Проверяем, принадлежит ли карточка пользователю
		if (existingCard.userId !== userId) {
			return res
				.status(403)
				.json({ success: false, message: MESSAGES.CARDS.NOT_OWNER })
		}

		// Архивируем карточку
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
