import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { ApiError, ApiResponse } from '../types/types'

export class ApiService {
	private static baseURL = import.meta.env.VITE_API_URL

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
			const axiosError = error as AxiosError<ApiError>
			const errorMessage =
				axiosError.response?.data.message ||
				'Произошла ошибка при выполнении запроса'

			// Показываем ошибку в toastify
			toast.error(errorMessage)

			// Если статус 401 (Unauthorized), можно выполнить выход из системы
			if (axiosError.response?.status === 401) {
				// Можно добавить логику для разлогинивания
				localStorage.removeItem('token')
				// window.location.href = '/login';
			}
		} else {
			// Для неизвестных ошибок показываем общее сообщение
			toast.error('Произошла непредвиденная ошибка')
			console.error('Неизвестная ошибка:', error)
		}

		throw error
	}

	/**
	 * Выполняет GET-запрос к API
	 * @param url - путь запроса (без базового URL)
	 * @param config - дополнительные настройки axios
	 * @returns Промис с типизированным ответом
	 */
	public static async get<T>(
		url: string,
		config?: AxiosRequestConfig,
	): Promise<T> {
		try {
			const response: AxiosResponse<ApiResponse<T>> = await axios.get(
				`${this.baseURL}${url}`,
				{
					...config,
					headers: {
						...this.getHeaders(),
						...config?.headers,
					},
				},
			)

			return response.data.data
		} catch (error) {
			return this.handleError(error)
		}
	}

	/**
	 * Выполняет POST-запрос к API
	 * @param url - путь запроса (без базового URL)
	 * @param data - данные для отправки
	 * @param config - дополнительные настройки axios
	 * @returns Промис с типизированным ответом
	 */
	public static async post<T>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
	): Promise<T> {
		try {
			const response: AxiosResponse<ApiResponse<T>> = await axios.post(
				`${this.baseURL}${url}`,
				data,
				{
					...config,
					headers: {
						...this.getHeaders(),
						...config?.headers,
					},
				},
			)

			// Если сервер возвращает сообщение об успехе, показываем его
			if (response.data.message) {
				toast.success(response.data.message)
			}

			return response.data.data
		} catch (error) {
			return this.handleError(error)
		}
	}

	/**
	 * Выполняет PUT-запрос к API
	 * @param url - путь запроса (без базового URL)
	 * @param data - данные для отправки
	 * @param config - дополнительные настройки axios
	 * @returns Промис с типизированным ответом
	 */
	public static async put<T>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
	): Promise<T> {
		try {
			const response: AxiosResponse<ApiResponse<T>> = await axios.put(
				`${this.baseURL}${url}`,
				data,
				{
					...config,
					headers: {
						...this.getHeaders(),
						...config?.headers,
					},
				},
			)

			// Если сервер возвращает сообщение об успехе, показываем его
			if (response.data.message) {
				toast.success(response.data.message)
			}

			return response.data.data
		} catch (error) {
			return this.handleError(error)
		}
	}
}
