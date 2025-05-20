import { ProfileApi } from '@/api/profile'
import { BookCard } from '@/components/card/BookCard'
import {
	Button,
	Card as CardComponent,
	CardGrid,
	Loader,
} from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { useCards } from '@/hooks/useCards'
import { Card, CardStatus } from '@/types/card.types'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DeleteCardModal } from '../../../components/ui/DeleteCardModal/DeleteCardModal'
import { CardDetailsModal } from '../../cards/CardDetailsModal/CardDetailsModal'

interface UserProfile {
	id: number
	FIO: string
	login: string
	email: string
	phone?: string
}

type TabType = 'active' | 'archived' | 'moderation' | 'rejected'

export const ProfilePage: React.FC = () => {
	const { user } = useAuth()
	const { userCards, setSelectedCard, selectedCard, archiveCard, deleteCard } =
		useCards()
	const [activeTab, setActiveTab] = useState<TabType>('active')
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [cardToDelete, setCardToDelete] = useState<number | null>(null)
	const navigate = useNavigate()

	// Дополнительно получаем данные профиля
	const { data: profile, isLoading: isProfileLoading } = useQuery<UserProfile>({
		queryKey: ['profile'],
		queryFn: ProfileApi.getProfile,
	})

	const handleTabChange = (tab: TabType) => {
		setActiveTab(tab)
	}

	const handleViewCard = (card: any) => {
		setSelectedCard(card)
		setIsDetailsModalOpen(true)
	}

	const handleArchiveCard = (id: number) => {
		archiveCard(id)
	}

	const handleDeleteCardClick = (id: number) => {
		setCardToDelete(id)
		setIsDeleteModalOpen(true)
	}

	const confirmDeleteCard = () => {
		if (cardToDelete) {
			deleteCard(cardToDelete)
			setIsDeleteModalOpen(false)
		}
	}

	// Добавляем функцию для редактирования карточки
	const handleEditCard = (card: Card) => {
		navigate(`/cards/edit/${card.id}`)
	}

	const renderCardsByStatus = () => {
		let cards
		switch (activeTab) {
			case 'active':
				cards = userCards.active
				break
			case 'archived':
				cards = userCards.archived
				break
			case 'moderation':
				cards = userCards.moderation
				break
			case 'rejected':
				cards = userCards.rejected
				break
			default:
				cards = []
		}

		if (cards.length === 0) {
			return (
				<div className='text-center py-10'>
					<p className='text-gray-500'>Нет карточек в этой категории</p>
				</div>
			)
		}

		return (
			<CardGrid columns={3} gap='md'>
				{cards.map(card => (
					<BookCard
						key={card.id}
						card={card}
						onView={handleViewCard}
						onEdit={handleEditCard} // Добавляем обработчик редактирования
						onArchive={
							card.status === CardStatus.ACTIVE ? handleArchiveCard : undefined
						}
						onDelete={() => handleDeleteCardClick(card.id)}
						showControls
						showStatus
					/>
				))}
			</CardGrid>
		)
	}

	const isLoading = isProfileLoading || userCards.isLoading

	// Количество карточек в каждой категории
	const activeBadge =
		userCards.active.length > 0 ? userCards.active.length : null
	const archivedBadge =
		userCards.archived.length > 0 ? userCards.archived.length : null
	const moderationBadge =
		userCards.moderation.length > 0 ? userCards.moderation.length : null
	const rejectedBadge =
		userCards.rejected.length > 0 ? userCards.rejected.length : null

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='space-y-6'
		>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-900'>Профиль</h1>
				<Link to='/cards/create'>
					<Button icon={<PlusIcon size={16} />}>Создать карточку</Button>
				</Link>
			</div>

			{isLoading ? (
				<div className='flex justify-center py-10'>
					<Loader size='lg' />
				</div>
			) : (
				<>
					{' '}
					<CardComponent className='overflow-hidden'>
						<div className='px-4 py-5 sm:px-6 bg-gray-50 -mx-6 -mt-6 mb-6'>
							<h3 className='text-lg font-medium leading-6 text-gray-900'>
								Информация о пользователе
							</h3>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<p className='text-sm font-medium text-gray-500'>ФИО</p>
								<p>{profile?.FIO || user?.FIO}</p>
							</div>
							<div>
								<p className='text-sm font-medium text-gray-500'>Логин</p>
								<p>{profile?.login || user?.login}</p>
							</div>
							<div>
								<p className='text-sm font-medium text-gray-500'>Email</p>
								<p>{profile?.email || user?.email}</p>
							</div>
							<div>
								<p className='text-sm font-medium text-gray-500'>Телефон</p>
								<p>
									{typeof profile === 'object' &&
									profile !== null &&
									'phone' in profile
										? String(profile.phone)
										: 'Не указан'}
								</p>{' '}
							</div>
						</div>
					</CardComponent>
					<div className='space-y-6'>
						<div className='border-b border-gray-200'>
							<nav className='-mb-px flex space-x-8'>
								<button
									className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
										activeTab === 'active'
											? 'border-indigo-500 text-indigo-600'
											: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
									}`}
									onClick={() => handleTabChange('active')}
								>
									Активные
									{activeBadge && (
										<span className='ml-2 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-600'>
											{activeBadge}
										</span>
									)}
								</button>
								<button
									className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
										activeTab === 'archived'
											? 'border-indigo-500 text-indigo-600'
											: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
									}`}
									onClick={() => handleTabChange('archived')}
								>
									Архивные
									{archivedBadge && (
										<span className='ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600'>
											{archivedBadge}
										</span>
									)}
								</button>
								<button
									className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
										activeTab === 'moderation'
											? 'border-indigo-500 text-indigo-600'
											: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
									}`}
									onClick={() => handleTabChange('moderation')}
								>
									На модерации
									{moderationBadge && (
										<span className='ml-2 px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-600'>
											{moderationBadge}
										</span>
									)}
								</button>
								<button
									className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
										activeTab === 'rejected'
											? 'border-indigo-500 text-indigo-600'
											: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
									}`}
									onClick={() => handleTabChange('rejected')}
								>
									Отклоненные
									{rejectedBadge && (
										<span className='ml-2 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600'>
											{rejectedBadge}
										</span>
									)}
								</button>
							</nav>
						</div>

						<div className='pt-2'>{renderCardsByStatus()}</div>
					</div>
				</>
			)}

			{/* Модальное окно с деталями карточки */}
			<CardDetailsModal
				isOpen={isDetailsModalOpen}
				onClose={() => setIsDetailsModalOpen(false)}
				card={selectedCard}
			/>

			{/* Модальное окно подтверждения удаления */}
			<DeleteCardModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={confirmDeleteCard}
			/>
		</motion.div>
	)
}
