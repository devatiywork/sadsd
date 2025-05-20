import { Button } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { getRoutes } from '@/router/config'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const HeaderMain = () => {
	const { isAuthenticated, isAdmin, logout } = useAuth()
	const location = useLocation()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [routes, setRoutes] = useState(getRoutes())

	useEffect(() => {
		setRoutes(getRoutes(isAdmin))
	}, [isAdmin])

	// Фильтруем только те маршруты, которые должны отображаться в хедере
	const headerRoutes = routes.filter(route => route.indexHeader)

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	// Получаем все подмаршруты
	const allLinks = headerRoutes.flatMap(route =>
		route.subRoutes
			? route.subRoutes
					.filter(subRoute => subRoute.showInHeader !== false) // Фильтрация элементов, которые не должны отображаться
					.map(subRoute => ({
						...subRoute,
						path: `${route.path}${route.path.endsWith('/') ? '' : '/'}${
							subRoute.path
						}`,
					}))
			: [route],
	)

	return (
		<header className='bg-white shadow-sm'>
			<div className='container mx-auto px-4'>
				<div className='flex justify-between h-16 items-center'>
					{/* Logo and title */}
					<div className='flex items-center'>
						<Link
							to={isAuthenticated ? '/listcards' : '/login'}
							className='flex items-center'
						>
							<BookOpen className='h-8 w-8 text-indigo-600' />
							<span className='ml-2 text-xl font-bold text-gray-900'>
								BookWorm
							</span>
						</Link>
					</div>

					{/* Desktop navigation */}
					<div className='hidden md:flex md:items-center md:space-x-4'>
						{isAuthenticated && (
							<>
								{allLinks.map(link => (
									<Link
										key={link.path}
										to={link.path}
										className={`px-3 py-2 rounded-md text-sm font-medium ${
											location.pathname === link.path
												? 'text-indigo-700 bg-indigo-100'
												: 'text-gray-600 hover:text-indigo-700 hover:bg-gray-50'
										}`}
									>
										{link.title}
									</Link>
								))}
								<Button
									variant='outline'
									size='sm'
									onClick={logout}
									className='ml-2'
								>
									Выйти
								</Button>
							</>
						)}
						{!isAuthenticated && (
							<>
								<Link
									to='/login'
									className={`px-3 py-2 rounded-md text-sm font-medium ${
										location.pathname === '/login'
											? 'text-indigo-700 bg-indigo-100'
											: 'text-gray-600 hover:text-indigo-700 hover:bg-gray-50'
									}`}
								>
									Войти
								</Link>
								<Link
									to='/register'
									className={`px-3 py-2 rounded-md text-sm font-medium ${
										location.pathname === '/register'
											? 'text-indigo-700 bg-indigo-100'
											: 'text-gray-600 hover:text-indigo-700 hover:bg-gray-50'
									}`}
								>
									Регистрация
								</Link>
							</>
						)}
					</div>

					{/* Mobile menu button */}
					<div className='md:hidden flex items-center'>
						<button
							className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100'
							onClick={toggleMenu}
							aria-expanded={isMenuOpen}
						>
							<span className='sr-only'>
								{isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
							</span>
							{isMenuOpen ? (
								<X className='block h-6 w-6' />
							) : (
								<Menu className='block h-6 w-6' />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu, show/hide based on menu state */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						className='md:hidden'
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
					>
						<div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200'>
							{isAuthenticated ? (
								<>
									{allLinks.map(link => (
										<Link
											key={link.path}
											to={link.path}
											className={`block px-3 py-2 rounded-md text-base font-medium ${
												location.pathname === link.path
													? 'text-indigo-700 bg-indigo-100'
													: 'text-gray-600 hover:text-indigo-700 hover:bg-gray-50'
											}`}
											onClick={toggleMenu}
										>
											{link.title}
										</Link>
									))}
									<button
										onClick={() => {
											logout()
											toggleMenu()
										}}
										className='block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-700 hover:bg-gray-50'
									>
										Выйти
									</button>
								</>
							) : (
								<>
									<Link
										to='/login'
										className={`block px-3 py-2 rounded-md text-base font-medium ${
											location.pathname === '/login'
												? 'text-indigo-700 bg-indigo-100'
												: 'text-gray-600 hover:text-indigo-700 hover:bg-gray-50'
										}`}
										onClick={toggleMenu}
									>
										Войти
									</Link>
									<Link
										to='/register'
										className={`block px-3 py-2 rounded-md text-base font-medium ${
											location.pathname === '/register'
												? 'text-indigo-700 bg-indigo-100'
												: 'text-gray-600 hover:text-indigo-700 hover:bg-gray-50'
										}`}
										onClick={toggleMenu}
									>
										Регистрация
									</Link>
								</>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	)
}
