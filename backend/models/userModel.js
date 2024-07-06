const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    }, 
    name:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    gender:{
        type:String,
        enum: ["male", "female"]
    },
    password:{
        type:String,
        required:true,
    },
}, {timestamps: true});

//Export the model
module.exports = mongoose.model('User', userSchema);