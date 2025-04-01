const mongoose=require("mongoose")

const Details= new mongoose.Schema({
    Videos:{
        type:String,
         default:null,
        },
        AadharCard:{
            type:String,
            default:null
        },
        PanCard:{
            type:String,
            default:null
        },
        ElectrcityBill:{
            type:String,
            default:null
        },
        Dimension:{
            type:String,
            default:null
        },
        CancelCheack:{
            type:String,
            default:null,
        },
        AccountNo:{
            type:Number,
            default:null
        },
        ELCB:{
            type:String,
            default:"No"
        },
        IFSC:{
            type:String,
            default:null
        },
        BankAddress:{
            type:String,
            default:null
        },
        ProposalPdf:{
            type:String,
            default:null,
        },
        Remainder:{
            type:String,
            default:null,
        },
        Sanctioned_Load:{
            type:String,
            default:null,
        },
        Proposed_Capacity_Kw:{
            type:String,
            default:null,
        },
        Dc_Wire_Length:{
            type:String,
            default:null,
        },
        Ac_wire_Length:{
            type:String,
            default:null,
        },
        Type_Of_Roof:{
            type:String,
            default:null,
        },
        Earthing_Wire_Length:{
            type:String,
            default:null,
        },//photo
        No_of_Floor:{
            type:String,
            default:null,
        },
        Roof_Picture:{
            type:String,
            default:null,
        },Type_of_Meter:{
            type:String,
            default:null,



        },
        Photos: {
            type: [String], 
            default: [],
        }



})
const Extradetail=mongoose.model("ExtraDetail",Details);
module.exports=Extradetail;