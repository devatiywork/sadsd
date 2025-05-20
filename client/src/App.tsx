import { HeaderMain } from '@/components/layout/HeaderMain'
import { AuthProvider } from '@/context/AuthContext'
import { RouterMain } from '@/router/components/RouterMain'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const queryClient = new QueryClient()

export const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AuthProvider>
					<div className='min-h-screen bg-gray-50'>
						<HeaderMain />
						<main className='container mx-auto px-4 py-8'>
							<RouterMain />
						</main>
						<ToastContainer position='top-right' autoClose={5000} />
					</div>
				</AuthProvider>
			</BrowserRouter>
		</QueryClientProvider>
	)
}
