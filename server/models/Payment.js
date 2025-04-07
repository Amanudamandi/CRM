const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const Payment=mongoose.model("Payment",paymentSchema);
module.exports=Payment;