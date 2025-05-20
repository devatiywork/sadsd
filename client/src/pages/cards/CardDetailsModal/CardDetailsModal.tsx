import { Button, Modal } from '@/components/ui'
import {
	Card as CardType,
	CardType as CardTypeEnum,
	cardTypeLabels,
} from '@/types/card.types'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

interface CardDetailsModalProps {
	isOpen: boolean
	onClose: () => void
	card: CardType | null
}

export const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
	isOpen,
	onClose,
	card,
}) => {
	if (!card) return null

	const formattedDate = card.dateCreate
		? format(
				typeof card.dateCreate === 'string'
					? parseISO(card.dateCreate)
					: card.dateCreate,
				'dd MMMM yyyy',
				{ locale: ru },
		  )
		: ''

	const typeClass =
		card.type === CardTypeEnum.SHARE
			? 'bg-green-100 text-green-800'
			: 'bg-blue-100 text-blue-800'

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Информация о книге'
			footer={
				<div className='flex justify-end'>
					<Button variant='outline' onClick={onClose}>
						Закрыть
					</Button>
				</div>
			}
		>
			<div className='space-y-4'>
				<div className='flex items-center justify-between'>
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${typeClass}`}
					>
						{cardTypeLabels[card.type as CardTypeEnum]}
					</span>
					<span className='text-sm text-gray-500'>{formattedDate}</span>
				</div>

				<div>
					<h3 className='text-lg font-medium text-gray-900'>{card.title}</h3>
					<p className='text-gray-600'>Автор: {card.author}</p>
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
					{card.publisher && (
						<div>
							<p className='text-sm font-medium text-gray-500'>Издательство</p>
							<p>{card.publisher}</p>
						</div>
					)}

					{card.year && (
						<div>
							<p className='text-sm font-medium text-gray-500'>Год издания</p>
							<p>{card.year}</p>
						</div>
					)}

					{card.binding && (
						<div>
							<p className='text-sm font-medium text-gray-500'>Переплет</p>
							<p>{card.binding}</p>
						</div>
					)}

					{card.condition && (
						<div>
							<p className='text-sm font-medium text-gray-500'>Состояние</p>
							<p>{card.condition}</p>
						</div>
					)}
				</div>

				{card.user && (
					<div className='pt-2 border-t border-gray-200'>
						<p className='text-sm font-medium text-gray-500'>Пользователь</p>
						<p>{card.user.FIO}</p>
					</div>
				)}
			</div>
		</Modal>
	)
}
