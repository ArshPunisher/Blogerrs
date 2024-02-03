const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
    },
    blogId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "blogs"
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
}, {timestamps: true});

module.exports = mongoose.model('comments', commentSchema)