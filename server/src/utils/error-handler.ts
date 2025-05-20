import { Response } from 'express'
import { MESSAGES } from '../constants/messages'
import { logger } from './logger'

export class ApiError extends Error {
	public statusCode: number
	public details?: any

	constructor(message: string, statusCode: number = 500, details?: any) {
		super(message)
		this.statusCode = statusCode
		this.details = details
		this.name = 'ApiError'
	}
}

export const handleError = (error: any, res: Response): Response => {
	// Логируем ошибку с контекстом
	logger.error('Error occurred:', {
		message: error.message,
		stack: error.stack,
		name: error.name,
		code: error.code,
		details: error.details,
	})

	// Если это наша собственная ошибка API
	if (error instanceof ApiError) {
		return res.status(error.statusCode).json({
			success: false,
			message: error.message,
			details: error.details,
		})
	}

	// Ошибки Prisma
	if (error.code && error.code.startsWith('P')) {
		let message = MESSAGES.SERVER_ERROR
		let statusCode = 500

		switch (error.code) {
			case 'P2002': // Unique constraint failed
				message = 'Уже существует запись с такими данными'
				statusCode = 409
				break
			case 'P2025': // Record not found
				message = 'Запись не найдена'
				statusCode = 404
				break
			// Добавить другие коды ошибок при необходимости
		}

		return res.status(statusCode).json({
			success: false,
			message,
			code: error.code,
		})
	}

	// Стандартная ошибка сервера
	return res.status(500).json({
		success: false,
		message: MESSAGES.SERVER_ERROR,
	})
}
