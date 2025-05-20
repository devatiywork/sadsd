import { Button, Card, Loader } from '@/components/ui'
import { useAdmin } from '@/hooks/useAdmin'
import { motion } from 'framer-motion'
import { Ban, Lock, Unlock, UserIcon } from 'lucide-react'
import { useState } from 'react'
import { BanUserModal } from '../components'

export const UsersPage: React.FC = () => {
	const { users, banUser, unbanUser, isBanning, isUnbanning } = useAdmin()
	const [userToBan, setUserToBan] = useState<number | null>(null)
	const [isBanModalOpen, setIsBanModalOpen] = useState(false)

	const handleBanClick = (userId: number) => {
		setUserToBan(userId)
		setIsBanModalOpen(true)
	}

	const handleBanConfirm = (reason: string) => {
		if (userToBan !== null) {
			banUser(userToBan, reason)
			setIsBanModalOpen(false)
		}
	}

	const handleUnban = (userId: number) => {
		unbanUser(userId)
	}

	return (
		<div className='space-y-6'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h1 className='text-2xl font-bold text-gray-900 mb-6'>
					Управление пользователями
				</h1>

				{users.isLoading ? (
					<div className='flex justify-center py-10'>
						<Loader size='lg' />
					</div>
				) : users.data.length > 0 ? (
					<div className='grid gap-4'>
						{users.data.map(user => (
							<Card key={user.id} className='overflow-hidden'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center space-x-3'>
										<div className='p-2 bg-indigo-100 rounded-full'>
											<UserIcon className='h-5 w-5 text-indigo-600' />
										</div>
										<div>
											<h3 className='text-lg font-medium text-gray-900'>
												{user.FIO}
											</h3>
											<p className='text-sm text-gray-500'>
												{user.email} • {user.login}
											</p>
										</div>
									</div>
									<div className='flex space-x-2'>
										{user.status === 0 ? (
											<Button
												variant='danger'
												size='sm'
												onClick={() => handleBanClick(user.id)}
												icon={<Ban size={16} />}
												disabled={isBanning}
											>
												Заблокировать
											</Button>
										) : (
											<Button
												variant='secondary'
												size='sm'
												onClick={() => handleUnban(user.id)}
												icon={<Unlock size={16} />}
												disabled={isUnbanning}
											>
												Разблокировать
											</Button>
										)}
									</div>
								</div>
								<div className='mt-2 flex items-center'>
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${
											user.status === 0
												? 'bg-green-100 text-green-800'
												: 'bg-red-100 text-red-800'
										}`}
									>
										{user.status === 0 ? 'Активен' : 'Заблокирован'}
									</span>
									{user.isAdmin && (
										<span className='ml-2 px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 flex items-center'>
											<Lock size={12} className='mr-1' />
											Администратор
										</span>
									)}
								</div>
							</Card>
						))}
					</div>
				) : (
					<div className='text-center py-10'>
						<p className='text-gray-500'>Пользователи не найдены</p>
					</div>
				)}
			</motion.div>

			<BanUserModal
				isOpen={isBanModalOpen}
				onClose={() => setIsBanModalOpen(false)}
				onConfirm={handleBanConfirm}
				isLoading={isBanning}
			/>
		</div>
	)
}
