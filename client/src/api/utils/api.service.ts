import { showToast } from '@/utils/toast'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'

export class ApiService {
	private static baseURL =
		import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

	private static getHeaders(): Record<string, string> {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
		}

		// Получаем токен из localStorage, если он есть
		const token = localStorage.getItem('token')
		if (token) {
			headers['Authorization'] = `Bearer ${token}`
		}

		return headers
	}

	private static handleError(error: unknown): never {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<any>
			const errorMessage =
				axiosError.response?.data.message ||
				'Произошла ошибка при выполнении запроса'

			// Показываем ошибку в toastify
			showToast.error(errorMessage)

			// Если статус 401 (Unauthorized), можно выполнить выход из системы
			if (axiosError.response?.status === 401) {
				localStorage.removeItem('token')
			}
		} else {
			// Для неизвестных ошибок показываем общее сообщение
			showToast.error('Произошла непредвиденная ошибка')
			console.error('Неизвестная ошибка:', error)
		}

		throw error
	}

	/**
	 * Выполняет GET-запрос к API
	 */
	public static async get<T>(
		url: string,
		config?: AxiosRequestConfig,
	): Promise<T> {
		try {
			const response = await axios.get(`${this.baseURL}${url}`, {
				...config,
				headers: {
					...this.getHeaders(),
					...config?.headers,
				},
			})

			return response.data.data
		} catch (error) {
			return this.handleError(error)
		}
	}

	/**
	 * Выполняет POST-запрос к API
	 */
	public static async post<T>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
	): Promise<T> {
		try {
			const response = await axios.post(`${this.baseURL}${url}`, data, {
				...config,
				headers: {
					...this.getHeaders(),
					...config?.headers,
				},
			})

			// Если сервер возвращает сообщение об успехе, показываем его
			if (response.data.message) {
				showToast.success(response.data.message)
			}

			return response.data.data
		} catch (error) {
			return this.handleError(error)
		}
	}

	/**
	 * Выполняет PUT-запрос к API
	 */
	public static async put<T>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
	): Promise<T> {
		try {
			const response = await axios.put(`${this.baseURL}${url}`, data, {
				...config,
				headers: {
					...this.getHeaders(),
					...config?.headers,
				},
			})

			// Если сервер возвращает сообщение об успехе, показываем его
			if (response.data.message) {
				showToast.success(response.data.message)
			}

			return response.data.data
		} catch (error) {
			return this.handleError(error)
		}
	}

	/**
	 * Выполняет DELETE-запрос к API
	 */
	public static async delete<T>(
		url: string,
		config?: AxiosRequestConfig,
	): Promise<T> {
		try {
			const response = await axios.delete(`${this.baseURL}${url}`, {
				...config,
				headers: {
					...this.getHeaders(),
					...config?.headers,
				},
			})

			// Если сервер возвращает сообщение об успехе, показываем его
			if (response.data.message) {
				showToast.success(response.data.message)
			}

			return response.data.data
		} catch (error) {
			return this.handleError(error)
		}
	}
}
