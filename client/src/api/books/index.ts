import { Card, CreateCardDto, UpdateCardDto } from '@/types/card.types'
import { ApiService } from '../utils/api.service'
import { CardsResponse } from './types'

export class BooksService {
	/**
	 * Получение всех опубликованных карточек
	 */
	static async getAllPublishedCards(): Promise<CardsResponse> {
		return ApiService.get<CardsResponse>('/books')
	}

	/**
	 * Получение карточки по ID
	 */
	static async getCardById(cardId: number): Promise<Card> {
		return ApiService.get<Card>(`/books/${cardId}`)
	}

	/**
	 * Создание новой карточки
	 */
	static async createCard(data: CreateCardDto): Promise<Card> {
		return ApiService.post<Card>('/books', data)
	}

	/**
	 * Обновление карточки
	 */
	static async updateCard(cardId: number, data: UpdateCardDto): Promise<Card> {
		return ApiService.put<Card>(`/books/${cardId}`, data)
	}

	/**
	 * Удаление карточки
	 */
	static async deleteCard(cardId: number): Promise<void> {
		return ApiService.delete<void>(`/books/${cardId}`)
	}

	/**
	 * Архивация карточки
	 */
	static async archiveCard(cardId: number): Promise<Card> {
		return ApiService.put<Card>(`/books/${cardId}/archive`)
	}
}

export * from './types'
