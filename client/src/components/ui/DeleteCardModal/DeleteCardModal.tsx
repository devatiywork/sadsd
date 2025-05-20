import { Button, Modal } from '@/components/ui'
import { AlertTriangle } from 'lucide-react'

interface DeleteCardModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
}

export const DeleteCardModal: React.FC<DeleteCardModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Подтверждение удаления'
			footer={
				<div className='flex justify-end space-x-2'>
					<Button variant='outline' onClick={onClose}>
						Отмена
					</Button>
					<Button variant='danger' onClick={onConfirm}>
						Удалить
					</Button>
				</div>
			}
		>
			<div className='flex items-start'>
				<div className='flex-shrink-0 mt-0.5'>
					<AlertTriangle className='h-6 w-6 text-red-500' />
				</div>
				<div className='ml-3'>
					<p className='text-sm text-gray-700'>
						Вы уверены, что хотите удалить эту карточку? Это действие нельзя
						будет отменить.
					</p>
				</div>
			</div>
		</Modal>
	)
}
