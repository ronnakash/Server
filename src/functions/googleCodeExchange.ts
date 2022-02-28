import axios from 'axios'
import logging from '../config/logging';
import config from '../config/secret';

const NAMESPACE = 'GoogleCodeExchange'

let {GOOGLE_CODE_EXCHANGE_REQUEST_CONFIG, GOOGLE_TOKEN_URI} = config.googleLoginConfig;

const parseTokensFromGoogleResponse = (res : any) : {access_token : any, id_token : any} => {
    logging.info(NAMESPACE,'res:', res);
    let response = JSON.parse(res);
    logging.info(NAMESPACE,'response:', response);
    let {access_token, id_token} = response;
    logging.info(NAMESPACE,'tokens:', {access_token, id_token});
    return {access_token, id_token};
}

const googleCodeExchangeRequest = axios.create({
    method: 'POST',
    baseURL: GOOGLE_TOKEN_URI,
    transformResponse: [parseTokensFromGoogleResponse],
    timeout: 5000
});

const getGoogleTokens = async (code : any) : Promise<{ access_token: any; id_token: any; }> => {
    const googleResponse = await googleCodeExchangeRequest
    .post('', {
        code,
        ...GOOGLE_CODE_EXCHANGE_REQUEST_CONFIG
    });
    return googleResponse.data;
}

export default getGoogleTokens;