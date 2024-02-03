const {verifyToken} = require('../service/authentication')


function checkAuth(cookieName){
    return(req, res, next)=>{
        const tokenCookie = req.cookies[cookieName]
        if(!tokenCookie) return next();
        try {
            const user = verifyToken(tokenCookie)
            req.user = user;
        } catch (error) {}
        return next();
    }
}

module.exports = {checkAuth}