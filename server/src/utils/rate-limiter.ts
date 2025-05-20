interface LoginAttempt {
	count: number
	lastAttempt: number
	blocked: boolean
	blockUntil: number
}

class LoginRateLimiter {
	private attempts: Map<string, LoginAttempt> = new Map()
	private maxAttempts: number = 5
	private windowMs: number = 15 * 60 * 1000 // 15 минут
	private blockDuration: number = 30 * 60 * 1000 // 30 минут

	constructor(maxAttempts?: number, windowMs?: number, blockDuration?: number) {
		if (maxAttempts) this.maxAttempts = maxAttempts
		if (windowMs) this.windowMs = windowMs
		if (blockDuration) this.blockDuration = blockDuration
	}

	public attempt(key: string): {
		blocked: boolean
		attemptsLeft: number
		blockUntil?: number
	} {
		const now = Date.now()
		const attempt = this.attempts.get(key) || {
			count: 0,
			lastAttempt: now,
			blocked: false,
			blockUntil: 0,
		}

		// Проверяем, заблокирован ли пользователь
		if (attempt.blocked) {
			// Если блокировка закончилась
			if (now > attempt.blockUntil) {
				this.reset(key)
				return { blocked: false, attemptsLeft: this.maxAttempts - 1 }
			}
			return { blocked: true, attemptsLeft: 0, blockUntil: attempt.blockUntil }
		}

		// Если время окна истекло, сбрасываем счетчик
		if (now - attempt.lastAttempt > this.windowMs) {
			attempt.count = 0
			attempt.lastAttempt = now
		}

		// Увеличиваем счетчик попыток
		attempt.count++
		attempt.lastAttempt = now

		// Проверяем, превышен ли лимит попыток
		if (attempt.count >= this.maxAttempts) {
			attempt.blocked = true
			attempt.blockUntil = now + this.blockDuration
			this.attempts.set(key, attempt)
			return { blocked: true, attemptsLeft: 0, blockUntil: attempt.blockUntil }
		}

		this.attempts.set(key, attempt)
		return { blocked: false, attemptsLeft: this.maxAttempts - attempt.count }
	}

	public reset(key: string): void {
		this.attempts.delete(key)
	}

	// Метод для очистки устаревших блокировок (можно вызывать периодически)
	public cleanup(): void {
		const now = Date.now()
		this.attempts.forEach((attempt, key) => {
			if (attempt.blocked && now > attempt.blockUntil) {
				this.attempts.delete(key)
			} else if (
				!attempt.blocked &&
				now - attempt.lastAttempt > this.windowMs
			) {
				this.attempts.delete(key)
			}
		})
	}
}

export const loginRateLimiter = new LoginRateLimiter()
