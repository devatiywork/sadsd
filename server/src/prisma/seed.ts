import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function createAdmin() {
	try {
		// Проверяем существование админа
		const adminExists = await prisma.user.findFirst({
			where: { login: 'admin' },
		})

		// Если админа нет, создаем его
		if (!adminExists) {
			const passwordHash = await bcrypt.hash('bookworm', 10)

			await prisma.user.create({
				data: {
					login: 'admin',
					password: passwordHash,
					FIO: 'admin',
					phone: '+70000000000',
					email: 'admin@admin.com',
					status: 0,
					isAdmin: true,
				},
			})

			console.log('Администратор успешно создан')
		} else {
			console.log('Администратор уже существует')
		}
	} catch (error) {
		console.error('Ошибка при создании администратора:', error)
	}
}

// Если запускаем скрипт напрямую
if (require.main === module) {
	createAdmin()
		.then(() => prisma.$disconnect())
		.catch(async e => {
			console.error(e)
			await prisma.$disconnect()
			process.exit(1)
		})
}
