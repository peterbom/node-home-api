import { jws } from 'jsrsasign';

export class JwtParser {
    parseJwt (jwt) {
        var token = jws.JWS.parse(jwt);
        return {
            header: token.headerObj,
            payload: token.payloadObj
        }
    }
}