import { HTMLMotionProps, motion } from 'framer-motion'
import { ReactNode } from 'react'
export type ButtonVariant =
	| 'primary'
	| 'secondary'
	| 'danger'
	| 'outline'
	| 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = HTMLMotionProps<'button'> & {
	children: ReactNode
	variant?: ButtonVariant
	size?: ButtonSize
	isLoading?: boolean
	fullWidth?: boolean
	icon?: ReactNode
}

export const Button = ({
	children,
	variant = 'primary',
	size = 'md',
	isLoading = false,
	fullWidth = false,
	icon,
	className = '',
	disabled,
	...props
}: ButtonProps) => {
	// Базовые классы
	const baseClasses =
		'rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center'

	// Классы для разных вариантов
	const variantClasses = {
		primary:
			'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
		secondary:
			'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
		danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
		outline:
			'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
		ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
	}

	// Классы для разных размеров
	const sizeClasses = {
		sm: 'px-2.5 py-1.5 text-xs',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base',
	}

	// Классы для состояния загрузки или отключения
	const stateClasses =
		disabled || isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'

	// Классы для полной ширины
	const widthClasses = fullWidth ? 'w-full' : ''

	// Анимации с Framer Motion
	const buttonVariants = {
		hover: { scale: 1.02 },
		tap: { scale: 0.98 },
	}

	return (
		<motion.button
			whileHover={!disabled && !isLoading ? 'hover' : undefined}
			whileTap={!disabled && !isLoading ? 'tap' : undefined}
			variants={buttonVariants}
			transition={{ duration: 0.1 }}
			className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${stateClasses} ${widthClasses} ${className}`}
			disabled={disabled || isLoading}
			{...props}
		>
			{isLoading && (
				<svg
					className='animate-spin -ml-1 mr-2 h-4 w-4 text-current'
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
				>
					<circle
						className='opacity-25'
						cx='12'
						cy='12'
						r='10'
						stroke='currentColor'
						strokeWidth='4'
					></circle>
					<path
						className='opacity-75'
						fill='currentColor'
						d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
					></path>
				</svg>
			)}

			{icon && !isLoading && <span className='mr-2'>{icon}</span>}
			{children}
		</motion.button>
	)
}
