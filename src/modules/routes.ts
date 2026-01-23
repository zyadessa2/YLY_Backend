import { Router } from "express";
import authRouter from "./authModules/auth.routes";
import userRouter from "./userModule/user.routes";
import newsRouter from "./newsModule/news.routes";
import eventRouter from "./eventModules/event.routes";
import governorateRouter from "./governorateModule/governorate.routes";


const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/news', newsRouter);
router.use('/events', eventRouter);
router.use('/governorates', governorateRouter);




export default router;