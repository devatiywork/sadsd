import Joi from 'joi'
import { MESSAGES } from '../constants/messages'

// Создаем расширенную схему для года с дополнительной валидацией
const yearSchema = Joi.number()
	.integer()
	.min(1800)
	.max(new Date().getFullYear())
	.messages({
		'number.base': 'Год должен быть числом',
		'number.integer': 'Год должен быть целым числом',
		'number.min': 'Год не может быть ранее 1800',
		'number.max': `Год не может быть позже ${new Date().getFullYear()}`,
	})

// Схема для заголовка книги
const titleSchema = Joi.string().trim().min(2).max(100).required().messages({
	'string.empty': 'Название книги обязательно',
	'string.min': 'Название книги должно содержать минимум 2 символа',
	'string.max': 'Название книги не может превышать 100 символов',
	'any.required': 'Название книги обязательно',
})

// Схема для автора
const authorSchema = Joi.string().trim().min(2).max(100).required().messages({
	'string.empty': 'Имя автора обязательно',
	'string.min': 'Имя автора должно содержать минимум 2 символа',
	'string.max': 'Имя автора не может превышать 100 символов',
	'any.required': 'Имя автора обязательно',
})

// Схема для издателя
const publisherSchema = Joi.string()
	.trim()
	.min(2)
	.max(100)
	.allow('', null)
	.messages({
		'string.min': 'Название издательства должно содержать минимум 2 символа',
		'string.max': 'Название издательства не может превышать 100 символов',
	})

// Улучшенная схема для создания карточки
export const createCardSchema = Joi.object({
	title: titleSchema,
	author: authorSchema,
	type: Joi.number().valid(0, 1).required().messages({
		'any.only': 'Тип должен быть 0 (поделиться) или 1 (получить)',
		'number.base': 'Тип должен быть числом',
		'any.required': 'Тип карточки обязателен',
	}),
	publisher: publisherSchema,
	year: yearSchema.allow(null),
	binding: Joi.string().trim().max(50).allow('', null).messages({
		'string.max': 'Описание переплета не может превышать 50 символов',
	}),
	condition: Joi.string().trim().max(200).allow('', null).messages({
		'string.max': 'Описание состояния не может превышать 200 символов',
	}),
})

// Улучшенная схема для обновления карточки
export const updateCardSchema = Joi.object({
	title: titleSchema.optional(),
	author: authorSchema.optional(),
	type: Joi.number().valid(0, 1).messages({
		'any.only': 'Тип должен быть 0 (поделиться) или 1 (получить)',
		'number.base': 'Тип должен быть числом',
	}),
	publisher: publisherSchema,
	year: yearSchema.allow(null),
	binding: Joi.string().trim().max(50).allow('', null).messages({
		'string.max': 'Описание переплета не может превышать 50 символов',
	}),
	condition: Joi.string().trim().max(200).allow('', null).messages({
		'string.max': 'Описание состояния не может превышать 200 символов',
	}),
})

// Улучшенная схема для модерирования карточки
export const moderateCardSchema = Joi.object({
	reason: Joi.string().trim().min(5).max(500).required().messages({
		'string.empty': MESSAGES.CARDS.REASON_REQUIRED,
		'string.min': 'Причина должна содержать минимум 5 символов',
		'string.max': 'Причина не может превышать 500 символов',
		'any.required': MESSAGES.CARDS.REASON_REQUIRED,
	}),
})
