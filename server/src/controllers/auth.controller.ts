import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { MESSAGES } from '../constants/messages'
import { AuthResponse, LoginDto, RegisterDto } from '../types'
import { ApiError, handleError } from '../utils/error-handler'
import { loginRateLimiter } from '../utils/rate-limiter'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = '7d' // Токен действителен 7 дней

// Функция для генерации JWT токена
const generateToken = (
	userId: number,
	login: string,
	isAdmin: boolean,
): string => {
	return jwt.sign({ userId, login, isAdmin }, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	})
}

// Функция для формирования ответа с данными пользователя и токеном
const formatUserResponse = (user: any, token: string): AuthResponse => {
	return {
		user: {
			id: user.id,
			login: user.login,
			FIO: user.FIO,
			email: user.email,
			isAdmin: user.isAdmin,
		},
		token,
	}
}

export const login = async (req: Request, res: Response) => {
	try {
		const { login, password } = req.body as LoginDto

		// Проверяем ограничение попыток входа
		const ip = req.ip || req.socket.remoteAddress || 'unknown'
		const key = `${login}:${ip}`
		const rateLimitResult = loginRateLimiter.attempt(key)

		if (rateLimitResult.blocked) {
			const blockUntil = new Date(
				rateLimitResult.blockUntil || 0,
			).toLocaleString()
			throw new ApiError(
				`Превышено количество попыток входа. Попробуйте снова после ${blockUntil}`,
				429,
			)
		}

		// Находим пользователя по логину
		const user = await prisma.user.findUnique({
			where: { login },
		})

		// Если пользователь не найден или пароль неверный
		if (!user) {
			throw new ApiError(MESSAGES.AUTH.INVALID_CREDENTIALS, 401, {
				attemptsLeft: rateLimitResult.attemptsLeft,
			})
		}

		// Проверяем, забанен ли пользователь
		if (user.status === 1) {
			// Сбрасываем счетчик попыток для заблокированных пользователей
			loginRateLimiter.reset(key)
			throw new ApiError(MESSAGES.AUTH.USER_BLOCKED, 403)
		}

		// Проверяем пароль
		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) {
			throw new ApiError(MESSAGES.AUTH.INVALID_CREDENTIALS, 401, {
				attemptsLeft: rateLimitResult.attemptsLeft,
			})
		}

		// Сбрасываем счетчик попыток при успешном входе
		loginRateLimiter.reset(key)

		// Генерируем JWT токен
		const token = generateToken(user.id, user.login, user.isAdmin)

		// Возвращаем данные пользователя и токен
		return res.json({
			success: true,
			data: formatUserResponse(user, token),
		})
	} catch (error: any) {
		return handleError(error, res)
	}
}

export const register = async (req: Request, res: Response) => {
	try {
		const userData = req.body as RegisterDto

		// Проверяем, существует ли пользователь с таким логином
		const existingUserByLogin = await prisma.user.findUnique({
			where: { login: userData.login },
		})

		if (existingUserByLogin) {
			return res.status(400).json({
				success: false,
				message: 'Пользователь с таким логином уже существует',
			})
		}

		// Проверяем, существует ли пользователь с таким email
		const existingUserByEmail = await prisma.user.findUnique({
			where: { email: userData.email },
		})

		if (existingUserByEmail) {
			return res.status(400).json({
				success: false,
				message: 'Пользователь с таким email уже существует',
			})
		}

		// Хешируем пароль
		const hashedPassword = await bcrypt.hash(userData.password, 10)

		// Создаем нового пользователя
		const newUser = await prisma.user.create({
			data: {
				login: userData.login,
				password: hashedPassword,
				FIO: userData.FIO,
				phone: userData.phone,
				email: userData.email,
				status: 0, // Активный
				isAdmin: false, // Не администратор
			},
		})

		// Генерируем JWT токен
		const token = generateToken(newUser.id, newUser.login, newUser.isAdmin)

		// Возвращаем данные пользователя и токен
		return res.status(201).json({
			success: true,
			data: formatUserResponse(newUser, token),
			message: 'Регистрация прошла успешно',
		})
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: 'Ошибка при регистрации',
			error: error.message,
		})
	}
}

export const checkAuth = async (req: Request, res: Response) => {
	try {
		// user данные уже доступны из middleware
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: 'Пользователь не авторизован',
			})
		}

		return res.json({
			success: true,
			data: {
				user: {
					id: req.user.id,
					login: req.user.login,
					FIO: req.user.FIO,
					email: req.user.email,
					isAdmin: req.user.isAdmin,
				},
			},
		})
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: 'Ошибка при проверке авторизации',
			error: error.message,
		})
	}
}
