import { AdminService } from '@/api/admin'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useAdmin = () => {
	const queryClient = useQueryClient()

	// Получение списка пользователей
	const users = useQuery({
		queryKey: ['admin', 'users'],
		queryFn: AdminService.getAllUsers,
	})

	// Получение карточек на модерацию
	const moderationCards = useQuery({
		queryKey: ['admin', 'moderation-cards'],
		queryFn: AdminService.getCardsForModeration,
	})

	// Бан пользователя
	const banUser = useMutation({
		mutationFn: ({ userId, reason }: { userId: number; reason: string }) =>
			AdminService.banUser(userId, { reason }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
			toast.success('Пользователь заблокирован')
		},
		onError: (error: any) => {
			toast.error(
				`Ошибка при блокировке пользователя: ${
					error.message || 'Неизвестная ошибка'
				}`,
			)
		},
	})

	// Разбан пользователя
	const unbanUser = useMutation({
		mutationFn: (userId: number) => AdminService.unbanUser(userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
			toast.success('Пользователь разблокирован')
		},
		onError: (error: any) => {
			toast.error(
				`Ошибка при разблокировке пользователя: ${
					error.message || 'Неизвестная ошибка'
				}`,
			)
		},
	})

	// Одобрение карточки
	const approveCard = useMutation({
		mutationFn: (cardId: number) => AdminService.approveCard(cardId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'moderation-cards'] })
			queryClient.invalidateQueries({ queryKey: ['publicCards'] })
			toast.success('Карточка одобрена')
		},
		onError: (error: any) => {
			toast.error(
				`Ошибка при одобрении карточки: ${
					error.message || 'Неизвестная ошибка'
				}`,
			)
		},
	})

	// Отклонение карточки
	const rejectCard = useMutation({
		mutationFn: ({ cardId, reason }: { cardId: number; reason: string }) =>
			AdminService.rejectCard(cardId, { reason }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'moderation-cards'] })
			toast.success('Карточка отклонена')
		},
		onError: (error: any) => {
			toast.error(
				`Ошибка при отклонении карточки: ${
					error.message || 'Неизвестная ошибка'
				}`,
			)
		},
	})

	// Удаление карточки
	const deleteCard = useMutation({
		mutationFn: ({ cardId, reason }: { cardId: number; reason: string }) =>
			AdminService.deleteCard(cardId, { reason }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'moderation-cards'] })
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
		users: {
			data: users.data || [],
			isLoading: users.isLoading,
			error: users.error,
		},
		moderationCards: {
			data: moderationCards.data || [],
			isLoading: moderationCards.isLoading,
			error: moderationCards.error,
		},

		// Действия
		banUser: (userId: number, reason: string) =>
			banUser.mutate({ userId, reason }),
		unbanUser: (userId: number) => unbanUser.mutate(userId),
		approveCard: (cardId: number) => approveCard.mutate(cardId),
		rejectCard: (cardId: number, reason: string) =>
			rejectCard.mutate({ cardId, reason }),
		deleteCard: (cardId: number, reason: string) =>
			deleteCard.mutate({ cardId, reason }),

		// Состояния
		isBanning: banUser.isPending,
		isUnbanning: unbanUser.isPending,
		isApproving: approveCard.isPending,
		isRejecting: rejectCard.isPending,
		isDeleting: deleteCard.isPending,
	}
}
