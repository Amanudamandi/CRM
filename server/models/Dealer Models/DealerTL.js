const mongoose = require("mongoose");

const DealerTLSchema = new mongoose.Schema({
    empID: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    department: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        default: "67c6ca29be7fcdf7236ed7c7"
    },
    stateID: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: 'State'
    },
    refreshToken: {
        type: String
    }
});

const DealerTL = mongoose.model("DealerTL", DealerTLSchema);
module.exports = DealerTL;
