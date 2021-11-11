

//server configuration
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3001;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'Administrator';
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || 'superencryptedsecret';

// mongoose options
const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: false
};

const mongoUri = "mongodb+srv://Admin:pass@mongocluster.8zgcv.mongodb.net/db?retryWrites=true&w=majority";


export default { SERVER_HOSTNAME, SERVER_PORT, SERVER_TOKEN_EXPIRETIME, SERVER_TOKEN_ISSUER,
                 SERVER_TOKEN_SECRET, MONGO_OPTIONS, mongoUri }