// modules/routes.js
import { Router } from 'express';
import authRouter from './authModules/auth.routes.js';
import userRouter from './userModule/user.routes.js';
import newsRouter from './newsModule/news.routes.js';
import eventRouter from './eventModules/event.routes.js';
import governorateRouter from './governorateModule/governorate.routes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/news', newsRouter);
router.use('/events', eventRouter);
router.use('/governorates', governorateRouter);

router.all('*', (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

export default router;
