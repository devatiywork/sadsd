import { ApiService } from '../utils/api.service'
import {
	AuthResponse,
	CheckAuthResponse,
	LoginCredentials,
	RegisterData,
} from './types'

export class AuthService {
	/**
	 * Авторизация пользователя
	 */
	static async login(credentials: LoginCredentials): Promise<AuthResponse> {
		return ApiService.post<AuthResponse>('/auth/login', credentials)
	}

	/**
	 * Регистрация нового пользователя
	 */
	static async register(data: RegisterData): Promise<AuthResponse> {
		return ApiService.post<AuthResponse>('/auth/register', data)
	}

	/**
	 * Проверка валидности токена
	 */
	static async checkAuth(): Promise<CheckAuthResponse> {
		return ApiService.get<CheckAuthResponse>('/auth/check')
	}
}

export * from './types'
