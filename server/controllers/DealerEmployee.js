const EmployeeDL=require("../models/Dealer Models/DealerEmployee");
const startDateConvertor  = require('../helpers/common/dateConversion/startDate');
const endDateConvertor = require("../helpers/common/dateConversion/endDate");

const DLclient=require("../models/Dealer Models/DealerClient")




const registeremployeeDL = async (req, res) => {
    try {
        const { empID, name, department, teamLeader, mobile, stateID } = req.body;

        // Validation check
        if (!empID || !name || !department || !teamLeader || !mobile || !stateID) {
            return res.status(401).json({
                message: "Please enter all required data",
                success: false,
            });
        }

        // Check if the empID already exists
        const existingEmployee = await EmployeeDL.findOne({ empID });
        if (existingEmployee) {
            return res.status(400).json({
                message: "Employee ID already exists",
                success: false,
            });
        }

        // Ensure stateID is stored as an array
        const stateIDs = Array.isArray(stateID) ? stateID : [stateID];

        // Create the employee
        let newEmployee = new EmployeeDL({ empID, name, department, teamLeader, mobile, stateID: stateIDs });
        let savedEmployee = await newEmployee.save();

        // Populate references
        let response = await EmployeeDL.findById(savedEmployee._id)
            .populate("department")
            .populate("teamLeader");

        res.status(200).json({
            message: "Successfully Registered",
            success: true,
            data: response
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server error while registering employee",
            error: err.message
        });
    }
};

const fetchAllDealerEmployee=async(req,res)=>{
    try{
     const reponse=await EmployeeDL.find({}).populate("stateID").populate("department").populate("teamLeader");
     res.status(200).json({
        message:"Fetched succesfully",
        data:reponse
     })
    }catch(err){
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server error while registering employee",
            error: err.message
        });
    }
}

const UpdateDLemplpoyee=async(req,res)=>{
    try{
    
      
        const{name,stateID,mobile,teamLeader,empID}=req.body;
        console.log(req.body);

     
        const updatedData = {
            name: name ,
            stateID: stateID ,
            mobile: mobile ,
            teamLeader: teamLeader ,
        }
        const updatedEmployee = await EmployeeDL.findOneAndUpdate({empID:empID}, {$set:updatedData}, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            data: updatedEmployee,
        });


    }catch(error){
        console.log(error);
        
        res.status(500).json({
            success: false,
            message: "Server error while registering employee",
           
        });
    }
}

const todayLeads = async(req,res) => {
    
    try{
        const {date, empID, startDate, stageID, endDate, TLID} = req.query;
        
        let filters = {};
        if(date){
            filters.CurrentDate = {
                $gte: await startDateConvertor(date),
                $lte: await endDateConvertor(date)
            };
        }
        if(startDate && endDate){
            filters.CurrentDate = {
                $gte: await startDateConvertor(startDate),
                $lte: await endDateConvertor(endDate)
            };
        }
        (empID)? filters.empID = empID : null;
        (stageID)? filters.stageID = stageID : null;
        (TLID)? filters.TLID = TLID : null;
        // console.log(filters)
        const todaysLead = await DLclient.countDocuments(filters);
        return res.status(201).json({
            success:true,
            todaysLead:todaysLead
        })
    }catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}

module.exports={
    registeremployeeDL,
    fetchAllDealerEmployee,
    UpdateDLemplpoyee,
    todayLeads,

}