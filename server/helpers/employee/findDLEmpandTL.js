

const DealerEmployee= require("../../models/Dealer Models/DealerEmployee")

const findDealerEmpAndTLID=async(empID)=>{
    try{
        const empdata=await DealerEmployee.findOne({empID:{$regex : empID, $options:"i"} }).select("_id teamLeader");
        const mongooseEmpID = empdata._id.toString();
        const TLID = empdata.teamLeader.toString();
        return {
            empID:mongooseEmpID,
            TLID
        }

    }catch(error){
        console.log(error);
        return empData ={
            empID:null,
            TLID:null
        }
    }
}
module.exports=findDealerEmpAndTLID;