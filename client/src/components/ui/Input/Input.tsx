import { Eye, EyeOff } from 'lucide-react'
import { InputHTMLAttributes, forwardRef, useState } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
	helpText?: string
	icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{ label, error, helpText, icon, className = '', type = 'text', ...props },
		ref,
	) => {
		const [showPassword, setShowPassword] = useState(false)
		const isPassword = type === 'password'

		// Определяем, какой тип ввода показывать (для полей пароля)
		const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

		// Определяем классы для состояний (ошибка, стандарт)
		const inputClasses = `
      block w-full px-4 py-2 rounded-md shadow-sm 
      ${
				error
					? 'border-red-300 focus:border-red-500 focus:ring-red-500'
					: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
			}
      ${icon ? 'pl-10' : ''}
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

					<input
						ref={ref}
						type={inputType}
						className={inputClasses}
						{...props}
					/>

					{isPassword && (
						<button
							type='button'
							className='absolute inset-y-0 right-0 pr-3 flex items-center'
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? (
								<EyeOff className='h-5 w-5 text-gray-400' />
							) : (
								<Eye className='h-5 w-5 text-gray-400' />
							)}
						</button>
					)}
				</div>

				{error && <p className='mt-1 text-sm text-red-600'>{error}</p>}

				{helpText && !error && (
					<p className='mt-1 text-sm text-gray-500'>{helpText}</p>
				)}
			</div>
		)
	},
)

Input.displayName = 'Input'
