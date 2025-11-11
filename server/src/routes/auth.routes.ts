import { Router } from "express";
import {
  register,
  login,
  logout,
  verifyAuth,
} from "../controllers/auth.controllers";

import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/verify", verifyAuth);

router.post("/logout", logout);

export default router;
