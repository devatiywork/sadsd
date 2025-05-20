import { Card, User } from '../types'

export interface ProfileResponse {
	user: User
}

export interface UserCardsResponse {
	cards: Card[]
}
