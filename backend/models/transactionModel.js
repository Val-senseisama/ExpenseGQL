import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var transactionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    paymentType:{
        type:String,
        required:true,
        enum: ["cash", "card"],
    },
    category:{
        type:String,
        required:true,
        enum:["saving", "expense", "investment"],
    },
    amount:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        default: "unknown"
    },
    date:{
        type:Date,
        required: true,
    }
}, {timestamps: true});

//Export the model
const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction