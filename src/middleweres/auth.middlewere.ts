import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { StatusCodes } from "http-status-codes"

import authConfig from "../configs/auth.config"


const validateUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    msg: 'Token is empty'
                })
        }

        const verified = jwt.verify(token, authConfig.passwordKey) as JwtPayload
        if (!verified) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    msg: 'Can\'t verify identity'
                })
        }

        req.user_id = verified._id
        req.token = token

        return next()
    }
    catch (err) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({
                err: err
            })
    }
    
}


export default {
    validateUser,
}