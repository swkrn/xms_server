import { Router } from "express";

import authMiddlewere from "../middleweres/auth.middlewere";
import messageController from '../controllers/message.controller'
import authController from "../controllers/auth.controller";

const router: Router = Router()

router.get('/all-messages' , authMiddlewere.validateUser, messageController.getAllMessages)
router.get('/message/:page', authMiddlewere.validateUser, messageController.getMessages)
router.get('/messages-list', authMiddlewere.validateUser, messageController.getMessagesList)

export default router