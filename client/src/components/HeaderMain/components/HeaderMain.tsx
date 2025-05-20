import { Pages } from '@/router/config'
import { RouteType } from '@/router/types/router.types'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HeaderMenu } from './HeaderMenu'

export const HeaderMain: React.FC = () => {
	// Фильтруем только корневые маршруты с indexHeader=true
	const [listPage] = useState<RouteType[]>(
		Pages.filter(p => p.indexHeader).map(page => ({
			...page,
			// Фильтруем подмаршруты, исключая те, у которых showInHeader=false
			subRoutes: page.subRoutes?.filter(
				subRoute => subRoute.showInHeader !== false,
			),
		})),
	)

	return (
		<header className='bg-white shadow-md sticky top-0 z-50 '>
			<div className=' mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16 '>
					{/* Логотип */}
					<div className='flex items-center'>
						<Link to='/' className='flex-shrink-0 flex items-center'>
							<span className='text-xl font-bold text-indigo-600'>
								BookWorm
							</span>
						</Link>
					</div>
					<HeaderMenu listPage={listPage} />
				</div>
			</div>
		</header>
	)
}
