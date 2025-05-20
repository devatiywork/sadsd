import { ReactNode } from 'react'

interface CardGridProps {
	children: ReactNode
	columns?: 1 | 2 | 3 | 4
	gap?: 'sm' | 'md' | 'lg'
	className?: string
}

export const CardGrid = ({
	children,
	columns = 3,
	gap = 'md',
	className = '',
}: CardGridProps) => {
	// Классы для разного количества колонок
	const columnsClasses = {
		1: 'grid-cols-1',
		2: 'grid-cols-1 sm:grid-cols-2',
		3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
		4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
	}

	// Классы для разных размеров отступов
	const gapClasses = {
		sm: 'gap-3',
		md: 'gap-6',
		lg: 'gap-8',
	}

	return (
		<div
			className={`
        grid ${columnsClasses[columns]} ${gapClasses[gap]} ${className}
      `}
		>
			{children}
		</div>
	)
}
