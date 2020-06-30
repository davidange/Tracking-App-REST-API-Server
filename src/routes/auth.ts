import { Router } from "express";
import {registerUser,loginUser} from '../controllers/user'
import {registerValidationUser,loginValidationUser} from '../middlewares/validators/user';

const router = Router();

router.post("/register",registerValidationUser,registerUser);

router.post('/login', loginValidationUser,loginUser);


export default router;
