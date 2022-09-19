import axios from 'axios'
import {googleTokenUri, googleLoginConfig} from '../config/secret';

const NAMESPACE = 'GoogleCodeExchange'

const parseTokensFromGoogleResponse = (res : any) : {access_token : any, id_token : any} => {
    let response = JSON.parse(res);
    let {access_token, id_token} = response;
    return {access_token, id_token};
}

const googleCodeExchangeRequest = axios.create({
    method: 'POST',
    baseURL: googleTokenUri,
    transformResponse: [parseTokensFromGoogleResponse],
    timeout: 5000
});

const getGoogleTokens = async (code : any) : Promise<{ access_token: any; id_token: any; }> => {
    const googleResponse = await googleCodeExchangeRequest
    .post('', {
        code,
        ...googleLoginConfig
    });
    return googleResponse.data;
}

export default getGoogleTokens;