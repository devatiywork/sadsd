import { motion } from 'framer-motion'

interface LoaderProps {
	size?: 'sm' | 'md' | 'lg'
	color?: 'primary' | 'white' | 'gray'
	className?: string
}

export const Loader = ({
	size = 'md',
	color = 'primary',
	className = '',
}: LoaderProps) => {
	// Размеры лоадера
	const sizeClasses = {
		sm: 'h-4 w-4',
		md: 'h-8 w-8',
		lg: 'h-12 w-12',
	}

	// Цвета лоадера
	const colorClasses = {
		primary: 'text-indigo-600',
		white: 'text-white',
		gray: 'text-gray-500',
	}

	// Анимации для точек
	const containerVariants = {
		start: {
			transition: {
				staggerChildren: 0.2,
			},
		},
		end: {
			transition: {
				staggerChildren: 0.2,
			},
		},
	}

	const circleVariants = {
		start: {
			y: '0%',
		},
		end: {
			y: '100%',
		},
	}

	const circleTransition = {
		duration: 0.5,
		repeat: Infinity,
		repeatType: 'reverse' as const,
		ease: 'easeInOut',
	}

	return (
		<div className={`flex justify-center items-center ${className}`}>
			<motion.div
				className='flex space-x-2'
				variants={containerVariants}
				initial='start'
				animate='end'
			>
				{[0, 1, 2].map(index => (
					<motion.div
						key={index}
						className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
						variants={circleVariants}
						transition={circleTransition}
						style={{ backgroundColor: 'currentColor' }}
					/>
				))}
			</motion.div>
		</div>
	)
}
