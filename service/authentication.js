const jwt = require('jsonwebtoken')
const secret = "@n$u*b&g#at93"

function createToken(user){
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
    };
    const token = jwt.sign(payload, secret);
    return token;
}

function verifyToken(token){
    const payload = jwt.verify(token, secret);
    return payload;
}

module.exports = {createToken, verifyToken}