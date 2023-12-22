declare namespace Express {
    export interface Request {
        user_id: string,
        token: string,
    }
}

declare namespace jwt {
    export interface JwtPayload {
        _id: string,
    }
}
