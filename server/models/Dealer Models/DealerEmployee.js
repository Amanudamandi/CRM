const mongoose= require("mongoose");


const DealerEmployeeSchema=new mongoose.Schema({
    empID:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    department:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department'
    },
    teamLeader:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'DealerTL',
        default:"N/A"
    },
    mobile:{
        type:Number,
        required:true
    },
    stateID:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'State'
    },
   
    date:{
        type:Date,
        default:Date.now
    },
    refreshToken:{
        type:String
    }
})

const DealerEmployee=mongoose.model("DealerEmployee",DealerEmployeeSchema);
module.exports=DealerEmployee;

