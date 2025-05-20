import { Card } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { CardType, cardTypeLabels } from '@/types/card.types'
import { CreateCardFormValues } from '../schemas/card.schema'

interface CardPreviewProps {
	formData: CreateCardFormValues
}

export const CardPreview: React.FC<CardPreviewProps> = ({ formData }) => {
	const { user } = useAuth()

	const typeClass =
		formData.type === CardType.SHARE
			? 'bg-green-100 text-green-800'
			: 'bg-blue-100 text-blue-800'

	// Проверяем, что значения не undefined перед их использованием
	const title = formData.title || 'Название книги'
	const author = formData.author || 'Автор книги'
	const type =
		typeof formData.type === 'number' ? formData.type : CardType.SHARE
	const publisher = formData.publisher || ''
	const year = formData.year || null
	const binding = formData.binding || ''
	const condition = formData.condition || ''

	return (
		<Card className='overflow-hidden'>
			<div className='flex items-center justify-between mb-3'>
				<span
					className={`px-2 py-1 rounded-full text-xs font-medium ${typeClass}`}
				>
					{cardTypeLabels[type as CardType]}
				</span>
				<span className='text-xs text-gray-500'>
					{new Date().toLocaleDateString('ru-RU')}
				</span>
			</div>

			<h3 className='text-lg font-medium text-gray-900'>{title}</h3>

			<p className='text-gray-600'>Автор: {author}</p>

			{publisher && (
				<p className='text-sm text-gray-500 mt-1'>Издательство: {publisher}</p>
			)}

			<div className='flex flex-wrap gap-x-4 text-sm text-gray-500 mt-1'>
				{year && <span>Год: {year}</span>}
				{binding && <span>Переплет: {binding}</span>}
			</div>

			{condition && (
				<p className='text-sm text-gray-500 mt-1'>Состояние: {condition}</p>
			)}

			{user && (
				<p className='text-sm text-gray-500 mt-3'>
					Пользователь: {user.FIO || ''}
				</p>
			)}

			<div className='mt-4 pt-3 border-t border-gray-100'>
				<p className='text-xs text-yellow-600 font-medium'>
					Эта карточка будет отправлена на модерацию после создания
				</p>
			</div>
		</Card>
	)
}
