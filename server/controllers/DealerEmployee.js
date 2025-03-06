const EmployeeDL=require("../models/Dealer Models/DealerEmployee");




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
     const reponse=await EmployeeDL.find({}).populate("stateID").populate("teamLeader").populate("department");
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

module.exports={
    registeremployeeDL,
    fetchAllDealerEmployee,
}

