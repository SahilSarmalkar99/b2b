const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },

    phone: {
        type : String,
        required : true,
        unique : true
    },


    role : {
        type : String,
        enum : ["admin" , "user" , "worker"],
        default : "user"
    }
})

const authModel = mongoose.model("Auth" , authSchema);
module.exports = authModel;