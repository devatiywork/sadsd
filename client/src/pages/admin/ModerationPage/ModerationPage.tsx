import { BookCard } from '@/components/card/BookCard'
import { Button, CardGrid, Loader } from '@/components/ui'
import { useAdmin } from '@/hooks/useAdmin'
import { Card as CardType } from '@/types/card.types'
import { CardDetailsModal } from '@pages/cards/CardDetailsModal/CardDetailsModal'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { RejectCardModal } from '../components/RejectCardModal'

export const ModerationPage: React.FC = () => {
	const { moderationCards, approveCard, rejectCard, isApproving, isRejecting } =
		useAdmin()
	const [cardToReject, setCardToReject] = useState<number | null>(null)
	const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
	const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

	const handleApprove = (cardId: number) => {
		approveCard(cardId)
	}

	const handleRejectClick = (cardId: number) => {
		setCardToReject(cardId)
		setIsRejectModalOpen(true)
	}

	const handleRejectConfirm = (reason: string) => {
		if (cardToReject !== null) {
			rejectCard(cardToReject, reason)
			setIsRejectModalOpen(false)
		}
	}

	const handleViewCard = (card: CardType) => {
		setSelectedCard(card)
		setIsDetailsModalOpen(true)
	}

	const closeDetailsModal = () => {
		setIsDetailsModalOpen(false)
	}

	return (
		<div className='space-y-6'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h1 className='text-2xl font-bold text-gray-900 mb-6'>
					Модерация карточек
				</h1>

				{moderationCards.isLoading ? (
					<div className='flex justify-center py-10'>
						<Loader size='lg' />
					</div>
				) : moderationCards.data.length > 0 ? (
					<CardGrid columns={3} gap='md'>
						{moderationCards.data.map(card => (
							<div key={card.id} className='relative'>
								<BookCard
									card={{
										...card,
										dateCreate:
											typeof card.dateCreate === 'string'
												? card.dateCreate
												: new Date(card.dateCreate).toISOString(),
										user: card.user
											? {
													id: card.user.id || 0,
													FIO: card.user.FIO || 'Не указано',
											  }
											: undefined,
									}}
									onView={handleViewCard}
									showStatus
								/>
								<div className='mt-2 flex space-x-2'>
									<Button
										fullWidth
										variant='outline'
										size='sm'
										onClick={() => handleApprove(card.id)}
										icon={<Check size={16} className='text-green-500' />}
										disabled={isApproving}
									>
										Одобрить
									</Button>
									<Button
										fullWidth
										variant='outline'
										size='sm'
										onClick={() => handleRejectClick(card.id)}
										icon={<X size={16} className='text-red-500' />}
										disabled={isRejecting}
									>
										Отклонить
									</Button>
								</div>
							</div>
						))}
					</CardGrid>
				) : (
					<div className='text-center py-10'>
						<p className='text-gray-500'>Нет карточек для модерации</p>
					</div>
				)}
			</motion.div>

			<RejectCardModal
				isOpen={isRejectModalOpen}
				onClose={() => setIsRejectModalOpen(false)}
				onConfirm={handleRejectConfirm}
				isLoading={isRejecting}
				title='Отклонение карточки'
				description='Укажите причину отклонения карточки. Эта информация будет отображаться для пользователя.'
				confirmText='Отклонить'
			/>

			{/* Модальное окно с деталями карточки */}
			<CardDetailsModal
				isOpen={isDetailsModalOpen}
				onClose={closeDetailsModal}
				card={selectedCard}
			/>
		</div>
	)
}
