import { CardType } from '@/types/card.types'
import { z } from 'zod'

// Упрощаем схему валидации для обеспечения корректной работы
export const createCardSchema = z.object({
	title: z.string().min(1, 'Название книги обязательно'),
	author: z.string().min(1, 'Автор книги обязателен'),
	type: z.number().int().min(0, 'Неверный тип').max(1, 'Неверный тип'),
	publisher: z.string().optional(),
	year: z
		.union([
			z
				.number()
				.int('Год должен быть целым числом')
				.min(1800, 'Год издания должен быть не ранее 1800')
				.max(
					new Date().getFullYear(),
					`Год издания должен быть не позднее ${new Date().getFullYear()}`,
				),
			z.null(),
		])
		.optional(),
	binding: z.string().optional(),
	condition: z.string().optional(),
})

export type CreateCardFormValues = z.infer<typeof createCardSchema>

export const defaultValues: CreateCardFormValues = {
	title: '',
	author: '',
	type: CardType.SHARE,
	publisher: '',
	year: null,
	binding: '',
	condition: '',
}
