declare namespace Express {
    export interface Request {
        user_id: String,
        token: String,
    }
}

declare namespace jwt {
    export interface JwtPayload {
        _id: String,
    }
}
