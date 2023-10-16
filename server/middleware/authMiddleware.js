const tokenService = require('../service/tokenService');


module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const authorizationHeader = req.headers.authorization;
       if (!authorizationHeader) {
           return res.status(401).json('Вы не авторизованы');
       }

       const accessToken = authorizationHeader.split(' ')[1];
       if (!accessToken) {
           return res.status(401).json('Вы не авторизованы');
       }

       const userData = tokenService.validateAccessToken(accessToken);
       if (!userData) {
           return res.status(401).json('Вы не авторизованы');
       }
        next()
    } catch  {
        res.status(401).json('Вы не авторизованы');
    }
};
