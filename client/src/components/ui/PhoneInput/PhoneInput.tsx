import { forwardRef, InputHTMLAttributes } from 'react'
import { IMaskInput } from 'react-imask'

interface PhoneInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
	helpText?: string
	icon?: React.ReactNode
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
	({ label, error, helpText, icon, className = '', ...props }, ref) => {
		// Определяем классы для состояний (ошибка, стандарт)
		const inputClasses = `
      block w-full px-4 py-2 rounded-md shadow-sm pl-10
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
					{icon && (
						<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
							{icon}
						</div>
					)}

					<IMaskInput
						inputRef={ref}
						mask='+7(000)-000-00-00'
						className={inputClasses}
						// Only pass compatible props to IMaskInput
						{...Object.keys(props)
							.filter(key => !['max', 'min', 'type'].includes(key))
							.reduce(
								(obj, key) => ({
									...obj,
									[key]: props[key as keyof typeof props],
								}),
								{},
							)}
					/>
				</div>

				{error && <p className='mt-1 text-sm text-red-600'>{error}</p>}

				{helpText && !error && (
					<p className='mt-1 text-sm text-gray-500'>{helpText}</p>
				)}
			</div>
		)
	},
)

PhoneInput.displayName = 'PhoneInput'
