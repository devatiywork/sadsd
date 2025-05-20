import { ReactElement } from 'react'

export interface RouteType {
	path: string
	title: string
	element: ReactElement
	indexHeader?: boolean
	showInHeader?: boolean // Показывать ли маршрут в хедере
	subRoutes?: RouteType[]
}
