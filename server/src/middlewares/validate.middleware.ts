import { NextFunction, Request, Response } from 'express'
import { Schema } from 'joi'

export const validateRequest = (schema: Schema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = schema.validate(req.body)

		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Ошибка валидации',
				error: error.details.map(detail => detail.message),
			})
		}

		next()
	}
}
