const mongoose=require('mongoose');

const InstallerSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,

    },
    InsID:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true,
    },
     department:{ 
            type:mongoose.Schema.Types.ObjectId,
            ref:'Department'
        },

           stateID:{
                type:[mongoose.Schema.Types.ObjectId],
                ref:'State'
      
            },
            date:{
                type:Date,
                default:Date.now
            },
    
},{ timestamps: true } )
const Installer=mongoose.model("Installer",InstallerSchema);
module.exports=Installer;
