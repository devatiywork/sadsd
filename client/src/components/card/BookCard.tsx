import { Button, Card } from '@/components/ui'
import {
	CardStatus,
	Card as CardType,
	CardType as CardTypeEnum,
	cardStatusLabels,
	cardTypeLabels,
} from '@/types/card.types'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { ArchiveIcon, ArrowUpRightIcon, Edit2, TrashIcon } from 'lucide-react'

interface BookCardProps {
	card: CardType
	onView?: (card: CardType) => void
	onEdit?: (card: CardType) => void // Добавляем обработчик для редактирования
	onArchive?: (id: number) => void
	onDelete?: (id: number) => void
	showControls?: boolean
	showStatus?: boolean
}

export const BookCard: React.FC<BookCardProps> = ({
	card,
	onView,
	onEdit, // Добавляем пропс
	onArchive,
	onDelete,
	showControls = false,
	showStatus = false,
}) => {
	const handleView = () => onView && onView(card)
	const handleEdit = () => onEdit && onEdit(card) // Добавляем обработчик
	const handleArchive = () => onArchive && onArchive(card.id)
	const handleDelete = () => onDelete && onDelete(card.id)

	const formattedDate = format(
		typeof card.dateCreate === 'string'
			? parseISO(card.dateCreate)
			: card.dateCreate,
		'dd MMMM yyyy',
		{
			locale: ru,
		},
	)

	const typeClass =
		card.type === CardTypeEnum.SHARE
			? 'bg-green-100 text-green-800'
			: 'bg-blue-100 text-blue-800'

	const statusClass =
		card.status === CardStatus.ACTIVE
			? 'bg-green-100 text-green-800'
			: card.status === CardStatus.ARCHIVED
			? 'bg-gray-100 text-gray-800'
			: card.status === CardStatus.AWAITING_MODERATION
			? 'bg-yellow-100 text-yellow-800'
			: card.status === CardStatus.REJECTED
			? 'bg-red-100 text-red-800'
			: 'bg-gray-100 text-gray-800'

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			whileHover={{ y: -5 }}
			className='h-full'
		>
			<Card className='h-full flex flex-col'>
				<div className='flex justify-between items-start mb-2'>
					<div className='flex flex-wrap gap-2'>
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium ${typeClass}`}
						>
							{cardTypeLabels[card.type as number]}
						</span>
						{showStatus && (
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}
							>
								{cardStatusLabels[card.status as CardStatus]}
							</span>
						)}
					</div>
					<span className='text-xs text-gray-500'>{formattedDate}</span>
				</div>

				<h3 className='text-lg font-medium text-gray-900'>{card.title}</h3>
				<p className='text-gray-600'>Автор: {card.author}</p>

				{card.publisher && (
					<p className='text-sm text-gray-500'>
						Издательство: {card.publisher}
					</p>
				)}

				<div className='flex flex-wrap gap-x-4 text-sm text-gray-500 mt-1'>
					{card.year && <span>Год: {card.year}</span>}
					{card.binding && <span>Переплет: {card.binding}</span>}
				</div>

				{card.condition && (
					<p className='text-sm text-gray-500 mt-1'>
						Состояние: {card.condition}
					</p>
				)}

				{card.user && (
					<p className='text-sm text-gray-500 mt-2'>
						Пользователь: {card.user.FIO}
					</p>
				)}

				{card.removeReason && (
					<div className='mt-2 p-2 bg-red-50 rounded-md'>
						<p className='text-sm text-red-600'>Причина: {card.removeReason}</p>
					</div>
				)}

				{showControls && (
					<div className='mt-auto pt-4 flex gap-3 overflow-y-auto'>
						<Button
							size='sm'
							variant='outline'
							onClick={handleView}
							icon={<ArrowUpRightIcon size={16} />}
						>
							Просмотр
						</Button>
						{onEdit && (
							<Button
								size='sm'
								variant='outline'
								onClick={handleEdit}
								icon={<Edit2 size={16} />}
							>
								Редактировать
							</Button>
						)}
						{card.status === CardStatus.ACTIVE && onArchive && (
							<Button
								size='sm'
								variant='outline'
								onClick={handleArchive}
								icon={<ArchiveIcon size={16} />}
							>
								В архив
							</Button>
						)}
						{onDelete && (
							<Button
								size='sm'
								variant='outline'
								onClick={handleDelete}
								icon={<TrashIcon size={16} />}
							>
								Удалить
							</Button>
						)}
					</div>
				)}
			</Card>
		</motion.div>
	)
}
