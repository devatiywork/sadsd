export interface LoginCredentials {
	login: string
	password: string
}

export interface RegisterData {
	FIO: string
	phone: string
	email: string
	login: string
	password: string
}

export interface User {
	id: number
	login: string
	FIO: string
	email: string
	isAdmin: boolean
}

export interface AuthResponse {
	user: User
	token: string
}

export interface CheckAuthResponse {
	user: User
}
