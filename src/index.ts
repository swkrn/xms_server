import express, { Express } from "express"
import mongoose, { connect } from 'mongoose'
import http from 'http'
import socketio from 'socket.io'

const app: Express = express()
const port = process.env.PORT || 3000


import dbConfig from "./configs/db.config"
mongoose.connect(dbConfig.dbUrl)


app.use(express.json())


import authRouter from './routes/auth.route'
app.use('/auth', authRouter)


const server = http.createServer(app)
const io = new socketio.Server(server)

import messageSocket from "./sockets/message.socket"

io.on('connection', socket => {
    messageSocket(io, socket)
})


server.listen(port, () => {
    console.log(`[server]: Server is running on port ${port}`)
})