import { BooksService } from '@/api/books'
import { ProfileApi } from '@/api/profile'
import {
	Card,
	CardStatus,
	CreateCardDto,
	UpdateCardDto,
} from '@/types/card.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'

export const useCards = () => {
	const queryClient = useQueryClient()
	const [selectedCard, setSelectedCard] = useState<Card | null>(null)
	const [cardIdToEdit, setCardIdToEdit] = useState<number | null>(null)

	// Получение всех публичных карточек
	const allPublishedCards = useQuery({
		queryKey: ['publicCards'],
		queryFn: async () => {
			try {
				console.log('Выполняем запрос на получение карточек')
				const result = await BooksService.getAllPublishedCards()
				console.log('Получены карточки с сервера:', result)
				return result // Сервер возвращает массив карточек напрямую в data
			} catch (error) {
				console.error('Ошибка при получении карточек:', error)
				throw error
			}
		},
		refetchOnWindowFocus: true, // Обновлять данные при возвращении на вкладку
		staleTime: 10000, // Данные считаются устаревшими через 10 секунд
	})

	// Получение карточки по ID
	const getCardById = useQuery({
		queryKey: ['card', cardIdToEdit],
		queryFn: () =>
			cardIdToEdit ? BooksService.getCardById(cardIdToEdit) : null,
		enabled: !!cardIdToEdit,
	})
	// Получение карточек пользователя
	const userCards = useQuery({
		queryKey: ['userCards'],
		queryFn: ProfileApi.getUserCards,
	})

	// Фильтрация карточек пользователя по статусу
	const getCardsByStatus = (status: CardStatus) => {
		return userCards.data?.filter(card => card.status === status) || []
	}

	// Создание новой карточки
	const createCard = useMutation({
		mutationFn: (data: CreateCardDto) => BooksService.createCard(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userCards'] })
			queryClient.invalidateQueries({ queryKey: ['publicCards'] })
			toast.success('Карточка успешно создана')
		},
		onError: (error: any) => {
			toast.error(
				`Ошибка при создании карточки: ${
					error.message || 'Неизвестная ошибка'
				}`,
			)
		},
	})

	// Обновление карточки
	const updateCard = useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateCardDto }) =>
			BooksService.updateCard(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userCards'] })
			queryClient.invalidateQueries({ queryKey: ['publicCards'] })
			queryClient.invalidateQueries({ queryKey: ['card', cardIdToEdit] })
			toast.success('Карточка успешно обновлена')
		},
		onError: (error: any) => {
			toast.error(
				`Ошибка при обновлении карточки: ${
					error.message || 'Неизвестная ошибка'
				}`,
			)
		},
	})

	// Архивация карточки
	const archiveCard = useMutation({
		mutationFn: (id: number) => BooksService.archiveCard(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userCards'] })
			queryClient.invalidateQueries({ queryKey: ['publicCards'] })
			toast.success('Карточка перемещена в архив')
		},
		onError: (error: any) => {
			toast.error(
				`Ошибка при архивации карточки: ${
					error.message || 'Неизвестная ошибка'
				}`,
			)
		},
	})

	// Удаление карточки
	const deleteCard = useMutation({
		mutationFn: (id: number) => BooksService.deleteCard(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userCards'] })
			queryClient.invalidateQueries({ queryKey: ['publicCards'] })
			toast.success('Карточка удалена')
		},
		onError: (error: any) => {
			toast.error(
				`Ошибка при удалении карточки: ${
					error.message || 'Неизвестная ошибка'
				}`,
			)
		},
	})

	return {
		// Данные
		allPublishedCards: {
			data: allPublishedCards.data || [], // Возвращаем массив, а не объект
			isLoading: allPublishedCards.isLoading,
			error: allPublishedCards.error,
		},
		userCards: {
			data: userCards.data || [],
			isLoading: userCards.isLoading,
			error: userCards.error,
			active: getCardsByStatus(CardStatus.ACTIVE),
			archived: getCardsByStatus(CardStatus.ARCHIVED),
			moderation: getCardsByStatus(CardStatus.AWAITING_MODERATION),
			rejected: getCardsByStatus(CardStatus.REJECTED),
		},
		selectedCard,

		// Установка ID карточки для редактирования
		setCardIdToEdit,
		cardIdToEdit,
		getCardById: {
			data: getCardById.data,
			isLoading: getCardById.isLoading,
			error: getCardById.error,
		},

		// Действия
		setSelectedCard,
		createCard: (data: CreateCardDto) => createCard.mutate(data),
		updateCard: (id: number, data: UpdateCardDto) =>
			updateCard.mutate({ id, data }),
		archiveCard: (id: number) => archiveCard.mutate(id),
		deleteCard: (id: number) => deleteCard.mutate(id),

		// Состояния
		isCreating: createCard.isPending,
		isUpdating: updateCard.isPending,
		isArchiving: archiveCard.isPending,
		isDeleting: deleteCard.isPending,
	}
}
