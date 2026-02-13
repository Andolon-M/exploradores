import { Router } from "express";
import authRoutes from "@/modules/auth/routers/auth.routes";
import explorersRoutes from "@/modules/explorers/routers/explorers.routes";
import commandersRoutes from "@/modules/commanders/routers/commanders.routes";
import usersRoutes from "@/modules/users/routers/users.routes";
import groupsRoutes from "@/modules/groups/routers/groups.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/explorers", explorersRoutes);
router.use("/commanders", commandersRoutes);
router.use("/users", usersRoutes);
router.use("/groups", groupsRoutes);

export default router;
