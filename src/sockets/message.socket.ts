import socketio from 'socket.io'
import jwt, { JwtPayload } from 'jsonwebtoken'

import authConfig from '../configs/auth.config'

import Message from '../models/message.model'


export default (io: socketio.Server, socket: socketio.Socket) => {

    socket.on('send-message', async (data) => {
        try {
            const { from_token, to_id, message } = JSON.parse(data)

            console.log(data)

            const verfied = jwt.verify(from_token, authConfig.passwordKey) as JwtPayload
            if (!verfied) {
                return
            }

            const from_id = verfied._id
            
            let msg = new Message({
                from_id,
                to_id,
                message,
            })

            msg = await msg.save()

            io.to(to_id).emit(
                'recieve-message',
                {
                    from_id,
                    to_id,
                    message,
                }
            )
        }
        catch (err) {
            console.log(err)
        }
    })

    socket.on('read-message', async (data) => {
        try {
            const { reader_token, message_id } = JSON.parse(data)

            const verfied = jwt.verify(reader_token, authConfig.passwordKey) as JwtPayload
            if (!verfied) {
                return
            }

            let msg = await Message.findById(message_id)
            if (!msg) {
                return
            }

            if (msg.to_id.toString() != verfied._id) {
                return
            }

            msg.isRead = true
            msg = await msg.save()
        }
        catch (err) {
            console.log(err)
        }
    })
}