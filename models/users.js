const mongoose = require('mongoose')
const {createHmac, randomBytes} = require('crypto')
const {createToken} = require('../service/authentication')

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    salt:{
        type: String
    },
    password:{
        type: String,
        required: true
    },
    profileImageUrl:{
        type: String,
        default: ('/images/Profile.png')
    },
    role:{
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, {timestamps: true});

userSchema.pre("save", function(next){
    const user = this;
    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest('hex')
    
    this.salt = salt;
    this.password = hashedPassword;

    next();
})

userSchema.static('matchPassword', async function(email, password){
    const user = await this.findOne({email})
    if(!user) throw new Error("User not found")
    const salt = user.salt
    const hashedPassword = user.password
    const regeneratedHashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest('hex')

    if(regeneratedHashedPassword !== hashedPassword) throw new Error("Invalid password")

    const token = createToken(user)
    return token
})

module.exports = mongoose.model("users", userSchema)