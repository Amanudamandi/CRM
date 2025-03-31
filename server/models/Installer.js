const mongoose=require('mongoose');

const InstallerSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,

    },
    INSID:{
        type:String,
        required:true
    },
    
})