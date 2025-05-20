export interface User {
	id: number
	login: string
	FIO: string
	email: string
	isAdmin: boolean
}

export interface AuthContextType {
	user: User | null
	token: string | null
	isLoading: boolean
	isAuthenticated: boolean
	isAdmin: boolean
	login: (credentials: LoginCredentials) => Promise<void>
	register: (userData: RegisterData) => Promise<void>
	logout: () => void
	checkAuth: () => Promise<void>
}

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
