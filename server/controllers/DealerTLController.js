const DealerTl= require("../models/Dealer Models/DealerTL");
const mongoose= require("mongoose");
const DLemplopyee=require("../models/Dealer Models/DealerEmployee")


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
 // Adjust path as needed

const updateDlTl = async (req, res) => {
    try {
        const TLid = req.query.TLid;
        console.log(TLid)
        const { name, mobile, stateID } = req.body;

        if (!TLid) {
            return res.status(400).json({
                message: "TLid is required",
                success: false,
            });
        }

        const data = {};
        if (name) data.name = name;
        if (mobile) data.mobile = mobile;
          if(stateID) data.stateID=stateID

          console.log(typeof stateID, stateID);
   
        console.log(data, "data is here");

        const response = await DealerTl.findOneAndUpdate(
            { _id: TLid },
            { $set: data },  
            { new: true }
        );
        console.log(response)

        if (!response) {
            return res.status(404).json({
                message: "TL not found",
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
            error: error.message,
        });
    }
};
const teamLeaderProfile = async(req,res) =>{
    try {
        const id = req.query.id || req.param.id || req.body.id;
        if(!id){
            return res.status(401).json({
                success:false,
                msg:"Enter the Team Leader Id"
            })
        }
        const empData = await teamLeader.exists({_id:id});
        // .populate('stateID','state')
        // .select({
        //     empID: 1,  // Include empID
        //     name: 1,   // Include name
        
        //     mobile: 1, // Include mobile
        //     state: 1 // Include stateID (populated field)
        //   });
        const employeeList = await employee.find({teamLeader:empData._id})
        .populate("department","department")
        .select({
            empID:1,
            name:1,
            department:1,
            mobile:1,
            district:1
        });
        return res.status(200).json({
            success:true,
            id:empData._id,
            employeeList: employeeList
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}

const teamLeaderDLprofile=async(req,res)=>{
    try{
        const id = req.query.id || req.param.id || req.body.id;

        if(!id){
            return res.status(401).json({
                success:false,
                msg:"Enter the Team Leader Id"
            })
        }
        console.log(id);

        const teamleader=await DealerTl.find({_id:id});
        console.log(teamleader);

        const response= await DLemplopyee.find({teamLeader:id}).populate("department").populate("stateID").select({empID:true,name:true,department:true,mobile:true,stateID:true});
        console.log(response);
        return res.status(200).json({
            success:true,
            data:response
        })


    }catch(error){
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}

// const teamLeaderProfile = async(req,res) =>{
//     try {
//         const id = req.query.id || req.param.id || req.body.id;
//         if(!id){
//             return res.status(401).json({
//                 success:false,
//                 msg:"Enter the Team Leader Id"
//             })
//         }
//         const empData = await teamLeader.exists({_id:id});
//         // .populate('stateID','state')
//         // .select({
//         //     empID: 1,  // Include empID
//         //     name: 1,   // Include name
        
//         //     mobile: 1, // Include mobile
//         //     state: 1 // Include stateID (populated field)
//         //   });
//         const employeeList = await employee.find({teamLeader:empData._id})
//         .populate("department","department")
//         .select({
//             empID:1,
//             name:1,
//             department:1,
//             mobile:1,
//             district:1
//         });
//         return res.status(200).json({
//             success:true,
//             id:empData._id,
//             employeeList: employeeList
//         })
//     } catch (error) {
//         return res.status(400).json({
//             success:false,
//             msg:error.message
//         });
//     }
// }

module.exports={
    addDealerTL,
    fetchAllTL,
    updateDlTl,
    teamLeaderDLprofile,

}