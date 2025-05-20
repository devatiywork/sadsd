export interface Card {
	id: number
	userId: number
	status: number // 0 - активна, 1 - архив, 2 - удалена, 3 - на модерации, 4 - отклонена
	removeReason?: string | null
	title: string
	type: number // 0 - поделиться, 1 - получить
	author: string
	publisher?: string | null
	year?: number | null
	binding?: string | null
	condition?: string | null
	dateCreate: string | Date
	user?: {
		id: number
		FIO: string
		login?: string
		email?: string
		phone?: string
		dateRegister?: Date
		status?: number
		isAdmin?: boolean
	}
}

export interface CreateCardDto {
	title: string
	type: number
	author: string
	publisher?: string
	year?: number
	binding?: string
	condition?: string
}

export type UpdateCardDto = Partial<CreateCardDto>

export enum CardStatus {
	ACTIVE = 0,
	ARCHIVED = 1,
	DELETED = 2,
	AWAITING_MODERATION = 3,
	REJECTED = 4,
}

export enum CardType {
	SHARE = 0,
	RECEIVE = 1,
}

export const cardStatusLabels: Record<CardStatus, string> = {
	[CardStatus.ACTIVE]: 'Активна',
	[CardStatus.ARCHIVED]: 'В архиве',
	[CardStatus.DELETED]: 'Удалена',
	[CardStatus.AWAITING_MODERATION]: 'На модерации',
	[CardStatus.REJECTED]: 'Отклонена',
}

export const cardTypeLabels: Record<CardType, string> = {
	[CardType.SHARE]: 'Поделиться',
	[CardType.RECEIVE]: 'Получить',
}
