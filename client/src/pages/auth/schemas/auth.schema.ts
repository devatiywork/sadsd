import { z } from 'zod'

// Схема для формы входа
export const loginSchema = z.object({
	login: z
		.string()
		.min(1, 'Логин обязателен')
		.regex(
			/^[a-zA-Z0-9]+$/,
			'Логин должен содержать только английские буквы и цифры',
		),
	password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
})

// Схема для формы регистрации
export const registerSchema = z.object({
	FIO: z
		.string()
		.min(1, 'ФИО обязательно')
		.regex(
			/^[А-Яа-яЁё\s]+$/,
			'ФИО должно содержать только кириллицу и пробелы',
		),
	phone: z
		.string()
		.min(1, 'Телефон обязателен')
		.regex(
			/^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/,
			'Телефон должен быть в формате +7(XXX)-XXX-XX-XX',
		),
	email: z
		.string()
		.min(1, 'Email обязателен')
		.email('Некорректный формат email'),
	login: z
		.string()
		.min(1, 'Логин обязателен')
		.regex(
			/^[a-zA-Z0-9]+$/,
			'Логин должен содержать только английские буквы и цифры',
		),
	password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
})

// Типы, выведенные из схем
export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
