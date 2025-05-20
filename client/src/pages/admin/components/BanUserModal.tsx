import { Button, Modal } from '@/components/ui'
import { useState } from 'react'

interface BanUserModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: (reason: string) => void
	isLoading: boolean
}

export const BanUserModal: React.FC<BanUserModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	isLoading,
}) => {
	const [reason, setReason] = useState('')

	const handleConfirm = () => {
		if (reason.trim()) {
			onConfirm(reason)
			setReason('')
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Блокировка пользователя'
			footer={
				<div className='flex justify-end space-x-2'>
					<Button variant='outline' onClick={onClose} disabled={isLoading}>
						Отмена
					</Button>
					<Button
						variant='danger'
						onClick={handleConfirm}
						disabled={!reason.trim() || isLoading}
						isLoading={isLoading}
					>
						Заблокировать
					</Button>
				</div>
			}
		>
			<div className='space-y-4'>
				<p className='text-gray-600'>
					Укажите причину блокировки пользователя. Эта информация будет
					отображаться в системе.
				</p>
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Причина блокировки
					</label>
					<textarea
						className='w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
						rows={3}
						value={reason}
						onChange={e => setReason(e.target.value)}
						placeholder='Укажите причину блокировки'
					/>
				</div>
			</div>
		</Modal>
	)
}
