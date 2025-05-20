import { Loader } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { getRoutes } from '../config'

export const RouterMain: React.FC = () => {
	const { isAdmin, isLoading } = useAuth()
	const [routes, setRoutes] = useState(getRoutes())

	useEffect(() => {
		// Обновляем маршруты при изменении роли пользователя
		setRoutes(getRoutes(isAdmin))
	}, [isAdmin])

	const renderRoutes = (routesArray: ReturnType<typeof getRoutes>) => {
		return routesArray.map(route => {
			if (route.subRoutes && route.subRoutes.length > 0) {
				return (
					<Route key={route.path} path={route.path} element={route.element}>
						{route.subRoutes.map(subRoute => (
							<Route
								key={`${route.path}${subRoute.path}`}
								path={subRoute.path}
								element={subRoute.element}
							/>
						))}
					</Route>
				)
			}

			return (
				<Route key={route.path} path={route.path} element={route.element} />
			)
		})
	}

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<Loader size='lg' />
			</div>
		)
	}

	return (
		<Routes>
			{renderRoutes(routes)}

			{/* Редирект на страницу входа, если маршрут не найден */}
			<Route path='*' element={<Navigate to='/login' replace />} />
		</Routes>
	)
}
