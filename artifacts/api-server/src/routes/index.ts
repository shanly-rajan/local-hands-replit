import { Router, type IRouter } from "express";
import healthRouter from "./health";
import metaRouter from "./meta";
import providersRouter from "./providers";
import jobsRouter from "./jobs";
import adsRouter from "./ads";

const router: IRouter = Router();

router.use(healthRouter);
router.use(metaRouter);
router.use(providersRouter);
router.use(jobsRouter);
router.use(adsRouter);

export default router;
