// Общие типы, используемые во всех модулях API
import { User as UserType } from '@/types/auth.types'
import { Card as CardType } from '@/types/card.types'

// Реэкспорт типа User из types/auth.types.ts
export type User = UserType

// Реэкспорт типа Card из types/card.types.ts
export type Card = CardType

export interface ApiResponse<T = any> {
	success: boolean
	data: T
	message?: string
}
