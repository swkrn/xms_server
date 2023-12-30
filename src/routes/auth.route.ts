import { Router } from 'express'

import authController from '../controllers/auth.controller'
import authMiddlewere from '../middleweres/auth.middlewere'

const router: Router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/is-valid-token', authMiddlewere.validateUser ,authController.isValidToken)

export default router