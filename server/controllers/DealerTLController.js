const DealerTl= require("../models/Dealer Models/DealerTL");


const addDealerTL = async (req, res) => {
    try {
        const { empID, name, mobile, stateID } = req.body;

        // Fix validation check
        if (!empID || !name || !mobile || !stateID) {
            return res.status(401).json({
                status: false,
                message: "Please Enter All Details",
            });
        }

        // Fix findOne usage
        const findemployee = await DealerTl.findOne({ empID: empID });
        if (findemployee) {
            return res.status(401).json({
                message: "DealerTL already exists",
                success: false,
            });
        }

        // Ensure stateID is stored as an array
        const stateIDs = Array.isArray(stateID) ? stateID : [stateID];

        // Create the new dealer
        const response = await DealerTl.create({ empID, name, mobile, stateID: stateIDs });
           await response.populate("department")
        console.log(response);

        res.status(200).json({
            message: "Added a New DealerTL",
            success: true,
            data: response
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({
            message: "Error in Adding TL",
            success: false
        });
    }
};

const fetchAllTL=async(req,res)=>{
    try{
   const respons=await DealerTl.find({}).populate("department").populate("stateID");
   res.status(200).json({
    message:"fetched all",
    data:respons
   })
    }catch(err){
  console.log(err);
  res.status(400).json({
    message:"Error in fetching"
  })
    }
}

const updateEmployeeDL = async (req, res) => {
    try {
        const { name, mobile, stateID, empID } = req.body;

        if (!empID) {
            return res.status(400).json({
                message: "empID is required",
                success: false,
            });
        }

        const data = {};
        if (name) data.name = name;
        if (mobile) data.mobile = mobile;
        if (stateID) data.stateID = Array.isArray(stateID) ? stateID : [stateID];

        const response = await DealerTl.findOneAndUpdate(
            { empID: empID },
            { $set: data },  // Use `$set` to ensure partial updates
            { new: true }    // Returns the updated document
        );

        if (!response) {
            return res.status(404).json({
                message: "Employee not found",
                success: false,
            });
        }

        res.status(200).json({
            message: "Updated Successfully",
            success: true,
            data: response,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error in Updating TL",
            success: false,
            error: error.message, // Provide error details
        });
    }
};

module.exports={
    addDealerTL,
    fetchAllTL,
    updateEmployeeDL,

}