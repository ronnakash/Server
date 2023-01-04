export interface JWTParams {
    _id: string;
    email: string;
    exp: number;
    iat: number;
    iss: string
    permission: string;
    username: string;
}

export interface JWTBody {
    jwt: JWTParams;
}

