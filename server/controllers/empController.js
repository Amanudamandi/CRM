const assignEmp = require("../models/assignEmployee");
const client = require("../models/client");
const employee = require("../models/employee")
const District= require("../models/district")
require("dotenv").config();
const mongoose= require("mongoose")

const startDateConvertor  = require('../helpers/common/dateConversion/startDate');
const endDateConvertor = require("../helpers/common/dateConversion/endDate");
const StageActivity = require('../models/stageActivity');
const ExtraDetail= require("../models/Extradetails");
const Extradetail = require("../models/Extradetails");

const Payment = require("../models/Payment");
const assignEmployee = async(req,res) =>{
    try {
        const {clientID, callingEmpID, fieldEmpID} = req.body;
        const findData = {clientID};
        const updateData = {callingEmpID, fieldEmpID};
        const updateResult = await assignEmp.findOneAndUpdate(
            findData,
            { $set: updateData },
            { new: true, upsert: true, runValidators: true } // Options: create if not found, return updated doc, and validate
        );
        return res.status(200).json({
            success:true,
            updateData: updateResult
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const todayLead = async(req,res) => {
    
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
        const todaysLead = await client.countDocuments(filters);
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
const showVisitingList = async(req,res) =>{

    try {
        const empID = req.user.employee._id;
        console.log(empID)
        // const visitingDate = (req.visitingDate) ? req.visitingDate :  new Date();
        // console.log(empID ,visitingDate)
        const filters = {};
        (empID)? filters.fieldEmpID = empID : null;
        // if(visitingDate){ 
        //     filters.visitingDate = {
        //         $gte: await startDateConvertor(visitingDate),
        //         $lte: await endDateConvertor(visitingDate)
        //     };
        // }

        // console.log(filters)
        const list = await assignEmp.find(filters).select("-__v -fieldEmpID -createAt")
        .populate({
            path: 'clientID',  // Populate client information
                populate: {  // Nested populate for empID inside clientID
                    path: 'empID',  // Assuming empID is a reference inside the Client schema
                    select:(" -_id -empID -teamLeader -stateID -department -district -date -__v")
                },
            select:("-TLID -__v -CurrentDate -stageID -_id")
        });
        return res.status(201).json({
            success:true,
            data:list
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const updateClientByFieldEmp = async(req,res) =>{
    try {
        const empID =req.user.employee._id;
        // field name -> clientID email, stageID, kwpInterested, type, remark
        const clientID = req.body.clientID;
        const updateClient = await client.findByIdAndUpdate(clientID, req.body,{ new:true, runValidators: true });
        console.log(updateClient)
        const stageID = req.body.stageID;
        let updatedStage;
        if(stageID){
            const newStage = new StageActivity({
                clientID, empID, stageID, remark
            });
            updatedStage = await newStage.save(); 
        }
        return res.status(200).json({x:updatedStage})
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const remark = async(req,res) =>{
    try {
        const clientId = req.query['clientId'] || req.params['clientId'] || req.body.clientId ;
        const stageData = await StageActivity.find({clientID : clientId});
        return res.status(200).json({
            success:true,
            activity:stageData
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const empdetail=async(req,res)=>{
   try{
    const id = req.query.id;
    const user =await employee.find({empID:id}).populate("department").populate("teamLeader").populate(`stateID`);
    res.status(200).json({
        message:"success",
        data:user,
    })

   }catch(err){
    console.log(err);
res.status(400).json({
    message:"error",
})
   }
}
const fetchLeads = async(req,res)=>{
    try{
        const id= req.id;
        
        console.log(id);
        const {status}=req.query;
        console.log(status)

        if(!id){
            return res.status(400).json({
                success:false,
                message:"please enter the employee ID"
            })
        }
        const user = await assignEmp.find({ fieldEmpID: id }).populate({ path: "clientID", populate: [{ path: "AdditionalDetails" }, { path: "stateID" }] });
        // console.log(user);
        const filteredData =await user.filter(item => item?.clientID && item?.clientID?.status === status);

console.log(filteredData);

      
      
        if (user) {
           
            res.status(200).json({
                success: true,
              data:!!status?filteredData:user
            })

        }
    }catch(error){
        res.status(400).json({
            message:"error in fetching",
            error:error.message
        })
    }
 }


//  const updateclient=async(req,res)=>{
//     try{
//         const{AccountNo,IFSC,BankAddress}=req.body;

//         const AadharCard= req.files["aadhaarPhotos"] ? `${process.env.SERVER_URL}uploads/aadhar/${req.files["aadhaarPhotos"][0].filename}` : null;
//         const  PanCard = req.files["pancard"] ? `${process.env.SERVER_URL}uploads/pancard/${req.files["pancard"][0].filename}` : null;
//         const ElectrcityBill=req.files["electricitybill"]?`${process.env.SERVER_URL}uploads/ElectricityBill/${req.files["electricitybill"][0].filename}`:null;
//         const Videos=req.files["Video"]?`${process.env.SERVER_URL}uploads/Video/${req.files["Video"][0].filename}`:null;
//         const Dimension=req.files["dimensions"]?`${process.env.SERVER_URL}uploads/dimensions/${req.files["dimensions"][0].filename}`:null;
//         const CancelCheack=req.files["cancelcheack"]?`${process.env.SERVER_URL}uploads/cancelcheack/${req.files["cancelcheack"][0].filename}`:null;
//          const   ProposalPdf=req.files["proposalpdf"]?`${process.env.SERVER_URL}uploads/proposalpdf/${req.files["proposalpdf"][0].filename}`:null;
       
//         const ExtraDetails= new Extradetail({
//             AccountNo,IFSC,BankAddress,AadharCard,PanCard,ElectrcityBill,Videos,Dimension,CancelCheack, ProposalPdf
//         })
//         ExtraDetails.save();

//         res.status(200).json({
//             message:"save succesfully",
//             data:ExtraDetails,
//             success:true,
//         })


    



//     }catch(err){
//         console.log(err)
//         res.status(400).json({
//             message:"Unsuccesfull",
//             success:false,
//         })
//     }
//  }


// const updateclient = async (req, res) => {
//     const session = await mongoose.startSession(); // Start a MongoDB session
//     console.log(session);
//     session.startTransaction(); // Start transaction
//     try {
//         const { AccountNo, IFSC, BankAddress, additonalDetailsID, Remainder ,No_of_Floor,Earthing_Wire_Length,
//             Type_Of_Roof,    Ac_wire_Length, Dc_Wire_Length,  Proposed_Capacity_Kw,name,stateID,mobile,ClientID,address,Sanctioned_Load,Type_of_Meter,email,
//             Totalamount, Receivedamount } = req.body;

// console.log("request data",req.body)

//         // Ensure that additonalDetailsID is provided
//         if (!additonalDetailsID) {
//             return res.status(400).json({ message: "Missing additonalDetailsID", success: false });
//         }

//         // Create an update object dynamically
//         let updateFields = {
//             Remainder, AccountNo, IFSC, BankAddress,No_of_Floor,Earthing_Wire_Length, Type_Of_Roof, Ac_wire_Length, Dc_Wire_Length,  Proposed_Capacity_Kw,Sanctioned_Load,Type_of_Meter
//         };

//         // Handle file updates only if they exist
//         if (req.files) {
//             if (req.files["aadhaarPhotos"]) {
//                 updateFields.AadharCard = `${process.env.SERVER_URL}uploads/aadhar/${req.files["aadhaarPhotos"][0].filename}`;
//             }
//             if (req.files["pancard"]) {
//                 updateFields.PanCard = `${process.env.SERVER_URL}uploads/pancard/${req.files["pancard"][0].filename}`;
//             }
//             if (req.files["electricitybill"]) {
//                 updateFields.ElectrcityBill = `${process.env.SERVER_URL}uploads/ElectricityBill/${req.files["electricitybill"][0].filename}`;
//             }
//             if (req.files["Video"]) {
//                 updateFields.Videos = `${process.env.SERVER_URL}uploads/video/${req.files["Video"][0].filename}`;
//             }
//             if (req.files["dimensions"]) {
//                 updateFields.Dimension = `${process.env.SERVER_URL}uploads/dimensions/${req.files["dimensions"][0].filename}`;
//             }
//             if (req.files["cancelcheack"]) {
//                 updateFields.CancelCheack = `${process.env.SERVER_URL}uploads/cancelcheack/${req.files["cancelcheack"][0].filename}`;
//             }
//             if (req.files["proposalpdf"]) {
//                 updateFields.ProposalPdf = `${process.env.SERVER_URL}uploads/proposalpdf/${req.files["proposalpdf"][0].filename}`;
//             }
//             if(req.files['ELCB']){
//                 updateFields.ELCB=`${process.env.SERVER_URL}uploads/ELCB/${req.files["ELCB"][0].filename}`;
//             }
//             if(req.files['Roof-Picture']){
//                 updateFields.Roof_Picture=`${process.env.SERVER_URL}uploads/Roof-Picture/${req.files["Roof-Picture"][0].filename}`;
//             }
//         }

//         // Update only provided fields
//         const updatedData = await Extradetail.findOneAndUpdate(
//             { _id: additonalDetailsID },
//             { $set: updateFields },
//             { new: true, session }  // Return the updated document
//         );
//         console.log(updatedData)

//         if (!updatedData) {
//             return res.status(404).json({ message: "Document not found", success: false });
//         }
//         let filter = {};
//         let payment=null;
//         if(Receivedamount){
        
//          payment= new Payment({amount:Receivedamount},{session});
//         await payment.save();
    
//             // if(Totalamount===Receivedamount){
//             //     filter.PaymentStatus="Complete"
//             //   }else if(Totalamount>Receivedamount){
//             //     filter.PaymentStatus="Partial"
//             //   }
    
//           }
//       if(name){
//         filter.name=name;
//       }
//       if(email){
//         filter.email=email;
//       }
//       if(mobile){
//         filter.mobile=mobile;
//       }
//       if(stateID){
//         filter.stateID=stateID
//       }
//       if(address){
//         filter.address=address;
//       }
//       if(Totalamount){
//         filter.Totalamount=Totalamount;
//       }
//       if(Receivedamount){
//         const clientData = await client.findOne({ _id: ClientID }, { session });
//         const newReceivedAmount = (clientData.Receivedamount || 0) + parseFloat(Receivedamount);

//         filter.Receivedamount = newReceivedAmount;
//         if (Totalamount === newReceivedAmount) {
//             filter.PaymentStatus = "Complete";
//         } else if (Totalamount > newReceivedAmount) {
//             filter.PaymentStatus = "Partial";
//         }

//         if (payment) {
//             filter.$push = { payments: payment._id }; // Store payment ID in the client collection
//         }
//       }
      
    
   
     
      
//       console.log(filter,"filter data");
//       const result= await client.find({_id:ClientID});
//       console.log(result,"find")
//            const updateclient=await client.findOneAndUpdate({_id:ClientID},{$set:filter},   { new: true, session })
//            console.log(updateclient);
//            await session.commitTransaction();
//            session.endSession();
//         res.status(200).json({
//             message: "Save successfully",
//             data: updatedData,
//             clinetData:updateclient,
//             Payment:payment,
//             success: true,
//         });
//         console.log(updateclient);
//     } catch (err) {
//         await session.abortTransaction();
//         session.endSession();
//         console.log(err);
//         res.status(500).json({
//             message: "Unsuccessful",
//             success: false,
//             error: err.message,
//         });
//     }
// };
// const updateclient = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
  
//     try {
//       const {
//         AccountNo,
//         IFSC,
//         BankAddress,
//         additonalDetailsID,
//         Remainder,
//         No_of_Floor,
//         Earthing_Wire_Length,
//         Type_Of_Roof,
//         Ac_wire_Length,
//         Dc_Wire_Length,
//         Proposed_Capacity_Kw,
//         name,
//         stateID,
//         mobile,
//         ClientID,
//         address,
//         Sanctioned_Load,
//         Type_of_Meter,
//         email,
//         Totalamount,
//         Receivedamount,
//       } = req.body;
  
//       if (!additonalDetailsID) {
//         return res.status(400).json({ message: "Missing additonalDetailsID", success: false });
//       }
  
//       // Prepare fields for additional detail update
//       let updateFields = {};
  
//       if (Remainder) updateFields.Remainder = Remainder;
//       if (AccountNo) updateFields.AccountNo = AccountNo;
//       if (IFSC) updateFields.IFSC = IFSC;
//       if (BankAddress) updateFields.BankAddress = BankAddress;
//       if (No_of_Floor) updateFields.No_of_Floor = No_of_Floor;
//       if (Earthing_Wire_Length) updateFields.Earthing_Wire_Length = Earthing_Wire_Length;
//       if (Type_Of_Roof) updateFields.Type_Of_Roof = Type_Of_Roof;
//       if (Ac_wire_Length) updateFields.Ac_wire_Length = Ac_wire_Length;
//       if (Dc_Wire_Length) updateFields.Dc_Wire_Length = Dc_Wire_Length;
//       if (Proposed_Capacity_Kw) updateFields.Proposed_Capacity_Kw = Proposed_Capacity_Kw;
//       if (Sanctioned_Load) updateFields.Sanctioned_Load = Sanctioned_Load;
//       if (Type_of_Meter) updateFields.Type_of_Meter = Type_of_Meter;
  
//       console.log(updateFields);
  
//       // Handle files if uploaded
//       if (req.files) {
//         if (req.files["aadhaarPhotos"]) {
//           updateFields.AadharCard = `${process.env.SERVER_URL}uploads/aadhar/${req.files["aadhaarPhotos"][0].filename}`;
//         }
//         if (req.files["pancard"]) {
//           updateFields.PanCard = `${process.env.SERVER_URL}uploads/pancard/${req.files["pancard"][0].filename}`;
//         }
//         if (req.files["electricitybill"]) {
//           updateFields.ElectrcityBill = `${process.env.SERVER_URL}uploads/ElectricityBill/${req.files["electricitybill"][0].filename}`;
//         }
//         if (req.files["Video"]) {
//           updateFields.Videos = `${process.env.SERVER_URL}uploads/video/${req.files["Video"][0].filename}`;
//         }
//         if (req.files["dimensions"]) {
//           updateFields.Dimension = `${process.env.SERVER_URL}uploads/dimensions/${req.files["dimensions"][0].filename}`;
//         }
//         if (req.files["cancelcheack"]) {
//           updateFields.CancelCheack = `${process.env.SERVER_URL}uploads/cancelcheack/${req.files["cancelcheack"][0].filename}`;
//         }
//         if (req.files["proposalpdf"]) {
//           updateFields.ProposalPdf = `${process.env.SERVER_URL}uploads/proposalpdf/${req.files["proposalpdf"][0].filename}`;
//         }
//         if (req.files["ELCB"]) {
//           updateFields.ELCB = `${process.env.SERVER_URL}uploads/ELCB/${req.files["ELCB"][0].filename}`;
//         }
//         if (req.files["Roof-Picture"]) {
//           updateFields.Roof_Picture = `${process.env.SERVER_URL}uploads/Roof-Picture/${req.files["Roof-Picture"][0].filename}`;
//         }
//       }
  
//       // Update additional details
//       const updatedData = await Extradetail.findOneAndUpdate(
//         { _id: additonalDetailsID },
//         { $set: updateFields },
//         { new: true, session }
//       );
  
//       if (!updatedData) {
//         return res.status(404).json({ message: "Document not found", success: false });
//       }
  
//       // Now update client
//       let filter = {};
//       let payment = null;
  
//       if (Receivedamount && !isNaN(Receivedamount)) {
//         payment = new Payment({ amount: Receivedamount });
//         await payment.save({ session });
  
//         const clientData = await client.findOne({ _id: ClientID }).session(session);
//         const newReceivedAmount = (clientData.Receivedamount || 0) + parseFloat(Receivedamount);
//         filter.Receivedamount = newReceivedAmount;
//       }
  
//       // Update other client fields if provided
//       if (name) filter.name = name;
//       if (email) filter.email = email;
//       if (mobile) filter.mobile = mobile;
//       if (stateID) filter.stateID = stateID;
//       if (address) filter.address = address;
//       if (Totalamount && !isNaN(Totalamount)) filter.Totalamount = Totalamount;
  
//       // Final update object
//       const updateQuery = { $set: filter };
//       if (payment?._id) {
//         updateQuery.$push = { payments: payment._id };
//       }
  
//       // Update client
//       const updatedClient = await client.findOneAndUpdate(
//         { _id: ClientID },
//         updateQuery,
//         { new: true, session }
//       );
  
//       await session.commitTransaction();
//       await session.endSession();
  
//       return res.status(200).json({
//         message: "Saved successfully",
//         data: updatedData,
//         clientData: updatedClient,
//         payment: payment,
//         success: true,
//       });
//     } catch (err) {
//       await session.abortTransaction();
//       session.endSession();
//       console.error(err);
//       return res.status(500).json({
//         message: "Update failed",
//         success: false,
//         error: err.message,
//       });
//     }
//   };
const updateclient = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
 
    try {
      const {
        AccountNo,
        IFSC,
        BankAddress,
        additonalDetailsID,
        Remainder,
        No_of_Floor,
        Earthing_Wire_Length,
        Type_Of_Roof,
        Ac_wire_Length,
        Dc_Wire_Length,
        Proposed_Capacity_Kw,
        name,
        stateID,
        mobile,
        ClientID,
        address,
        Sanctioned_Load,
        Type_of_Meter,
        email,
        Totalamount,
        Receivedamount,
      } = req.body;
 
      if (!additonalDetailsID) {
        return res.status(400).json({ message: "Missing additonalDetailsID", success: false });
      }
 
      // Prepare fields for additional detail update
      let updateFields = {};
 
      if (Remainder) updateFields.Remainder = Remainder;
      if (AccountNo) updateFields.AccountNo = AccountNo;
      if (IFSC) updateFields.IFSC = IFSC;
      if (BankAddress) updateFields.BankAddress = BankAddress;
      if (No_of_Floor) updateFields.No_of_Floor = No_of_Floor;
      if (Earthing_Wire_Length) updateFields.Earthing_Wire_Length = Earthing_Wire_Length;
      if (Type_Of_Roof) updateFields.Type_Of_Roof = Type_Of_Roof;
      if (Ac_wire_Length) updateFields.Ac_wire_Length = Ac_wire_Length;
      if (Dc_Wire_Length) updateFields.Dc_Wire_Length = Dc_Wire_Length;
      if (Proposed_Capacity_Kw) updateFields.Proposed_Capacity_Kw = Proposed_Capacity_Kw;
      if (Sanctioned_Load) updateFields.Sanctioned_Load = Sanctioned_Load;
      if (Type_of_Meter) updateFields.Type_of_Meter = Type_of_Meter;
 
      console.log(updateFields);
 
      // Handle files if uploaded
      if (req.files) {
        if (req.files["aadhaarPhotos"]) {
          updateFields.AadharCard = `${process.env.SERVER_URL}uploads/aadhar/${req.files["aadhaarPhotos"][0].filename}`;
        }
        if (req.files["pancard"]) {
          updateFields.PanCard = `${process.env.SERVER_URL}uploads/pancard/${req.files["pancard"][0].filename}`;
        }
        if (req.files["electricitybill"]) {
          updateFields.ElectrcityBill = `${process.env.SERVER_URL}uploads/ElectricityBill/${req.files["electricitybill"][0].filename}`;
        }
        if (req.files["Video"]) {
          updateFields.Videos = `${process.env.SERVER_URL}uploads/video/${req.files["Video"][0].filename}`;
        }
        if (req.files["dimensions"]) {
          updateFields.Dimension = `${process.env.SERVER_URL}uploads/dimensions/${req.files["dimensions"][0].filename}`;
        }
        if (req.files["cancelcheack"]) {
          updateFields.CancelCheack = `${process.env.SERVER_URL}uploads/cancelcheack/${req.files["cancelcheack"][0].filename}`;
        }
        if (req.files["proposalpdf"]) {
          updateFields.ProposalPdf = `${process.env.SERVER_URL}uploads/proposalpdf/${req.files["proposalpdf"][0].filename}`;
        }
        if (req.files["ELCB"]) {
          updateFields.ELCB = `${process.env.SERVER_URL}uploads/ELCB/${req.files["ELCB"][0].filename}`;
        }
        if (req.files["Roof-Picture"]) {
          updateFields.Roof_Picture = `${process.env.SERVER_URL}uploads/Roof-Picture/${req.files["Roof-Picture"][0].filename}`;
        }
      }
 
      // Update additional details
      const updatedData = await Extradetail.findOneAndUpdate(
        { _id: additonalDetailsID },
        { $set: updateFields },
        { new: true, session }
      );
 
      if (!updatedData) {
        return res.status(404).json({ message: "Document not found", success: false });
      }
 
      // Now update client
      let filter = {};
      let payment = null;
 
      if (Receivedamount && !isNaN(Receivedamount)) {
        payment = new Payment({ amount: Receivedamount });
        await payment.save({ session });
 
        const clientData = await client.findOne({ _id: ClientID }).session(session);
        const newReceivedAmount = (clientData.Receivedamount || 0) + parseFloat(Receivedamount);
        filter.Receivedamount = newReceivedAmount;
        const total = !isNaN(Totalamount) ? parseFloat(Totalamount) : clientData.Totalamount;
       
             
  if (!isNaN(total)) {
    if (newReceivedAmount >= total) {
      filter.PaymentStatus = "Complete";
    } else {
      filter.PaymentStatus = "Partial";
    }
  }
      }
     
 
      // Update other client fields if provided
      if (name) filter.name = name;
      if (email) filter.email = email;
      if (mobile) filter.mobile = mobile;
      if (stateID) filter.stateID = stateID;
      if (address) filter.address = address;
      if (Totalamount && !isNaN(Totalamount)) filter.Totalamount = Totalamount;
 
      // Final update object
      const updateQuery = { $set: filter };
      if (payment?._id) {
        updateQuery.$push = { payments: payment._id };
      }
 
      // Update client
      const updatedClient = await client.findOneAndUpdate(
        { _id: ClientID },
        updateQuery,
        { new: true, session }
      );
 
      await session.commitTransaction();
      await session.endSession();
 
      return res.status(200).json({
        message: "Saved successfully",
        data: updatedData,
        clientData: updatedClient,
        payment: payment,
        success: true,
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      return res.status(500).json({
        message: "Update failed",
        success: false,
        error: err.message,
      });
    }
}
  
const updateEmployee=async(req,res)=>{
    try{
        const {empId,name,teamleader,mobile,stateID,district,status} = req.body;
        console.log(empId);
        console.log(stateID);
        console.log(district);
       
        
        // if(!district || !Array.isArray(district) || district.length==0){
        //     res.status(400).json({
        //         message:"District cannot be empty"
        //     })
        // }
        const empdetail=await employee.findOneAndUpdate({empID:empId},{
            $set:{
                name:name,
                teamLeader:teamleader,
                mobile:mobile,
                stateID:stateID,
                district:district
            },
           
        })
        if(!empdetail){
            return res.status(500).json({
                success:false,
                msg:'Employeee ID not exits!'
            })
        }
       
        

        // for (let state of stateID) {
        // //     console.log(state);
        // //     const districtlist = await District.find({ stateID: state });
        // //     console.log(districtlist)
        // //           districtlist.district = districtlist.district?.map(d => {
        // //             if (district.includes(d.name)  && d.status==false) {
        // //               d.status=true;
                        
        // //             }
        // //             return d;
        // //         });
        // //      await districtlist.save();
        // // }
        
        // for (let state of stateID) {
        //     console.log(state);
            
        //     // Fetch all district documents matching the stateID
        //     const districtlist = await District.find({ stateID: state });
        
        //     console.log(districtlist);
        
        //     // Iterate over each district document and update
        //     for (let district of districtlist) {
        //         district.district = district.district?.map(d => {
        //             if (district.includes(d.name) && d.status === false) {
        //                 d.status = true;
        //             }
        //             return d;
        //         });
        
        //         // Save each updated document
        //         await district.save();
        //     }
        // }
        for( let eachState of stateID ){
            // Find the District document by stateID for change district status value
            const districtDoc = await District.findOne({ stateID: eachState });
            console.log(districtDoc)
            let isModified = false;

            // Loop through each district in the document and toggle the status if the name matches
            districtDoc.district = districtDoc?.district.map(d => {
                if (district?.includes(d.name)) {
                    d.status = !d.status; // Toggle status
                    isModified = true; // Indicate that we made a change
                }
                return d;
            });
            if (isModified) {
                await districtDoc.save();
            }
        }
        
        if(await empdetail.save()){
            res.status(200).json({ 
                success:true,
                msg:'Employee updated succesfully.',
                data:empdetail,
            });
        }else{
            res.status(400).json({ 
                success:false,
                msg:'Something is missing!'
            });
        }



        

    }catch(err){
        console.log(err);
        res.status(400).json({
            success:false,
            message:"Error in up-dating data",

        })
    }
 }
module.exports ={
    assignEmployee,
    showVisitingList,
    updateClientByFieldEmp,
    todayLead,
    remark,
    empdetail,
    fetchLeads,
    updateclient,
    updateEmployee
    
}