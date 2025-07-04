import { RouteType } from '@/router/types/router.types'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface HeaderMenuProps {
	listPage: RouteType[]
}
// Анимация для мобильного меню
const menuVariants = {
	hidden: {
		opacity: 0,
		y: -20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.2,
		},
	},
	exit: {
		opacity: 0,
		y: -20,
		transition: {
			duration: 0.2,
		},
	},
}

// Анимация для элементов меню
const itemVariants = {
	hidden: { opacity: 0, x: -10 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: {
			delay: i * 0.05,
			duration: 0.2,
		},
	}),
}
export const HeaderMenu: React.FC<HeaderMenuProps> = ({ listPage }) => {
	const location = useLocation()
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		setIsOpen(false)
	}, [location.pathname])

	// Улучшенный алгоритм фильтрации маршрутов
	const getMenuItems = () => {
		// Отладка: выводим начальный список маршрутов
		console.log(
			'HeaderMenu - Получен список listPage:',
			JSON.stringify(listPage, null, 2),
		)

		// Создаем плоский список всех маршрутов
		const flatRoutes: any[] = []

		// Обрабатываем только маршруты первого уровня - те, у которых indexHeader === true
		listPage.forEach(route => {
			console.log(
				`HeaderMenu - Обработка маршрута "${route.title}", indexHeader =`,
				route.indexHeader,
			)

			if (route.indexHeader === true) {
				// Добавляем основной маршрут
				flatRoutes.push({
					...route,
					isMainRoute: true,
				})
				console.log(`HeaderMenu - Добавлен основной маршрут "${route.title}"`)

				// Если есть подмаршруты, проверяем каждый
				if (route.subRoutes && route.subRoutes.length > 0) {
					console.log(
						`HeaderMenu - Подмаршруты для "${route.title}":`,
						route.subRoutes,
					)

					route.subRoutes.forEach(subRoute => {
						// Выводим все свойства подмаршрута для отладки
						console.log(
							`HeaderMenu - Детали подмаршрута "${subRoute.title}":`,
							{
								path: subRoute.path,
								title: subRoute.title,
								showInHeader: subRoute.showInHeader,
								typeof_showInHeader: typeof subRoute.showInHeader,
								showInHeader_explicitly_true: subRoute.showInHeader === true,
								indexHeader: subRoute.indexHeader,
							},
						)

						// Проверяем явно, что showInHeader = true
						if (subRoute.showInHeader === true) {
							const fullPath =
								route.path === '/'
									? `/${subRoute.path}`
									: `${route.path}/${subRoute.path}`

							flatRoutes.push({
								...subRoute,
								path: fullPath,
								isMainRoute: false,
							})
							console.log(
								`HeaderMenu - Добавлен подмаршрут "${subRoute.title}" с путем "${fullPath}"`,
							)
						} else {
							console.log(
								`HeaderMenu - Подмаршрут "${subRoute.title}" исключен из меню, showInHeader =`,
								subRoute.showInHeader,
							)
						}
					})
				} else {
					console.log(
						`HeaderMenu - У маршрута "${route.title}" нет подмаршрутов`,
					)
				}
			} else {
				console.log(
					`HeaderMenu - Маршрут "${route.title}" исключен, т.к. indexHeader не true`,
				)
			}
		})

		// Финальная фильтрация
		const filteredRoutes = flatRoutes.filter(route => {
			const shouldInclude = !route.isMainRoute || route.indexHeader !== false
			console.log(
				`HeaderMenu - Финальная фильтрация маршрута "${route.title}", isMainRoute = ${route.isMainRoute}, indexHeader = ${route.indexHeader}, включен = ${shouldInclude}`,
			)
			return shouldInclude
		})

		console.log('HeaderMenu - Итоговый список для меню:', filteredRoutes)
		return filteredRoutes
	}

	const menuItems = getMenuItems()

	return (
		<>
			{/* Десктопное меню */}{' '}
			<div className='hidden sm:ml-6 sm:flex sm:items-center'>
				<div className='flex space-x-4'>
					{menuItems.map(page => (
						<motion.div
							key={page.path}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Link
								to={page.path}
								className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
${
	location.pathname === page.path
		? 'bg-indigo-100 text-indigo-700'
		: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
}
`}
							>
								{page.title}
							</Link>
						</motion.div>
					))}
				</div>
			</div>
			{/* Кнопка мобильного меню */}
			<div className='flex items-center sm:hidden'>
				<motion.button
					onClick={() => setIsOpen(!isOpen)}
					className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
					aria-expanded={isOpen}
					whileTap={{ scale: 0.9 }}
					whileHover={{ backgroundColor: '#f3f4f6' }}
				>
					<span className='sr-only'>Открыть меню</span>
					<AnimatePresence mode='wait' initial={false}>
						{isOpen ? (
							<motion.div
								key='close'
								initial={{ rotate: -90, opacity: 0 }}
								animate={{ rotate: 0, opacity: 1 }}
								exit={{ rotate: 90, opacity: 0 }}
								transition={{ duration: 0.2 }}
							>
								<X className='h-6 w-6' />
							</motion.div>
						) : (
							<motion.div
								key='menu'
								initial={{ rotate: 90, opacity: 0 }}
								animate={{ rotate: 0, opacity: 1 }}
								exit={{ rotate: -90, opacity: 0 }}
								transition={{ duration: 0.2 }}
							>
								<Menu className='h-6 w-6' />
							</motion.div>
						)}
					</AnimatePresence>
				</motion.button>
			</div>
			{/* Мобильное меню с анимацией Framer Motion */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						className='sm:hidden fixed top-16 left-0 w-full bg-white shadow-md z-40'
						variants={menuVariants}
						initial='hidden'
						animate='visible'
						exit='exit'
					>
						<div className='pt-2 pb-3 space-y-1'>
							{menuItems.map((page, i) => (
								<motion.div
									key={page.path}
									variants={itemVariants}
									initial='hidden'
									animate='visible'
									custom={i}
								>
									<Link
										to={page.path}
										className={`block px-3 py-2 rounded-md text-base font-medium
${
	location.pathname === page.path
		? 'bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700'
		: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
}
`}
									>
										{page.title}
									</Link>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}
