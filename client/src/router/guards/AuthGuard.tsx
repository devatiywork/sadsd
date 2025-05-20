import { Loader } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

interface AuthGuardProps {
	requireAuth?: boolean
	requireAdmin?: boolean
}

export const AuthGuard = ({
	requireAuth = true,
	requireAdmin = false,
}: AuthGuardProps) => {
	const { isAuthenticated, isAdmin, isLoading } = useAuth()

	// Если идет проверка авторизации, показываем лоадер
	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<Loader size='lg' />
			</div>
		)
	}

	// Для защищенных маршрутов
	if (requireAuth) {
		// Если требуется авторизация, но пользователь не авторизован
		if (!isAuthenticated) {
			return <Navigate to='/login' replace />
		}

		// Если требуются права админа, но пользователь не админ
		if (requireAdmin && !isAdmin) {
			return <Navigate to='/listcards' replace />
		}
	} else {
		// Для маршрутов только для неавторизованных (например, логин, регистрация)
		// Если пользователь уже авторизован, перенаправляем его на главную
		if (isAuthenticated) {
			return <Navigate to='/listcards' replace />
		}
	}

	// Если все проверки пройдены, рендерим дочерние маршруты
	return <Outlet />
}
