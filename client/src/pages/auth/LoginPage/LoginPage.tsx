import { Button, Card, Input, Loader } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Lock, Mail } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { LoginFormValues, loginSchema } from '../schemas/auth.schema'
// Анимации
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
}

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: 'spring',
			stiffness: 300,
			damping: 24,
		},
	},
}
export const LoginPage: React.FC = () => {
	const { login, isLoading } = useAuth()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			login: '',
			password: '',
		},
	})

	const onSubmit = async (data: LoginFormValues) => {
		await login(data)
	}

	return (
		<div className='min-h-screen flex  justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<motion.div
				className='max-w-md w-full space-y-8'
				variants={containerVariants}
				initial='hidden'
				animate='visible'
			>
				<motion.div variants={itemVariants}>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Вход в аккаунт
					</h2>
					<p className='mt-2 text-center text-sm text-gray-600'>
						Или{' '}
						<Link
							to='/register'
							className='font-medium text-indigo-600 hover:text-indigo-500'
						>
							зарегистрироваться, если у вас еще нет аккаунта
						</Link>
					</p>
				</motion.div>

				<motion.div variants={itemVariants}>
					<Card>
						{isLoading ? (
							<div className='py-6 flex justify-center'>
								<Loader size='lg' />
							</div>
						) : (
							<form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
								<div>
									<Input
										label='Логин'
										placeholder='Введите логин'
										icon={<Mail size={18} className='text-gray-400' />}
										{...register('login')}
										error={errors.login?.message}
									/>
								</div>

								<div>
									<Input
										label='Пароль'
										type='password'
										placeholder='Введите пароль'
										icon={<Lock size={18} className='text-gray-400' />}
										{...register('password')}
										error={errors.password?.message}
									/>
								</div>

								<div>
									<Button type='submit' fullWidth>
										Войти
									</Button>
								</div>
							</form>
						)}
					</Card>
				</motion.div>
			</motion.div>
		</div>
	)
}
