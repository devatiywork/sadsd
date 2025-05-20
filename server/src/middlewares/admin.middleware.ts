import { NextFunction, Request, Response } from 'express'

export const adminMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (!req.user || !req.user.isAdmin) {
		return res
			.status(403)
			.json({ success: false, message: 'Доступ только для администраторов' })
	}
	next()
}
