const jwt = require('jsonwebtoken');

class TokenService {

    /*создание accessTokenа*/
    generateAccessJwt = (payload) => {
        return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '59m'})};

    /*создание refreshTokenа*/
    generateRefreshJwt = (payload) => {
        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '24h'})};

    /*проверка accessTokenа*/
    validateAccessToken = (token) => {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch {
            return null;
        }
    };

    /*проверка refreshTokenа*/
    validateRefreshToken = (token) => {
        try {
            return  jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch  {
            return null;
        }
    };

};

module.exports = new TokenService();