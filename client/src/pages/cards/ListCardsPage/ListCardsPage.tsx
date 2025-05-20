import { BookCard } from '@/components/card/BookCard'
import { Button, CardGrid, Loader } from '@/components/ui'
import { useCards } from '@/hooks/useCards'
import { Card } from '@/types/card.types'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { RefreshCw, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CardDetailsModal } from '../CardDetailsModal/CardDetailsModal'

export const ListCardsPage: React.FC = () => {
	const { allPublishedCards } = useCards()
	const queryClient = useQueryClient()
	const [selectedCard, setSelectedCard] = useState<Card | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')

	// Добавляем принудительное обновление при монтировании
	useEffect(() => {
		queryClient.invalidateQueries({ queryKey: ['publicCards'] })
	}, [queryClient])

	// Функция для ручного обновления списка
	const refreshCards = () => {
		queryClient.invalidateQueries({ queryKey: ['publicCards'] })
	}

	const handleViewCard = (card: Card) => {
		setSelectedCard(card)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
	}

	// Фильтрация карточек по поиску (с защитой от undefined)
	// Если CardsResponse - это массив
	const filteredCards = Array.isArray(allPublishedCards.data)
		? allPublishedCards.data.filter(
				card =>
					card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					card.author.toLowerCase().includes(searchTerm.toLowerCase()),
		  )
		: []

	// Если CardsResponse - это объект с полем data
	// const filteredCards = Array.isArray(allPublishedCards.data?.data)
	//   ? allPublishedCards.data.data.filter(
	//         card =>
	//           card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
	//           card.author.toLowerCase().includes(searchTerm.toLowerCase()),
	//     )
	//   : [];

	// Только карточки с типом "поделиться"
	const shareCards = filteredCards.filter(card => card.type === 0) // Используем 0 вместо CardType.SHARE

	console.log('Все опубликованные карточки:', allPublishedCards.data)
	console.log('Карточки после фильтрации:', filteredCards)
	console.log('Карточки с типом "поделиться":', shareCards)

	return (
		<div className='space-y-6'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-2xl font-bold text-gray-900'>Доступные книги</h1>
					<Button
						variant='outline'
						size='sm'
						onClick={refreshCards}
						icon={<RefreshCw size={16} />}
					>
						Обновить
					</Button>
				</div>

				{/* Поиск */}
				<div className='relative max-w-md mb-6'>
					<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
						<SearchIcon className='h-5 w-5 text-gray-400' />
					</div>
					<input
						type='text'
						placeholder='Поиск по названию или автору'
						className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
					/>
				</div>

				{allPublishedCards.isLoading ? (
					<div className='flex justify-center py-10'>
						<Loader size='lg' />
					</div>
				) : shareCards.length > 0 ? (
					<CardGrid columns={3} gap='md'>
						{shareCards.map(card => (
							<BookCard
								key={card.id}
								card={{
									...card,
									// Преобразуем строку в объект Date если нужно
									dateCreate:
										typeof card.dateCreate === 'string'
											? card.dateCreate
											: new Date(card.dateCreate).toISOString(),
									// Убедимся, что user имеет нужную структуру
									user: card.user
										? {
												id: card.user.id || 0, // Используем 0 по умолчанию если id не определен
												FIO: card.user.FIO || 'Не указано', // Используем 'Не указано' по умолчанию если FIO не определено
										  }
										: undefined,
								}}
								onView={handleViewCard}
							/>
						))}
					</CardGrid>
				) : (
					<div className='text-center py-10'>
						<p className='text-gray-500'>Нет доступных книг для отображения</p>
						<p className='text-gray-500 mt-2'>Попробуйте обновить список</p>
					</div>
				)}
			</motion.div>

			{/* Модальное окно с деталями карточки */}
			<CardDetailsModal
				isOpen={isModalOpen}
				onClose={closeModal}
				card={selectedCard}
			/>
		</div>
	)
}
