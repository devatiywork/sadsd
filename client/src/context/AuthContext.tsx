import { AuthService } from '@/api'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
	AuthContextType,
	LoginCredentials,
	RegisterData,
	User,
} from './types/auth.types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
	children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null)
	const [token, setToken] = useState<string | null>(
		localStorage.getItem('token'),
	)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const navigate = useNavigate()

	const isAuthenticated = !!user
	const isAdmin = user?.isAdmin || false

	// Проверка авторизации при инициализации
	useEffect(() => {
		if (token) {
			checkAuth()
		} else {
			setIsLoading(false)
		}
	}, [])

	// Проверка валидности токена
	const checkAuth = async () => {
		if (!token) {
			setIsLoading(false)
			return
		}

		setIsLoading(true)
		try {
			const response = await AuthService.checkAuth()
			setUser(response.user)
		} catch (error: any) {
			console.error('Ошибка проверки токена:', error)
			// Если токен невалидный, очищаем данные
			localStorage.removeItem('token')
			setToken(null)
			setUser(null)
			toast.error('Сессия истекла. Пожалуйста, войдите снова.')
		} finally {
			setIsLoading(false)
		}
	}

	// Авторизация пользователя
	const login = async (credentials: LoginCredentials) => {
		setIsLoading(true)
		try {
			const response = await AuthService.login(credentials)

			localStorage.setItem('token', response.token)
			setToken(response.token)
			setUser(response.user)

			// Редирект на соответствующую страницу
			if (response.user.isAdmin) {
				navigate('/profile')
			} else {
				navigate('/listcards')
			}
		} catch (error: any) {
			// Ошибки обрабатываются в сервисе API
		} finally {
			setIsLoading(false)
		}
	}

	// Регистрация пользователя
	const register = async (userData: RegisterData) => {
		setIsLoading(true)
		try {
			const response = await AuthService.register(userData)

			localStorage.setItem('token', response.token)
			setToken(response.token)
			setUser(response.user)

			navigate('/listcards')
		} catch (error: any) {
			// Ошибки обрабатываются в сервисе API
		} finally {
			setIsLoading(false)
		}
	}

	// Выход пользователя
	const logout = () => {
		localStorage.removeItem('token')
		setToken(null)
		setUser(null)
		navigate('/login')
		toast.info('Вы вышли из системы')
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				isLoading,
				isAuthenticated,
				isAdmin,
				login,
				register,
				logout,
				checkAuth,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
