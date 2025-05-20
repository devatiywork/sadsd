import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { ReactNode, useEffect, useRef } from 'react'
import { Button } from '../Button/Button'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	title?: string
	children: ReactNode
	footer?: ReactNode
	size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	footer,
	size = 'md',
}: ModalProps) => {
	const modalRef = useRef<HTMLDivElement>(null)

	// Закрываем при клике вне модалки
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
			// Запрещаем скроллинг на body
			document.body.style.overflow = 'hidden'
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.body.style.overflow = 'auto'
		}
	}, [isOpen, onClose])

	// Закрываем по Escape
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown)
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, onClose])

	// Варианты размеров
	const sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl',
	}

	// Анимация
	const backdropVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	}

	const modalVariants = {
		hidden: { opacity: 0, y: -50, scale: 0.95 },
		visible: { opacity: 1, y: 0, scale: 1 },
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'
					initial='hidden'
					animate='visible'
					exit='hidden'
					variants={backdropVariants}
					transition={{ duration: 0.2 }}
				>
					<motion.div
						ref={modalRef}
						className={`bg-white rounded-lg shadow-xl overflow-hidden w-full ${sizeClasses[size]}`}
						variants={modalVariants}
						transition={{
							duration: 0.3,
							type: 'spring',
							stiffness: 300,
							damping: 30,
						}}
					>
						{title && (
							<div className='px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center'>
								<h3 className='text-lg font-medium text-gray-900'>{title}</h3>
								<Button
									variant='ghost'
									onClick={onClose}
									className='p-1 rounded-full'
									aria-label='Close'
								>
									<X className='h-5 w-5 text-gray-500' />
								</Button>
							</div>
						)}

						<div className='px-6 py-4'>{children}</div>

						{footer && (
							<div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
								{footer}
							</div>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
