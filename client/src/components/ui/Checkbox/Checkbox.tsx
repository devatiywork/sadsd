import { forwardRef, InputHTMLAttributes } from 'react'

interface CheckboxProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	label: string
	error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	({ label, error, className = '', ...props }, ref) => {
		return (
			<div className='flex items-start'>
				<div className='flex items-center h-5'>
					<input
						ref={ref}
						type='checkbox'
						className={`
              h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500
              ${error ? 'border-red-300' : ''}
              ${className}
            `}
						{...props}
					/>
				</div>
				<div className='ml-3 text-sm'>
					<label className='font-medium text-gray-700'>{label}</label>
					{error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
				</div>
			</div>
		)
	},
)

Checkbox.displayName = 'Checkbox'
