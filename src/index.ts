import express, { Express, Request, Response } from "express"
import mongoose from 'mongoose'

import authRouter from './routes/auth.route'
import dbConfig from "./configs/db.config"

const app: Express = express()
const port = process.env.PORT || 3000

mongoose.connect(dbConfig.dbUrl)

app.use(express.json())

app.use('/auth', authRouter)

app.listen(port, () => {
    console.log(`[server]: Server is running on port ${port}`)
})