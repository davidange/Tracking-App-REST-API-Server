import { Router } from "express";
import {registerUser} from '../controllers/user'
import {validateUser} from '../middlewares/validators/user';

const router = Router();

router.post("/register",validateUser,registerUser);

// router.post('/login',(req,res)=>{

// });

export default router;
