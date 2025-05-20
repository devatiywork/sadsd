import { User } from '@/types/auth.types'
import { Card } from '@/types/card.types'
import { ApiService } from '../utils/api.service'

export class ProfileApi {
	static async getProfile(): Promise<User> {
		const response = await ApiService.get<User>('/profile')
		return response
	}

	static async getUserCards(): Promise<Card[]> {
		const response = await ApiService.get<Card[]>('/profile/cards')
		return response
	}

	static async archiveCard(id: number): Promise<Card> {
		const response = await ApiService.put<Card>(`/profile/cards/${id}/archive`)
		return response
	}
}
