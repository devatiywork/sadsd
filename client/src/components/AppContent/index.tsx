import { RouterMain } from '@/router'
import { ToastContainer } from 'react-toastify'
import { HeaderMain } from '../HeaderMain'
import { useShowHeader } from '../HeaderMain/hooks/useShowHeader'

export const AppContent = () => {
	const showHeader = useShowHeader()

	return (
		<>
			{showHeader && <HeaderMain />}
			<main className='w-full px-4 sm:px-6 lg:px-8'>
				<RouterMain />
			</main>
			<ToastContainer position='top-right' autoClose={5000} />
		</>
	)
}
