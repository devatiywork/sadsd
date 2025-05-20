import {
	Button,
	Card,
	CardGrid,
	Checkbox,
	Input,
	Loader,
	Modal,
	Select,
} from '@/components/ui'
import { Bell, ChevronRight, Lock, Mail, User } from 'lucide-react'
import React, { useState } from 'react'

export const UIShowcase: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [checkboxValue, setCheckboxValue] = useState(false)

	return (
		<div className='space-y-10 pb-10'>
			<section>
				<h2 className='text-2xl font-bold mb-4'>Кнопки</h2>
				<div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
					<Button variant='primary'>Primary</Button>
					<Button variant='secondary'>Secondary</Button>
					<Button variant='danger'>Danger</Button>
					<Button variant='outline'>Outline</Button>
					<Button variant='ghost'>Ghost</Button>
				</div>

				<h3 className='text-xl font-bold mt-6 mb-4'>Размеры</h3>
				<div className='flex flex-wrap gap-4'>
					<Button size='sm'>Small</Button>
					<Button size='md'>Medium</Button>
					<Button size='lg'>Large</Button>
				</div>

				<h3 className='text-xl font-bold mt-6 mb-4'>Состояния</h3>
				<div className='flex flex-wrap gap-4'>
					<Button isLoading>Loading</Button>
					<Button disabled>Disabled</Button>
					<Button fullWidth className='mt-2'>
						Full Width
					</Button>
				</div>

				<h3 className='text-xl font-bold mt-6 mb-4'>С иконками</h3>
				<div className='flex flex-wrap gap-4'>
					<Button icon={<Mail size={16} />}>С иконкой</Button>
					<Button variant='outline' icon={<Bell size={16} />}>
						Уведомления
					</Button>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold mb-4'>Поля ввода</h2>
				<div className='space-y-4 max-w-md'>
					<Input
						label='Имя пользователя'
						placeholder='Введите имя'
						icon={<User size={18} className='text-gray-400' />}
					/>

					<Input
						label='Email'
						type='email'
						placeholder='example@example.com'
						icon={<Mail size={18} className='text-gray-400' />}
						helpText='Мы никогда не передадим ваш email третьим лицам'
					/>

					<Input
						label='Пароль'
						type='password'
						placeholder='Введите пароль'
						icon={<Lock size={18} className='text-gray-400' />}
					/>

					<Input
						label='С ошибкой'
						placeholder='Поле с ошибкой'
						error='Это поле обязательно для заполнения'
					/>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold mb-4'>Селекты</h2>
				<div className='space-y-4 max-w-md'>
					<Select
						label='Выберите опцию'
						options={[
							{ value: '', label: 'Выберите опцию' },
							{ value: 'option1', label: 'Опция 1' },
							{ value: 'option2', label: 'Опция 2' },
							{ value: 'option3', label: 'Опция 3' },
						]}
					/>

					<Select
						label='С ошибкой'
						error='Пожалуйста, выберите опцию'
						options={[
							{ value: '', label: 'Выберите опцию' },
							{ value: 'option1', label: 'Опция 1' },
							{ value: 'option2', label: 'Опция 2' },
						]}
					/>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold mb-4'>Чекбоксы</h2>
				<div className='space-y-4'>
					<Checkbox
						label='Я согласен с условиями'
						checked={checkboxValue}
						onChange={() => setCheckboxValue(!checkboxValue)}
					/>

					<Checkbox
						label='Чекбокс с ошибкой'
						error='Пожалуйста, примите условия'
					/>

					<Checkbox label='Отключенный чекбокс' disabled />
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold mb-4'>Карточки</h2>
				<div className='space-y-6'>
					<Card title='Простая карточка'>
						<p>
							Это содержимое простой карточки. Карточки могут содержать любой
							контент.
						</p>
					</Card>

					<Card
						title='С кнопками в футере'
						footer={
							<div className='flex justify-end space-x-2'>
								<Button variant='outline'>Отмена</Button>
								<Button>Сохранить</Button>
							</div>
						}
					>
						<p>Эта карточка имеет футер с кнопками действий.</p>
					</Card>

					<Card
						interactive
						onClick={() => alert('Клик по карточке!')}
						className='hover:bg-gray-50'
					>
						<div className='flex justify-between items-center'>
							<div>
								<h3 className='font-medium'>Интерактивная карточка</h3>
								<p className='text-gray-500'>Нажмите для действия</p>
							</div>
							<ChevronRight className='text-gray-400' />
						</div>
					</Card>

					<h3 className='text-xl font-bold mt-6 mb-4'>Сетка карточек</h3>
					<CardGrid columns={3} gap='md'>
						{[1, 2, 3, 4, 5, 6].map(item => (
							<Card key={item} interactive className='hover:bg-gray-50'>
								<h3 className='font-medium'>Карточка {item}</h3>
								<p className='text-gray-500 mt-2'>Краткое описание</p>
							</Card>
						))}
					</CardGrid>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold mb-4'>Лоадеры</h2>
				<div className='flex flex-wrap gap-10'>
					<div className='text-center'>
						<Loader size='sm' />
						<p className='mt-2'>Small</p>
					</div>
					<div className='text-center'>
						<Loader size='md' />
						<p className='mt-2'>Medium</p>
					</div>
					<div className='text-center'>
						<Loader size='lg' />
						<p className='mt-2'>Large</p>
					</div>
					<div className='text-center bg-indigo-600 p-4 rounded'>
						<Loader size='md' color='white' />
						<p className='mt-2 text-white'>На тёмном фоне</p>
					</div>
				</div>
			</section>

			<section>
				<h2 className='text-2xl font-bold mb-4'>Модальные окна</h2>
				<div>
					<Button onClick={() => setIsModalOpen(true)}>
						Открыть модальное окно
					</Button>

					<Modal
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
						title='Заголовок модального окна'
						footer={
							<div className='flex justify-end space-x-2'>
								<Button variant='outline' onClick={() => setIsModalOpen(false)}>
									Отмена
								</Button>
								<Button onClick={() => setIsModalOpen(false)}>
									Подтвердить
								</Button>
							</div>
						}
					>
						<div className='space-y-4'>
							<p>
								Это содержимое модального окна. Здесь можно размещать любой
								контент, включая формы, изображения или текст.
							</p>
							<p>
								Нажмите ESC, кликните за пределами окна или нажмите на крестик,
								чтобы закрыть.
							</p>
						</div>
					</Modal>
				</div>
			</section>
		</div>
	)
}
