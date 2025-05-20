import { ModerationPage } from '@pages/admin/ModerationPage/ModerationPage'
import { UsersPage } from '@pages/admin/UsersPage/UsersPage'
import { LoginPage, RegisterPage } from '@pages/auth'
import { CreateCardPage, ListCardsPage } from '@pages/cards'
import { EditCardPage } from '@pages/cards/EditCardPage'
import { ProfilePage } from '@pages/profile'
import { Navigate } from 'react-router-dom'
import { AuthGuard } from './guards/AuthGuard'
import { RouteType } from './types/router.types'

// Функция для создания маршрутов с учетом роли пользователя
export const getRoutes = (isAdmin: boolean = false): RouteType[] => {
	return [
		// Редирект с главной на логин для неавторизованных пользователей
		{
			path: '/',
			title: 'Главная',
			element: <Navigate to='/login' replace />,
			indexHeader: false,
		},

		// Публичные маршруты (доступны только для неавторизованных)
		{
			path: '/',
			title: 'Аутентификация',
			element: <AuthGuard requireAuth={false} />,
			indexHeader: false,
			subRoutes: [
				{
					path: 'login',
					title: 'Вход',
					element: <LoginPage />,
				},
				{
					path: 'register',
					title: 'Регистрация',
					element: <RegisterPage />,
				},
			],
		},

		// Маршруты для обычных пользователей (включая скрытый маршрут редактирования)
		{
			path: '/',
			title: 'Основные',
			element: <AuthGuard requireAuth={true} />,
			indexHeader: true,
			subRoutes: [
				{
					path: 'listcards',
					title: 'Список книг',
					element: <ListCardsPage />,
					showInHeader: true,
				},
				{
					path: 'cards/create',
					title: 'Создать карточку',
					element: <CreateCardPage />,
					showInHeader: true,
				},
				{
					path: 'cards/edit/:id',
					title: 'Редактировать карточку',
					element: <EditCardPage />,
					showInHeader: false,
				},
				{
					path: 'profile',
					title: 'Профиль',
					element: <ProfilePage />,
					showInHeader: true,
				},
			],
		},

		// Маршруты только для админов
		{
			path: '/admin',
			title: 'Администрирование',
			element: <AuthGuard requireAuth={true} requireAdmin={true} />,
			indexHeader: isAdmin, // Только для админов показываем в хедере
			subRoutes: [
				{
					path: 'users',
					title: 'Пользователи',
					element: <UsersPage />,
					showInHeader: true,
				},
				{
					path: 'moderation',
					title: 'Модерация',
					element: <ModerationPage />,
					showInHeader: true,
				},
			],
		},

		// UI Showcase доступно всем (для разработки)
		// {
		// 	path: '/ui-showcase',
		// 	title: 'UI компоненты',
		// 	element: <UIShowcase />,
		// 	indexHeader: false,
		// },
	]
}

// Базовый экспорт для начальной загрузки
export const Pages = getRoutes()
