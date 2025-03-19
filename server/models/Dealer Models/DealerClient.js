const mongoose=require("mongoose");


const DLClientSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String
    }, 
    empID:{ // its hold employee id
        type:mongoose.Schema.Types.ObjectId,
        ref:'DealerEmployee',
        default:null
    },
    TLID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'DealerTL',
        default:null
    },
    mobile:{
        type:String,
        required:true,
        // unique:true
    },
    source:{
        type:String,
        required:true,
        default:'Facebook'
    },
    stageID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Stage',
        default:'66e15ed1774c6b5fb4ab626b'
    },
    stateID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'State',
        default:null
    },
    district:{
        type:String,
        default:null
    },
    city:{
        type:String,
        default:null,
    },
    zipCode:{
        type:Number
    },
    address:{
        type:String,
        default:null
    },
   
    latitude: {
        type: Number,
       default:null,
        min: -90,
        max: 90,
        validate: {
          validator: (v) => v >= -90 && v <= 90,
          message: (props) => ` Not a valid latitude!`,
        },
      },
      longitude: {
        type: Number,
     default:null,
        min: -180,
        max: 180,
        validate: {
          validator: (v) => v >= -180 && v <= 180,
          message: (props) => ` is Not a valid longitude!`,
        },
      },
   Document:{
 type:String,
 default:null,
   },
     
    kwpInterested:{
        type:String,
        default:'N/A'
    },
    type:{
         type:Number,
         default:1
    },
    CurrentDate:{
        type: Date,
        default:Date.now
    },
    Lead:{
        type:String,
        default:"Dealer Lead"
    },
    interstedIn:{
        type:String,
        default:"N/A"
    }
})


const ClientSchrema=mongoose.model("DLClient",DLClientSchema);
module.exports=ClientSchrema;