import { Request, Response } from "express";
import Message from "../models/message.model";
import Pair from '../models/pair.model';
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";


const getAllMessages = async (req: Request, res: Response) => {
    try {
        const { user_id } = req

        const { with_id } = req.body
        if (!with_id) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    msg: 'No with_id in json body'
                })
        }

        let messages = await Message
            .find().or([
                { from_id: user_id, to_id: with_id }, 
                { from_id: with_id, to: user_id }
            ])
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

        const { with_id } = req.body
        if (!with_id) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    msg: 'No with_id in json body'
                })
        }

        let messages = await Message
            .find().or([
                { from_id: user_id, to_id: with_id }, 
                { from_id: with_id, to: user_id }
            ])
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
            .sort({last_time: -1})
            .lean()

        let msgList = []
        for (let each of messagesList) {
            msgList.push({
                _id: each._id,
                pair_user: (each.first_id._id.toString() !== req.user_id)
                    ? each.first_id
                    : each.second_id,
                last_message: each.last_message,
                last_time: each.last_time,
            })
        }

        return res.json(msgList)
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