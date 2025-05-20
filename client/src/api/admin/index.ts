import { Card, User } from '../types'
import { ApiService } from '../utils/api.service'
import { BanUserDto, RejectCardDto } from './types'

export class AdminService {
	/**
	 * Получение списка всех пользователей
	 */
	static async getAllUsers(): Promise<User[]> {
		return ApiService.get<User[]>('/admin/users')
	}

	/**
	 * Бан пользователя
	 */
	static async banUser(userId: number, data: BanUserDto): Promise<User> {
		return ApiService.put<User>(`/admin/users/${userId}/ban`, data)
	}

	/**
	 * Разбан пользователя
	 */
	static async unbanUser(userId: number): Promise<User> {
		return ApiService.put<User>(`/admin/users/${userId}/unban`)
	}

	/**
	 * Получение карточек на модерацию
	 */
	static async getCardsForModeration(): Promise<Card[]> {
		return ApiService.get<Card[]>('/admin/cards/moderation')
	}

	/**
	 * Одобрение карточки
	 */
	static async approveCard(cardId: number): Promise<Card> {
		return ApiService.put<Card>(`/admin/cards/${cardId}/approve`)
	}

	/**
	 * Отклонение карточки
	 */
	static async rejectCard(cardId: number, data: RejectCardDto): Promise<Card> {
		return ApiService.put<Card>(`/admin/cards/${cardId}/reject`, data)
	}

	/**
	 * Удаление карточки
	 */
	static async deleteCard(cardId: number, data: RejectCardDto): Promise<void> {
		return ApiService.put<void>(`/admin/cards/${cardId}/delete`, data)
	}
}

export * from './types'
