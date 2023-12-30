import { Request, Response } from "express";
import Message from "../models/message.model";
import Pair from '../models/pair.model';
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";


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


const getMessagesList = async (req: Request, res: Response) => {
    try {
        let messagesList = await Pair
            .find()
            .or([
                {first_id: new mongoose.Types.ObjectId(req.user_id)}, 
                {second_id: new mongoose.Types.ObjectId(req.user_id)}
            ])
            .populate('first_id', 'username')
            .populate('second_id', 'username')
            .lean()

        return res.json(messagesList)
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
    getMessagesList,
}