import { Button, Card, Input, Select } from '@/components/ui'
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
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { CardPreview } from '../CardPreview/CardPreview'
import {
	CreateCardFormValues,
	createCardSchema,
	defaultValues,
} from '../schemas/card.schema'

export const CreateCardPage: React.FC = () => {
	const { createCard, isCreating } = useCards()
	const navigate = useNavigate()
	const [showPreview, setShowPreview] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		watch,
		reset,
	} = useForm<CreateCardFormValues>({
		resolver: zodResolver(createCardSchema),
		defaultValues,
		mode: 'onChange', // Добавляем режим валидации при изменении
	})

	const formValues = watch()
	// Добавляем отладочную информацию
	console.log('Form errors:', errors)
	console.log('Is form valid:', isValid)

	const onSubmit: SubmitHandler<CreateCardFormValues> = data => {
		try {
			// Убедимся, что данные корректны перед отправкой
			createCard({
				...data,
				// Преобразуем year в число или undefined (не null!) для соответствия API
				year: data.year !== null ? Number(data.year) : undefined,
				// Убедимся, что тип всегда число
				type: Number(data.type),
				// Гарантируем, что строковые поля - строки
				publisher: data.publisher || '',
				binding: data.binding || '',
				condition: data.condition || '',
			})

			reset()
			navigate('/profile')
		} catch (error) {
			console.error('Error submitting form:', error)
		}
	}

	const togglePreview = () => {
		setShowPreview(!showPreview)
	}

	return (
		<div className='max-w-3xl mx-auto'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h1 className='text-2xl font-bold text-gray-900 mb-6'>
					Создание карточки
				</h1>

				<Card>
					{isCreating ? (
						<div className='flex justify-center py-6'>
							<div className='text-center'>
								<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto'></div>
								<p className='mt-3 text-gray-600'>Создание карточки...</p>
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
								<Button type='button' variant='outline' onClick={togglePreview}>
									{showPreview ? 'Скрыть предпросмотр' : 'Предпросмотр'}
								</Button>
								<Button type='submit' disabled={!isValid || isCreating}>
									Создать карточку
								</Button>
							</div>
						</form>
					)}
				</Card>

				{showPreview && (
					<div className='mt-8'>
						<h2 className='text-lg font-medium text-gray-900 mb-4'>
							Предпросмотр
						</h2>
						<CardPreview formData={formValues} />
					</div>
				)}
			</motion.div>
		</div>
	)
}
