import { Button, Card } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import React from 'react'
import { Link } from 'react-router-dom'

// Временная страница списка карточек
export const ListCardsPage: React.FC = () => {
	const { user, logout } = useAuth()

	return (
		<div className='space-y-6'>
			<Card title='Список карточек'>
				<p>Это временная страница списка карточек.</p>
				<p className='mt-2'>
					Привет,{' '}
					<span className='font-medium'>{user?.FIO || 'пользователь'}</span>!
				</p>
				<div className='mt-4'>
					<Button variant='outline' onClick={logout}>
						Выйти
					</Button>
				</div>
			</Card>
		</div>
	)
}

// Временная страница профиля администратора
export const AdminProfilePage: React.FC = () => {
	const { user, logout } = useAuth()

	return (
		<div className='space-y-6'>
			<Card title='Профиль администратора'>
				<p>Это временная страница профиля администратора.</p>
				<p className='mt-2'>
					Привет,{' '}
					<span className='font-medium'>{user?.FIO || 'администратор'}</span>!
				</p>
				<div className='mt-4 flex space-x-2'>
					<Link to='/admin/users'>
						<Button>Управление пользователями</Button>
					</Link>
					<Link to='/admin/cards'>
						<Button variant='secondary'>Управление карточками</Button>
					</Link>
					<Button variant='outline' onClick={logout}>
						Выйти
					</Button>
				</div>
			</Card>
		</div>
	)
}

// Временная страница управления пользователями
export const AdminUsersPage: React.FC = () => {
	return (
		<Card title='Управление пользователями'>
			<p>Это временная страница управления пользователями.</p>
			<div className='mt-4'>
				<Link to='/profile'>
					<Button variant='outline'>Вернуться</Button>
				</Link>
			</div>
		</Card>
	)
}

// Временная страница управления карточками
export const AdminCardsPage: React.FC = () => {
	return (
		<Card title='Управление карточками'>
			<p>Это временная страница управления карточками.</p>
			<div className='mt-4'>
				<Link to='/profile'>
					<Button variant='outline'>Вернуться</Button>
				</Link>
			</div>
		</Card>
	)
}
