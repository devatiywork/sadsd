export interface ApiResponse<T = any> {
	data: T
	message?: string
	success: boolean
}

export interface ApiError {
	message: string
	errors?: Record<string, string[]>
	statusCode?: number
}
