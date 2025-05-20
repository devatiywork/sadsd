import { Button, Card, Input, Loader, PhoneInput } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Lock, Mail, Phone, User } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { RegisterFormValues, registerSchema } from '../schemas/auth.schema'

// Анимации
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
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
export const RegisterPage: React.FC = () => {
	const { register, isLoading } = useAuth()

	const {
		register: registerField,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			FIO: '',
			phone: '',
			email: '',
			login: '',
			password: '',
		},
	})

	const onSubmit = async (data: RegisterFormValues) => {
		await register(data)
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
						Регистрация
					</h2>
					<p className='mt-2 text-center text-sm text-gray-600'>
						Или{' '}
						<Link
							to='/login'
							className='font-medium text-indigo-600 hover:text-indigo-500'
						>
							войдите, если у вас уже есть аккаунт
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
							<form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
								<div>
									<Input
										label='ФИО'
										placeholder='Иванов Иван Иванович'
										icon={<User size={18} className='text-gray-400' />}
										{...registerField('FIO')}
										error={errors.FIO?.message}
									/>
								</div>

								<div>
									<PhoneInput
										label='Телефон'
										placeholder='+7(XXX)-XXX-XX-XX'
										icon={<Phone size={18} className='text-gray-400' />}
										{...registerField('phone')}
										error={errors.phone?.message}
									/>
								</div>

								<div>
									<Input
										label='Email'
										type='email'
										placeholder='example@example.com'
										icon={<Mail size={18} className='text-gray-400' />}
										{...registerField('email')}
										error={errors.email?.message}
									/>
								</div>

								<div>
									<Input
										label='Логин'
										placeholder='Введите логин'
										icon={<User size={18} className='text-gray-400' />}
										{...registerField('login')}
										error={errors.login?.message}
									/>
								</div>

								<div>
									<Input
										label='Пароль'
										type='password'
										placeholder='Минимум 6 символов'
										icon={<Lock size={18} className='text-gray-400' />}
										{...registerField('password')}
										error={errors.password?.message}
									/>
								</div>

								<div className='pt-2'>
									<Button type='submit' fullWidth>
										Зарегистрироваться
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
