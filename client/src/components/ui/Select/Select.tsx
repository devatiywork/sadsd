import { forwardRef, SelectHTMLAttributes } from 'react'

interface Option {
	value: string | number
	label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label?: string
	options: Option[]
	error?: string
	helpText?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ label, options, error, helpText, className = '', ...props }, ref) => {
		// Классы для селекта
		const selectClasses = `
      block w-full px-4 py-2 rounded-md shadow-sm text-base 
      ${
				error
					? 'border-red-300 focus:border-red-500 focus:ring-red-500'
					: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
			}
      ${className}
    `

		return (
			<div className='w-full'>
				{label && (
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						{label}
					</label>
				)}

				<div className='relative'>
					<select ref={ref} className={selectClasses} {...props}>
						{options.map(option => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				{error && <p className='mt-1 text-sm text-red-600'>{error}</p>}

				{helpText && !error && (
					<p className='mt-1 text-sm text-gray-500'>{helpText}</p>
				)}
			</div>
		)
	},
)

Select.displayName = 'Select'
