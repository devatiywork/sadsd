import fs from 'fs'
import path from 'path'
import winston from 'winston'
import 'winston-daily-rotate-file'

// Создаем директорию для логов, если она не существует
const logDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir)
}

// Транспорт для ротации файлов (ежедневное создание новых файлов)
const fileTransport = new winston.transports.DailyRotateFile({
	filename: path.join(logDir, 'application-%DATE%.log'),
	datePattern: 'YYYY-MM-DD',
	maxSize: '20m',
	maxFiles: '14d',
})

// Транспорт для ошибок
const errorTransport = new winston.transports.DailyRotateFile({
	filename: path.join(logDir, 'error-%DATE%.log'),
	datePattern: 'YYYY-MM-DD',
	maxSize: '20m',
	maxFiles: '14d',
	level: 'error',
})

// Формат для логов
const logFormat = winston.format.combine(
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	winston.format.errors({ stack: true }),
	winston.format.splat(),
	winston.format.json(),
)

// Создаем логгер
export const logger = winston.createLogger({
	level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
	format: logFormat,
	defaultMeta: { service: 'book-service' },
	transports: [
		// Вывод на консоль в режиме разработки
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple(),
			),
		}),
		fileTransport,
		errorTransport,
	],
})

// Логирование неперехваченных исключений и обещаний
logger.exceptions.handle(
	new winston.transports.File({
		filename: path.join(logDir, 'exceptions.log'),
	}),
)
logger.rejections.handle(
	new winston.transports.File({
		filename: path.join(logDir, 'rejections.log'),
	}),
)

// Создаем middleware для логирования запросов
export const requestLogger = (req: any, res: any, next: any) => {
	// Логируем начало запроса
	const start = Date.now()

	// Обрабатываем завершение запроса
	res.on('finish', () => {
		const duration = Date.now() - start
		const logObject = {
			method: req.method,
			url: req.originalUrl,
			status: res.statusCode,
			duration: `${duration}ms`,
			ip: req.ip || req.socket.remoteAddress,
			userAgent: req.headers['user-agent'],
		}

		// Логируем с соответствующим уровнем в зависимости от статус-кода
		if (res.statusCode >= 500) {
			logger.error(`Request failed [${res.statusCode}]`, logObject)
		} else if (res.statusCode >= 400) {
			logger.warn(`Request error [${res.statusCode}]`, logObject)
		} else {
			logger.info(`Request completed [${res.statusCode}]`, logObject)
		}
	})

	next()
}
