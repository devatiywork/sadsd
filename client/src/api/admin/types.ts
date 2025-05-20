import { Card, User } from '../types'

export interface ModerateCardDto {
	reason: string
}

export interface UserResponse {
	users: User[]
}

export interface CardsForModerationResponse {
	cards: Card[]
}

export interface BanUserDto {
	reason: string
}

export interface RejectCardDto {
	reason: string
}
