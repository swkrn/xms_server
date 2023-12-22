import { Router } from "express";

import authMiddlewere from "../middleweres/auth.middlewere";
import messageController from '../controllers/message.controller'

const router: Router = Router()

router.get('/all-messages' , authMiddlewere.validateUser, messageController.getAllMessages)
router.get('/message/:page', authMiddlewere.validateUser, messageController.getMessages)

export default router