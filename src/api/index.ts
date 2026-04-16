import type { Request, Response } from 'express';
import { app } from '../bootstrap.js';
import { DBConnection } from '../DB/config/connectDB.js';

let dbReadyPromise: Promise<void> | null = null;

const ensureDbConnection = async (): Promise<void> => {
	if (!dbReadyPromise) {
		dbReadyPromise = DBConnection();
	}

	await dbReadyPromise;
};

export default async (req: Request, res: Response): Promise<void> => {
	await ensureDbConnection();
	app(req, res);
};