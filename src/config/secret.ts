import * as dotenv from "dotenv";

dotenv.config({path:`${__dirname}/../.env`});


//server configuration
export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME;
export const SERVER_PORT = process.env.SERVER_PORT;
export const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME;
export const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER;
export const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || 'superencryptedsecret';

// mongoose options
export const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: false
};

export const mongoUri = process.env.MONGO_URI;

// Firebase Admin SDK
export const AdminSDKRoute = process.env.AdminSDKRoute;

export const googleTokenUri = process.env.GOOGLE_TOKEN_URI

export const googleLoginConfig = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: process.env.GOOGLE_GRANT_TYPE
};

