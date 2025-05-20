import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
	children: ReactNode
	title?: string
	footer?: ReactNode
	className?: string
	onClick?: () => void
	interactive?: boolean
}

export const Card = ({
	children,
	title,
	footer,
	className = '',
	onClick,
	interactive = false,
}: CardProps) => {
	// Анимации для интерактивных карточек
	const variants = {
		hover: {
			y: -5,
			boxShadow:
				'0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
		},
		tap: {
			y: 0,
			boxShadow:
				'0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
		},
	}

	return (
		<motion.div
			className={`
        bg-white rounded-lg shadow overflow-hidden
        ${interactive ? 'cursor-pointer' : ''}
        ${className}
      `}
			onClick={onClick}
			whileHover={interactive ? 'hover' : undefined}
			whileTap={interactive ? 'tap' : undefined}
			variants={variants}
			transition={{ duration: 0.2 }}
		>
			{title && (
				<div className='px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200'>
					<h3 className='text-lg font-medium leading-6 text-gray-900'>
						{title}
					</h3>
				</div>
			)}
			<div className='p-6'>{children}</div>
			{footer && (
				<div className='px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200'>
					{footer}
				</div>
			)}
		</motion.div>
	)
}
