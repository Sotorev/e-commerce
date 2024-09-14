import { Router } from "express";
import {
	register,
	login,
	logout,
	getProfile,
	updateProfile,
	requestPasswordReset,
	resetPasswordHandler
} from "@/controllers/user.controller";
import { authenticateToken } from "@/utils/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPasswordHandler);

export default router;
