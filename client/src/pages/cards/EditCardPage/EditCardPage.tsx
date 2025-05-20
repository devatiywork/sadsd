import {
	Button,
	Card as CardComponent,
	Input,
	Loader,
	Select,
} from '@/components/ui'
import { useCards } from '@/hooks/useCards'
import { CardType, cardTypeLabels } from '@/types/card.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
	Bookmark,
	BookOpen,
	CalendarIcon,
	Package,
	UserIcon,
} from 'lucide-react'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { CardPreview } from '../CardPreview/CardPreview'
import {
	CreateCardFormValues,
	createCardSchema,
	defaultValues,
} from '../schemas/card.schema'

export const EditCardPage: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const cardId = id ? parseInt(id) : undefined
	const navigate = useNavigate()
	const { getCardById, updateCard, isUpdating, setCardIdToEdit } = useCards()
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		watch,
		setValue,
	} = useForm<CreateCardFormValues>({
		resolver: zodResolver(createCardSchema),
		defaultValues,
		mode: 'onChange',
	})

	const formValues = watch() // ВАЖНО: Используем useEffect для навигации вместо прямого вызова navigate
	useEffect(() => {
		if (!cardId) {
			navigate('/profile')
		} else {
			// Вызываем setCardIdToEdit для загрузки данных карточки
			setCardIdToEdit(cardId)
		}
	}, [cardId, navigate, setCardIdToEdit])

	// Загружаем данные карточки при монтировании
	useEffect(() => {
		if (cardId && getCardById.data) {
			const card = getCardById.data
			setValue('title', card.title)
			setValue('author', card.author)
			setValue('type', card.type)
			setValue('publisher', card.publisher || '')
			setValue('year', card.year || null)
			setValue('binding', card.binding || '')
			setValue('condition', card.condition || '')
		}
	}, [cardId, getCardById.data, setValue])
	const onSubmit: SubmitHandler<CreateCardFormValues> = data => {
		if (!cardId) return

		try {
			// Преобразование данных
			const yearValue =
				data.year !== undefined && data.year !== null
					? Number(data.year)
					: undefined

			updateCard(cardId, {
				...data,
				year: yearValue,
				type: Number(data.type),
				publisher: data.publisher || undefined,
				binding: data.binding || undefined,
				condition: data.condition || undefined,
			})

			// Вместо прямого перехода, используем setTimeout для отложенной навигации
			setTimeout(() => {
				navigate('/profile')
			}, 300)
		} catch (error) {
			console.error('Error updating card:', error)
		}
	}

	// Если ID карточки не указан, возвращаем null вместо перехода
	if (!cardId) {
		return null
	}

	// Если данные загружаются, показываем индикатор загрузки
	if (getCardById.isLoading) {
		return (
			<div className='flex justify-center py-10'>
				<Loader size='lg' />
			</div>
		)
	}

	// Если карточка не найдена
	if (!getCardById.data) {
		return (
			<div className='text-center py-10'>
				<p className='text-gray-500'>Карточка не найдена</p>
				<Button className='mt-4' onClick={() => navigate('/profile')}>
					Вернуться в профиль
				</Button>
			</div>
		)
	}

	return (
		<div className='max-w-3xl mx-auto'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h1 className='text-2xl font-bold text-gray-900 mb-6'>
					Редактирование карточки
				</h1>{' '}
				<CardComponent>
					{isUpdating ? (
						<div className='flex justify-center py-6'>
							<div className='text-center'>
								<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto'></div>
								<p className='mt-3 text-gray-600'>Обновление карточки...</p>
							</div>
						</div>
					) : (
						<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<Input
										label='Название книги'
										placeholder='Введите название'
										icon={<BookOpen size={18} className='text-gray-400' />}
										{...register('title')}
										error={errors.title?.message}
									/>
								</div>

								<div>
									<Input
										label='Автор'
										placeholder='Введите автора'
										icon={<UserIcon size={18} className='text-gray-400' />}
										{...register('author')}
										error={errors.author?.message}
									/>
								</div>

								<div>
									<Select
										label='Тип карточки'
										options={[
											{
												value: CardType.SHARE,
												label: cardTypeLabels[CardType.SHARE],
											},
											{
												value: CardType.RECEIVE,
												label: cardTypeLabels[CardType.RECEIVE],
											},
										]}
										{...register('type', { valueAsNumber: true })}
										error={errors.type?.message}
									/>
								</div>

								<div>
									<Input
										label='Издательство'
										placeholder='Введите издательство (необязательно)'
										icon={<Bookmark size={18} className='text-gray-400' />}
										{...register('publisher')}
										error={errors.publisher?.message}
									/>
								</div>

								<div>
									<Input
										label='Год издания'
										placeholder='Введите год издания (необязательно)'
										icon={<CalendarIcon size={18} className='text-gray-400' />}
										type='number'
										{...register('year', {
											setValueAs: value =>
												value === '' || value === undefined
													? null
													: Number(value),
										})}
										error={errors.year?.message}
									/>
								</div>

								<div>
									<Input
										label='Переплет'
										placeholder='Описание переплета (необязательно)'
										icon={<Package size={18} className='text-gray-400' />}
										{...register('binding')}
										error={errors.binding?.message}
									/>
								</div>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Состояние
								</label>
								<textarea
									className='w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
									placeholder='Опишите состояние книги (необязательно)'
									rows={3}
									{...register('condition')}
								></textarea>
								{errors.condition && (
									<p className='mt-1 text-sm text-red-600'>
										{errors.condition.message}
									</p>
								)}
							</div>

							<div className='flex justify-between pt-4'>
								<Button
									type='button'
									variant='outline'
									onClick={() => navigate('/profile')}
								>
									Отмена
								</Button>
								<Button type='submit' disabled={!isValid || isUpdating}>
									Сохранить изменения
								</Button>{' '}
							</div>
						</form>
					)}
				</CardComponent>
				<div className='mt-8'>
					<h2 className='text-lg font-medium text-gray-900 mb-4'>
						Предпросмотр
					</h2>
					<CardPreview formData={formValues} />
				</div>
			</motion.div>
		</div>
	)
}
