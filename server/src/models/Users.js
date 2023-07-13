const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email : {
        type: String,
        required : true,
        unique : true
    },
    password :{
        type: String,
        required : true
    },
    savedNotes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: "notes",
    }],
    receivedNotes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: "notes",
    }]
    
});

const UserModel = mongoose.model("users" , UserSchema);
module.exports = UserModel;