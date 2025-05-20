import Joi from 'joi'
import { MESSAGES } from '../constants/messages'

export const loginSchema = Joi.object({
	login: Joi.string()
		.pattern(/^[a-zA-Z0-9]+$/)
		.required()
		.messages({
			'string.empty': MESSAGES.VALIDATION.REQUIRED,
			'string.pattern.base': MESSAGES.VALIDATION.LOGIN_PATTERN,
		}),
	password: Joi.string().min(6).required().messages({
		'string.empty': MESSAGES.VALIDATION.REQUIRED,
		'string.min': MESSAGES.VALIDATION.PASSWORD_MIN,
	}),
})

export const registerSchema = Joi.object({
	FIO: Joi.string()
		.pattern(/^[А-Яа-яЁё\s]+$/)
		.required()
		.messages({
			'string.empty': MESSAGES.VALIDATION.REQUIRED,
			'string.pattern.base': MESSAGES.VALIDATION.FIO_PATTERN,
		}),
	phone: Joi.string()
		.pattern(/^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/)
		.required()
		.messages({
			'string.empty': MESSAGES.VALIDATION.REQUIRED,
			'string.pattern.base': MESSAGES.VALIDATION.PHONE_PATTERN,
		}),
	email: Joi.string().email().required().messages({
		'string.empty': MESSAGES.VALIDATION.REQUIRED,
		'string.email': MESSAGES.VALIDATION.INVALID_EMAIL,
	}),
	login: Joi.string()
		.pattern(/^[a-zA-Z0-9]+$/)
		.required()
		.messages({
			'string.empty': MESSAGES.VALIDATION.REQUIRED,
			'string.pattern.base': MESSAGES.VALIDATION.LOGIN_PATTERN,
		}),
	password: Joi.string().min(6).required().messages({
		'string.empty': MESSAGES.VALIDATION.REQUIRED,
		'string.min': MESSAGES.VALIDATION.PASSWORD_MIN,
	}),
})
