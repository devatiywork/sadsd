export interface User {
	id: number
	login: string
	password: string
	FIO: string
	phone: string
	email: string
	dateRegister: Date
	status: number // 0 - активен, 1 - забанен
	isAdmin: boolean
}

export interface Card {
	id: number
	userId: number
	status: number // 0 - активна, 1 - архив, 2 - удалена
	removeReason?: string
	title: string
	type: number // 0 - поделиться, 1 - получить
	author: string
	publisher?: string
	year?: number
	binding?: string
	condition?: string
	dateCreate: Date
	user?: User
}

export interface RegisterDto {
	FIO: string
	phone: string
	email: string
	login: string
	password: string
}

export interface LoginDto {
	login: string
	password: string
}

export interface TokenPayload {
	userId: number
	login: string
	isAdmin: boolean
}

export interface AuthResponse {
	user: {
		id: number
		login: string
		FIO: string
		email: string
		isAdmin: boolean
	}
	token: string
}

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

export interface CreateCardDto {
	title: string
	type: number
	author: string
	publisher?: string
	year?: number
	binding?: string
	condition?: string
}

export interface UpdateCardDto extends Partial<CreateCardDto> {}

export interface ModerateCardDto {
	reason: string
}

export interface ApiResponse<T = any> {
	success: boolean
	data?: T
	message?: string
	error?: any
}
