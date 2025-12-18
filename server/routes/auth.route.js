import { Router } from "express";
import { addRole, changeRole, checkAuth, login, logout, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post('/signup',signup);
router.get('/check-auth',protectRoute,checkAuth);
router.post('/logout',protectRoute,logout);
router.post('/login',login);
router.put('/change-role',protectRoute,changeRole);
router.put('/add-role',protectRoute,addRole);


export default router;