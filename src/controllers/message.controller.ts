import { Request, Response } from "express";
import Message from "../models/message.model";
import { StatusCodes } from "http-status-codes";


const getAllMessages = async (req: Request, res: Response) => {
    try {
        const { user_id } = req
        let messages = await Message
            .find().or([{ from_id: user_id }, { to_id: user_id }])
            .sort({ time: 1 })
            .lean()

        return res.json(messages)
    }
    catch (err) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({
                err: err
            })
    }
}


const getMessages = async (req: Request, res: Response) => {
    try {
        const { user_id } = req 
        const { page } = req.params

        const limit = 5
        const skip = (parseInt(page) - 1) * limit

        let messages = await Message
            .find().or([{ from_id: user_id }, { to_id: user_id }])
            .sort({ time: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        return res.json(messages)
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
    getAllMessages,
    getMessages,
}