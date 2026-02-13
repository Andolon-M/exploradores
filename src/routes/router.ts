import { Router } from "express";
import authRoutes from "@/modules/auth/routers/auth.routes";
import explorersRoutes from "@/modules/explorers/routers/explorers.routes";
import commandersRoutes from "@/modules/commanders/routers/commanders.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/explorers", explorersRoutes);
router.use("/commanders", commandersRoutes);

export default router;
