import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { MESSAGES } from '../constants/messages'
import { TokenPayload } from '../types'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

declare global {
	namespace Express {
		interface Request {
			user?: any
		}
	}
}

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers.authorization

		if (!authHeader) {
			return res.status(401).json({
				success: false,
				message: MESSAGES.AUTH.TOKEN_MISSING,
			})
		}

		const token = authHeader.split(' ')[1]

		if (!token) {
			return res.status(401).json({
				success: false,
				message: MESSAGES.AUTH.INVALID_TOKEN_FORMAT,
			})
		}

		const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: {
				id: true,
				login: true,
				FIO: true,
				email: true,
				phone: true,
				status: true,
				isAdmin: true,
				dateRegister: true,
			},
		})

		if (!user) {
			return res.status(401).json({
				success: false,
				message: MESSAGES.AUTH.USER_NOT_FOUND,
			})
		}

		if (user.status === 1) {
			return res.status(403).json({
				success: false,
				message: MESSAGES.AUTH.USER_BLOCKED,
			})
		}

		// Добавляем информацию о пользователе в объект запроса
		req.user = user
		next()
	} catch (error: any) {
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({
				success: false,
				message: MESSAGES.AUTH.TOKEN_INVALID,
			})
		} else if (error.name === 'TokenExpiredError') {
			return res.status(401).json({
				success: false,
				message: MESSAGES.AUTH.TOKEN_EXPIRED,
			})
		}

		return res.status(401).json({
			success: false,
			message: MESSAGES.AUTH.AUTH_REQUIRED,
			error: error.message,
		})
	}
}
