import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import User from '../models/user.model'

import authConfig from '../configs/auth.config'


const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body

        if (username.length < 3 || username.length > 20) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    msg: 'Username length must between 3-20 characters'
                })
        }

        if (password.length < 8 || password > 20) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    msg: 'Password length must between 8-20 characters'
                })
        }
        
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    msg: `Username '${username}' is already takken`
                })
        }

        const hashedPassword = await bcrypt.hash(password, authConfig.saltLength)

        let user = new User({
            username,
            hashedPassword,
        })

        user = await user.save()
        return res.json({
            msg: `Successfully created account '${user.username}'`
        })
    }
    catch (err) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({
                err: err
            })
    }
    
}


const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username })
        if (!user) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    msg: 'Username not found'
                })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.hashedPassword)
        if (!isPasswordMatch) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    msg: 'Incorrect password'
                })
        }

        const token = jwt.sign({_id: user._id}, authConfig.passwordKey)

        return res.json({ token, username: user.username })
    }
    catch (err) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({
                err: err
            }) 
    }
}


const isValidToken = async (req: Request, res: Response) => {
    return res.json(true);
}


export default {
    register,
    login,
    isValidToken,
}