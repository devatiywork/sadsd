import { json } from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { errorHandler } from './middlewares/error.middleware'
import { createAdmin } from './prisma/seed'
import { adminRouter } from './routes/admin.routes'
import { authRouter } from './routes/auth.routes'
import { booksRouter } from './routes/books.routes'
import { profileRouter } from './routes/profile.routes'
import { logger, requestLogger } from './utils/logger'

// Загружаем переменные окружения
dotenv.config()

const app = express()
const port = process.env.PORT || 5000

// Безопасность и middleware
app.use(helmet()) // Добавляет различные HTTP-заголовки безопасности
app.use(cors())
app.use(json())
app.use(requestLogger) // Логирование запросов

// Глобальное ограничение запросов (защита от DDoS и брутфорса)
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 минут
	max: 300, // максимум 100 запросов с одного IP
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		success: false,
		message: 'Слишком много запросов, попробуйте позже',
	},
})
app.use('/api/', apiLimiter)

// Routes
app.use('/api/admin', adminRouter)
app.use('/api/auth', authRouter)
app.use('/api/books', booksRouter)
app.use('/api/profile', profileRouter)

// Error handling
app.use(errorHandler)

// Обработка 404 ошибки для неизвестных маршрутов
app.use((req, res) => {
	res.status(404).json({ success: false, message: 'Маршрут не найден' })
})

app.listen(port, () => {
	// Создание админа при запуске
	createAdmin()
		.then(() => {
			logger.info(`Server started on port ${port}`)
		})
		.catch(err => {
			logger.error('Failed to create admin user:', err)
		})
})

// Обработка необработанных исключений и отклоненных промисов
process.on('uncaughtException', error => {
	logger.error('Uncaught Exception:', error)
	process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled Promise Rejection:', { reason, promise })
})
