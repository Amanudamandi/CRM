const { validationResult } = require("express-validator"); // get error response
const Client = require("../models/client");
const ErrorClient = require("../models/errorClient");
const FindEmpIdByDistrict = require("../helpers/common/findEmpIdByDistrict");
const State = require("../models/state");
const xlsx = require("xlsx");
const axios = require("axios");
const AssignEmployee = require("../models/assignEmployee");
const Revisit = require("../models/revisit");
const insertStageActivity = require("../helpers/common/storeStageActivity");
const stageActivity = require("../models/stageActivity");
const startDateConvertor = require("../helpers/common/dateConversion/startDate");
const endDateConvertor = require("../helpers/common/dateConversion/endDate");
// const incrementDateFunction = require('../helpers/common/dateConversion/incrementDate');
const equalDateFunction = require("../helpers/common/dateConversion/equalDate");
const FollowUp = require("../models/followUp");
// const welcomeTemplate = require("../helpers/aiSensy/welcomeTemplate");
const Employee = require("../models/employee");
const TeamLeader = require("../models/teamLeader");
const findEmpIDAndTLID = require("../helpers/employee/findEmpIDAndTLID");
const CurrentDate = require("../helpers/common/dateConversion/currentDate");
const mongoose = require("mongoose");
const employee = require("../models/employee");
const Department = require("../models/department");
const Extradetails = require("../models/Extradetails");
const XLSX = require("xlsx");
const fs = require("fs");
const mailsender = require("../Mail/MailSender");
const sendwhatapp=require("../Whatapp/SendWhatapp")
const 
bulkmessage= require("../Whatapp/BulkMesage.js");
const client = require("../models/client");
const moment = require('moment-timezone');


const clientAdd = async (req, res) => {
  try {
    // console.log(req.body)
    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     // console.log(errors);
    //     return res.status(500).json({
    //     success:false,
    //     msg:'Errors',
    //     errors:errors.array()
    //     })
    // }
    const {
      name,
      email,
      empID,
      mobile,
      source,
      stageID,
      stateID,
     
   
      kwpInterested,
      remark,
      pincode
    } = req.body;

    //find TLID for store data
    console.log(empID);
    console.log(req.body);
    let empData;
    if (empID != null) {
      empData = await Employee.findById(empID).select("teamLeader").exec();
    }

     if (pincode && pincode.length >= 5) {
          
               zipCode=Number(pincode);
                try {
                    const zipCodeResponse = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
                    console.log(zipCodeResponse.data[0])
                    
                    if (zipCodeResponse.data && zipCodeResponse.data.length > 0 && zipCodeResponse.data[0].Status === "Success") {
                        const postOffice = zipCodeResponse.data[0].PostOffice[0];
                       console.log(postOffice);
                      
                        if (postOffice) {
                          var  district = postOffice.District;
                          var  city = postOffice.District;
                        }
                    }
                } catch (error) {
                    console.error("Error fetching zip code data:", error.message);
                }
            }
  
    const addClient = new Client({
      name,
      email,
      empID,
      mobile,
      source,
      stageID,
      stateID,
      district,
      city,
      kwpInterested,
      remark,
      CurrentDate: Date.now(),
      TLID: empData?.teamLeader,
    });

    const newClient = await addClient.save();
    console.log(newClient,"new one");
    if (newClient && newClient._id) {
      const newClientID = newClient._id.toString();
      const stageUpdateDate = new Date();
      // console.log(newClientID, empID, stageUpdateDate);
      await insertStageActivity(newClientID, empID, stageID, stageUpdateDate);
    }
    // await welcomeTemplate(mobile);
    if (newClient) {
      return res.status(200).json({
        success: true,
        msg: "Client Added Successfully.",
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: "Something is Missing",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

// const fetchClients = async(req,res) =>{
//     try {

//         const id = req.id;
//         const {TLID, name, empID, district, state, email, mobile, source, stage, page, limit, date, startDate, endDate, type, kwpInterested, employeeName, teamLeaderName}= req.query;
//         console.log("QUERY",req.query)
//         const stateName = await State.find({state: {$regex : `^${state}`, $options:'i'}}).select("_id");
//         const stateList = stateName.map(state => state._id);
//         const filters ={};
//         if(empID) filters.empID = new mongoose.Types.ObjectId(empID);
//         if(id) filters._id = new mongoose.Types.ObjectId(id);
//         if (TLID) filters.TLID = new mongoose.Types.ObjectId(TLID);
//         if(employeeName === "N/A" || employeeName === "n/a") filters.empID = null; // for find not assign clients
//         // find employee id according to employee name and apply filter
//         if(employeeName && employeeName != 'undefined' && employeeName != "N/A" && employeeName != "n/a"){
//             const empData = await Employee.find({name : { $regex: `^${employeeName}`, $options: 'i' }}).select("_id");
//             const empIDs = empData.map(item => item._id);
//             console.log(empIDs)
//             filters.empID = { $in : empIDs};
//         }
//         if(teamLeaderName && teamLeaderName != 'undefined'){

//             const teamLeaderData = await TeamLeader.find({name : { $regex: `^${teamLeaderName}`, $options: 'i' }}).select("_id");
//             const TLIDs = teamLeaderData.map(item =>item._id);
//             filters.TLID = {$in : TLIDs};
//         }
//         if (name) filters.name = { $regex: `^${name}`, $options: 'i' }; // Case-insensitive search
//         if (district) filters.district = { $regex: district, $options: 'i' };
//         if (state){
//             filters.stateID = {$in: stateList}
//         };
//         if (email) filters.email = { $regex: email, $options: 'i' };
//         if (mobile) filters.mobile = mobile;
//         if (source) filters.source = { $regex: source, $options : 'i' };
//         // if (stage) filters.stageID = stage;  // OLD
//         if(stage){
//             filters.stageID = new mongoose.Types.ObjectId(stage);
//         }
//         if (date) {
//             filters.CurrentDate = {
//                 $gte: await startDateConvertor(date),
//                 $lte: await endDateConvertor(date)    // Less than or equal to end of the day
//             };
//         }
//         if (startDate && endDate) {
//             filters.CurrentDate = {
//                 $gte: await startDateConvertor(startDate),
//                 $lte: await endDateConvertor(endDate)
//             };
//         }
//         // console.log(type)
//         const typeValue = type?.toLowerCase();
//         let typeIndex = 1;
//         if(typeValue == 'cold') typeIndex = 3;
//         if(typeValue == 'warm') typeIndex = 2;
//         if(typeValue) filters.type = typeIndex;
//         if(kwpInterested) filters.kwpInterested = {$regex : kwpInterested, $options : 'i'};

//         /* new update for unique clients */
//         const pages = parseInt(page);
//         const limits = parseInt(limit);
//         const skip = (pages - 1) * limits;
//         const skipValue = (typeof skip === 'number' && !isNaN(skip)) ? skip : 0;
//         const limitValue = (typeof limits === 'number' && !isNaN(limits)) ? limits : undefined; // Default to undefined if limits is invalid
//         const uniqueClients = await Client.aggregate([
//             { $match: filters}, // Apply filter criteria
//             {
//                 $group: {
//                     _id: "$mobile", // Group by mobile
//                     client: { $first: "$$ROOT" } // Get the first client document per mobile
//                 }
//             },
//             {$replaceRoot: { newRoot: "$client" } },// Replace the root with the client document itself
//             // populate empID
//             {
//                 $lookup:{
//                     from:"employees",
//                     localField:"empID",
//                     foreignField: "_id",
//                     as:"empID"
//                 }
//             },
//             { $unwind: { path: "$empID", preserveNullAndEmptyArrays: true } },
//             // Populate TLID
//             {
//                 $lookup: {
//                     from: "teamleaders", // Collection name for TeamLeader
//                     localField: "TLID",
//                     foreignField: "_id",
//                     as: "TLID"
//                 }
//             },
//             { $unwind: { path: "$TLID", preserveNullAndEmptyArrays: true } },// Unwind TLID array to a single object
//             // Populate stateID
//             {
//                 $lookup: {
//                     from: "states", // Collection name for State
//                     localField: "stateID",
//                     foreignField: "_id",
//                     as: "stateID"
//                 }
//             },
//             { $unwind: { path: "$stateID", preserveNullAndEmptyArrays: true } },
//             {
//                 $lookup:{
//                     from:"stages",
//                     localField:"stageID",
//                     foreignField: "_id",
//                     as: "stageID"
//                 }
//             },
//             { $unwind: { path: "$stageID", preserveNullAndEmptyArrays: true } },
//             {
//                 $project: {
//                     _id:1,
//                     name: 1,
//                     email: 1,
//                     assignEmp:1,
//                     mobile: 1,
//                     source: 1,
//                     stageID: 1,
//                     district: 1,
//                     city: 1,
//                     zipCode: 1,
//                     kwpInterested: 1,
//                     type: 1,
//                     CurrentDate: 1,
//                     "empID.name":1,
//                     "empID._id":1,
//                     "TLID.name": 1, // Include only the name field of TLID
//                     "TLID._id" :1,
//                     "stateID.state":1,
//                 }
//             },
//             { $sort: { CurrentDate: -1 } },
//             { $skip: skipValue },       // Skip documents for pagination
//             ...(limitValue !== undefined ? [{ $limit: limitValue }] : [])
//         ]);

//         const updatedClients =await Promise.all(uniqueClients.map(async(client) =>{
//             const clientID =await client._id.toString();
//             // For finding name of assign Employee and visiting Date
//             const assignEmpData = await AssignEmployee.findOne({clientID})
//                 .populate({
//                     path:'fieldEmpID',
//                     select:{'name':1,}
//                 })
//                 .lean();
//                 let name = null;

//                 let date = null;
//                 if(assignEmpData != null){
//                     name = assignEmpData?.fieldEmpID?.name;
//                     date = assignEmpData.visitingDate;
//                 }
//                 //For find Revisit date
//                 const revisitData = await Revisit.findOne({clientID}).select("revisitDate");
//                 const revisitDate =(revisitData)? revisitData.revisitDate : null;
//                 // For find all stage according to client and update Date
//                 const stageActivityData = await stageActivity.find({clientID})
//                 .populate({
//                     path:"stageID",
//                 })
//                 const stageActivityList = (stageActivityData) ? stageActivityData : null;
//                 // show followUpDate
//                 const followData = await FollowUp.findOne({clientID}).select("followUpDate").sort("-createAt");
//                 // console.log(followData)
//                 return {
//                     ...client,
//                     assignEmp: name,
//                     visitingDate: date,
//                     revisitDate:(revisitDate),
//                     stageActivity:stageActivityList,
//                     followUpDate : followData?.followUpDate
//                 }
//         }));
//         // console.log(updatedClients.length)
//         return res.status(200).json({
//             success:true,
//             clients:(updatedClients) ? updatedClients : 'No data found' ,
//             nextPage: (updatedClients.length >= limit) ? +page + 1 : null,
//         })
//     } catch (error) {
//         console.log(error)
//         return res.status(400).json({
//             success:false,
//             msg:error.message
//         });
//     }
// }

const fetchClients = async (req, res) => {
  try {
    const id = req.id;
    const {
      TLID,
      name,
      empID,
      district,
      state,
      email,
      mobile,
      source,
      stage,
      page,
      limit,
      date,
      startDate,
      endDate,
      type,
      kwpInterested,
      employeeName,
      teamLeaderName,
    } = req.query;
    console.log(page);
    console.log(limit);
    console.log("QUERY", req.query);
    const stateName = await State.find({
      state: { $regex: `^${state}`, $options: "i" },
    }).select("_id");

    const stateList = stateName.map((state) => state._id);
    const filters = {};
    if (empID) filters.empID = new mongoose.Types.ObjectId(empID);
    if (id) filters._id = new mongoose.Types.ObjectId(id);
    if (TLID) filters.TLID = new mongoose.Types.ObjectId(TLID);

    if (employeeName === "N/A" || employeeName === "n/a") filters.empID = null; // for find not assign clients
    // find employee id according to employee name and apply filter
    if (
      employeeName &&
      employeeName != "undefined" &&
      employeeName != "N/A" &&
      employeeName != "n/a"
    ) {
      const empData = await Employee.find({
        name: { $regex: `^${employeeName}`, $options: "i" },
      }).select("_id");
      const empIDs = empData.map((item) => item._id);
      console.log(empIDs);
      filters.empID = { $in: empIDs };
    }
    if (teamLeaderName && teamLeaderName != "undefined") {
      const teamLeaderData = await TeamLeader.find({
        name: { $regex: `^${teamLeaderName}`, $options: "i" },
      }).select("_id");
      const TLIDs = teamLeaderData.map((item) => item._id);
      filters.TLID = { $in: TLIDs };
    }
    if (name) filters.name = { $regex: `^${name}`, $options: "i" }; // Case-insensitive search
    if (district) filters.district = { $regex: district, $options: "i" };
    if (state) {
      filters.stateID = { $in: stateList };
    }
    if (email) filters.email = { $regex: email, $options: "i" };
    if (mobile) filters.mobile = mobile;
    if (source) filters.source = { $regex: source, $options: "i" };
    // if (stage) filters.stageID = stage;  // OLD
    if (stage) {
      filters.stageID = new mongoose.Types.ObjectId(stage);
    }
    if (date) {
      filters.CurrentDate = {
        $gte: await startDateConvertor(date),
        $lte: await endDateConvertor(date), // Less than or equal to end of the day
      };
    }
    if (startDate && endDate) {
      filters.CurrentDate = {
        $gte: await startDateConvertor(startDate),
        $lte: await endDateConvertor(endDate),
      };
    }
    // console.log(type)
    const typeValue = type?.toLowerCase();
    let typeIndex = 1;
    if (typeValue == "cold") typeIndex = 3;
    if (typeValue == "warm") typeIndex = 2;
    if (typeValue) filters.type = typeIndex;
    if (kwpInterested)
      filters.kwpInterested = { $regex: kwpInterested, $options: "i" };

    /* new update for unique clients */
    const pages = parseInt(page);
    const limits = parseInt(limit);
    const skip = (pages - 1) * limits;
    const skipValue = typeof skip === "number" && !isNaN(skip) ? skip : 0;
    const limitValue =
      typeof limits === "number" && !isNaN(limits) ? limits : undefined; // Default to undefined if limits is invalid
    console.log(filters, "app");
    const uniqueClients = await Client.aggregate([
      { $match: filters }, // Apply filter criteria
      {
        $group: {
          _id: "$mobile", // Group by mobile
          client: { $first: "$$ROOT" }, // Get the first client document per mobile
        },
      },
      { $replaceRoot: { newRoot: "$client" } }, // Replace the root with the client document itself
      // populate empID
      {
        $lookup: {
          from: "employees",
          localField: "empID",
          foreignField: "_id",
          as: "empID",
        },
      },
      { $unwind: { path: "$empID", preserveNullAndEmptyArrays: true } },
      // Populate TLID
      {
        $lookup: {
          from: "teamleaders", // Collection name for TeamLeader
          localField: "TLID",
          foreignField: "_id",
          as: "TLID",
        },
      },
      { $unwind: { path: "$TLID", preserveNullAndEmptyArrays: true } }, // Unwind TLID array to a single object
      // Populate stateID
      {
        $lookup: {
          from: "states", // Collection name for State
          localField: "stateID",
          foreignField: "_id",
          as: "stateID",
        },
      },
      { $unwind: { path: "$stateID", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "stages",
          localField: "stageID",
          foreignField: "_id",
          as: "stageID",
        },
      },
      { $unwind: { path: "$stageID", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "extradetails", // Collection name for Extra details
          localField: "AdditionalDetails",
          foreignField: "_id",
          as: "AdditonalDetailsID",
        },
      },
      {
        $unwind: {
          path: "$AdditonalDetailsID",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          assignEmp: 1,
          mobile: 1,
          messageStatus:1,
          source: 1,
          stageID: 1,
          district: 1,
          city: 1,
          zipCode: 1,
          kwpInterested: 1,
          type: 1,
          CurrentDate: 1,
          AdditonalDetailsID: 1,

          // "AdditonalDetailsID.AadharCard":1,
          "empID.name": 1,
          "empID._id": 1,
          "TLID.name": 1, // Include only the name field of TLID
          "TLID._id": 1,
          "stateID.state": 1,
          // "AdditonalDetials":1,
        },
      },
      { $sort: { CurrentDate: -1 } },
      { $skip: skipValue }, // Skip documents for pagination
      ...(limitValue !== undefined ? [{ $limit: limitValue }] : []),
    ]);

    const updatedClients = await Promise.all(
      uniqueClients.map(async (client) => {
        const clientID = await client._id.toString();
        // For finding name of assign Employee and visiting Date
        const assignEmpData = await AssignEmployee.findOne({ clientID })
          .populate({
            path: "fieldEmpID",
            select: { name: 1 },
          })
          .lean();
        let name = null;
        let date = null;
        if (assignEmpData != null) {
          name = assignEmpData?.fieldEmpID?.name;
          date = assignEmpData.visitingDate;
        }
        //For find Revisit date
        const revisitData = await Revisit.findOne({ clientID }).select(
          "revisitDate"
        );
        const revisitDate = revisitData ? revisitData.revisitDate : null;
        // For find all stage according to client and update Date
        const stageActivityData = await stageActivity
          .find({ clientID })
          .populate({
            path: "stageID",
          });
        const stageActivityList = stageActivityData ? stageActivityData : null;
        // show followUpDate
        const followData = await FollowUp.findOne({ clientID })
          .select("followUpDate")
          .sort("-createAt");
        // console.log(followData)
        return {
          ...client,
          assignEmp: name,
          visitingDate: date,
          revisitDate: revisitDate,
          stageActivity: stageActivityList,
          followUpDate: followData?.followUpDate,
        };
      })
    );

    // console.log(updatedClients.length)
    return res.status(200).json({
      success: true,
      clients: updatedClients ? updatedClients : "No data found",
      nextPage: updatedClients.length >= limit ? +page + 1 : null,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};
const bulkAssign = async(req,res) =>{
  try {
      const {clientsID, empID} = req.body;

      if (!clientsID || !empID) {
          return res.status(400).json({
            success: false,
            msg: "clientIDs and empID are required",
          });
        }

        // find employee ID and Team Leader id for update client
        const empData = await Employee.findOne({empID:{$regex : empID, $options:"i"} }).select("_id teamLeader");
      //   console.log(empData);
        const employeeID = empData._id.toString();
        const teamLeaderID = empData.teamLeader.toString();

        const updateData = {
          empID:employeeID,
          TLID:teamLeaderID
        }
        // Update empID for all clients in clientIDs array
        const updatedClients = await Client.updateMany(
          { _id: { $in: clientsID } }, // Filter clients by multiple IDs
          { $set: updateData }   // Set new empID for each client
        );

        // Check if any clients were updated
        if (updatedClients.nModified === 0) {
          return res.status(404).json({
            success: false,
            message: "No clients found to update",
          });
        }
        res.status(200).json({
          success: true,
          // message: `${updatedClients.nModified} clients were updated`,
          msg :"Successfully updated clients"
        });

  } catch (error) {
      return res.status(400).json({
          success:false,
          msg:error
      })
  }
}
const updateClient = async (req, res) => {
  try {
    console.log("hgff", req.query || req.body || req.params);
    let newVisit = null;
    const {
      kwpInterested,
      type,
      email,
      stageID,
      selectedFieldSales,
      visitingDate,
      followUpDate,
      remark,
      clientID,
      empID,
      address,
      location,
      state,
    } = req.body;
    console.log(visitingDate, "vsuisting date");
    console.log(address, "adrees");
    console.log(stageID,"stageid");
    const [latitude, longitude] = location.split(", ").map(Number);

    if (!req?.body?.clientID) {
      return res.status(400).json({
        success: false,
        msg: "client Id not Exist!",
      });
    }

    // const StateName="Delhi";
    const response = await State.find({ state: state });

    console.log(response, "state response");

    const ElectrcityBill = (await req.files["electricitybill"])
      ? `${process.env.SERVER_URL}/uploads/ElectricityBill/${req.files["electricitybill"][0].filename}`
      : null;
    console.log(ElectrcityBill);
    const ProposalPdf = (await req.files["proposalpdf"])
      ? `${process.env.SERVER_URL}/uploads/proposalpdf/${req.files["proposalpdf"][0].filename}`
      : null;
    const additionalsdetails = new Extradetails({
      ElectrcityBill,
      ProposalPdf,
    });
    additionalsdetails.save();

    if (followUpDate || visitingDate) {
      // check given date is not less the current date
      const queryData = new Date(followUpDate || visitingDate);
      const today = new Date();
      if (
        queryData.getDate() < today.getDate() &&
        queryData.getMonth() < today.getMonth() &&
        queryData.getYear() < today.getYear()
      ) {
        return res.status(400).json({
          success: false,
          msg: " Please give valid Date.",
        });
      }
    }
    if (followUpDate) {
      const newFollowUpDate = await equalDateFunction(followUpDate);
      console.log(newFollowUpDate);
      await FollowUp.findOneAndUpdate(
        { clientID: clientID },
        { $set: { followUpDate: newFollowUpDate } },
        { new: true, upsert: true, runValidators: true }
      );
    }
    // console.log("RB",req.body);
    // if(visitingDate && assignEmp == ''){
    //     return res.status(400).json({
    //         success:false,
    //         msg:"Visiting date not save without assign employee."
    //     })
    // }
    if (visitingDate) {
      console.log("missin Success");
      const newVisitingDate = await equalDateFunction(visitingDate);
      console.log(newVisitingDate, "DEFEFE");
      const visit = new AssignEmployee({
        clientID,
        fieldEmpID: selectedFieldSales,
        visitingDate: newVisitingDate,
      });
      newVisit = await visit.save();
      console.log(newVisit);
    }
    console.log(stageID,"stageID");
   console.log(response[0]._id);
    const UpdatedData = {
      stateID: response[0]._id,
      kwpInterested: kwpInterested,
      type: type,
      email: email,
      stageID: stageID,
      AdditionalDetails: additionalsdetails._id,
      address: address,
      latitude: latitude ? latitude : null,
      longitude: longitude ? longitude : null,
      status: "Visit Pending",
    };

    const updateClient = await Client.findByIdAndUpdate(clientID, UpdatedData, {
      new: true,
      runValidators: true,
    }).populate("AdditionalDetails");
    if (!updateClient) {
      return res.status(404).json({
        success: false,
        msg: "Something is Wrong please try again !",
      });
    }

    if (stageID) {
      const stageUpdateDate = new Date();
      await insertStageActivity(
        clientID,
        empID,
        stageID,
        stageUpdateDate,
        remark
      );
    }
    console.log(updateClient.mobile);
    console.log(`+91${updateClient?.mobile}`)
    if (ProposalPdf) {
      const emailBody = `<p>Hello,</p><p>Your proposal document is attached.</p>`;
      
    
      await mailsender(email, "Proposal Document", emailBody, ProposalPdf);
      console.log(ProposalPdf);
     await   sendwhatapp( `+91${updateClient?.mobile}`,
              'crm_3',
              { link: 'https://pdfobject.com/pdf/sample.pdf', filename: 'Galo Solar' },
              ['Galo Energy Pvt. Ltd.', 'Best solar energy goods'])


             await   bulkmessage( `+91${updateClient?.mobile}`,
                      "crm_4",
                      "https://www.galosolar.com/galo.png",
                      ["Galo Energy Pvt. Ltd.", "API is Working", "+91 8287701077"])
   
    }

    
 

    return res.status(200).json({
      success: true,
      msg: "Update SuccessFully .",
      data: updateClient,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const fetchByFile = async (req, res) => {
  let uploadedFreshClient = 0;
  let notUploadedClient = 0;
  let totalClient = 0;
  let clientData;
  let stageResult = 0;
  let wlcSuccessMsg = 0;
  let wlcUnsuccessMsg = 0;
  let empID = null;
  let teamLeaderID = null;
  let state = null;
  let StateID = null;
  let district = null;
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const excelData = xlsx.utils.sheet_to_json(worksheet); // it is converted data excel->json
    let ClientArray = [];
    for (const row of excelData) {
      district = row["city"];
      ++totalClient; // count total leads
      let zipCode = row["zip_code"];
      state = row["state"];
      if (
        zipCode != undefined &&
        zipCode.length >= 5 &&
        typeof zipCode != "string"
      ) {
        const zipCodeResponse = await axios.get(
          `https://api.postalpincode.in/pincode/${zipCode}`
        ); // these api is help to get area location by zip code
        if (zipCodeResponse.data[0].Status === "Success") {
          const postOffice = zipCodeResponse.data[0].PostOffice[0];
          district = postOffice.District;
          state = postOffice.State;
        }
      }
      if (state) {
        const responseStateID = await State.findOne({ state }, "_id");
        StateID = responseStateID?._id.toString();
      }
      const excelEmpID = row["employeeID"];
      if (excelEmpID) {
        const employeeResponseData = await findEmpIDAndTLID(excelEmpID);
        empID = employeeResponseData.empID;
        teamLeaderID = employeeResponseData.TLID;
      } else {
        const responseData = await FindEmpIdByDistrict(district, state);
        empID = responseData.empID;
        teamLeaderID = responseData.teamLeaderID;
      }
      const currentDate = await CurrentDate();
      if (typeof zipCode === "string") zipCode = 0;
      clientData = {
        name: row["full_name"],
        mobile: row["mobile"],
        source: row["platform"],
        stateID: StateID,
        district: district,
        city: row["city"],
        zipCode,
        empID: empID,
        TLID: teamLeaderID,
        CurrentDate: currentDate,
      };
      // ExcelData.push(clientData);
      try {
        const newClient = await Client.create(clientData);
        if (newClient && newClient._id) {
          const newClientID = newClient._id.toString();
          const stageUpdateDate = new Date();
          const stageID = "66e15ed1774c6b5fb4ab626b";
          const stageResponse = await insertStageActivity(
            newClientID,
            empID,
            stageID,
            stageUpdateDate
          );
          if (stageResponse) stageResult++;
        }
        uploadedFreshClient++;
        // const whatsAppResponse = await welcomeTemplate(clientData.mobile);
        // (whatsAppResponse) ? ++wlcSuccessMsg : --wlcUnsuccessMsg;
      } catch (error) {
        const newClientData = { ...clientData, errors: error.message };
        const errorClient = await ErrorClient.create(newClientData);
        notUploadedClient++;
        if (!errorClient) {
          ClientArray.push(clientData);
        }
      }
    }
    return res.status(200).json({
      success: true,
      msg: "Successfully added client in server",
      stage: stageResult,
      totalClient: totalClient,
      uploadedClient: uploadedFreshClient,
      notUploadClient: notUploadedClient,
      // welcomeSuccessMsg:wlcSuccessMsg,
      // welcomeUnsuccessfullyMsg: wlcUnsuccessMsg,
      // list:ExcelData
    });
  } catch (error) {
    const newClientData = { ...clientData, errors: error.message };
    const errorClient = await ErrorClient.create(newClientData);
    notUploadedClient++;
    if (!errorClient) {
      ClientArray.push(clientData);
    }
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const fetchAssignEmployee = async (req, res) => {
  try {
    const clientID = req.query.clientID;
    if (!clientID) {
      return res.status(400).json({
        success: false,
        msg: "client Id not Exist!",
      });
    }
    const assignData = await AssignEmployee.findOne({ clientID })
      .populate({
        path: "fieldEmpID",
        select: {
          name: 1,
        },
      })
      .select({
        name: 1,
        visitingDate: 1,
      });
    return res.status(200).json({
      success: true,
      data: assignData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};
             

// const Fetchemployee=async(req,res)=>{
//     try{
//         // const{Statename}=req.body;
//         // if(!Statename){
//         //     res.status(400).json({
//         //         success:false,
//         //         message:"please enter a valid state"
//         //     })

//         // }
//         const arr=[];
//         const user = await Employee.find({empID:'CL001'})
//         .populate("department")
//         .populate("teamLeader")
//         .populate("stateID");
//         console.log(user);
//         console.log(user.stateID)

//     //   console.log(user?.stateID);
//     //     console.log(user);
//         res.status(200).json({
//             message:"succesfulyy fetched",

//         })

//     }catch(error){
//    console.log(error);
//    res.status(400).json({
//     status:false,
//     message:"Error in assign employee",

//    })
//     }
// }

const Assignfieldemployee = async (req, res) => {
  try {
    const { Statename } = req.body;
    if (!Statename) {
      res.status(400).json({
        message: "State not found",
        status: false,
      });
    }

    const response = await employee.aggregate([
      // populate the states
      {
        $lookup: {
          from: "states", // Collection name for State
          localField: "stateID",
          foreignField: "_id",
          as: "statedetails",
        },
      },
      {
        $unwind: "$statedetails",
      },
      {
        $match: {
          "statedetails.state": Statename,
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "department",
          foreignField: "_id",
          as: "depratmentdetails",
        },
      },

      { $unwind: "$depratmentdetails" }, // Unwind department details

      // Match only employees from "Field Sales" department
      {
        $match: {
          "depratmentdetails.department": "Field Sales",
        },
      },
    ]);

    res.status(200).json({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "error",
    });
  }
};

const updatestatus=async(req,res)=>{
  try{
      const{status,clientId,VisitingDate}=req.body;
      console.log(status);
      console.log(clientId)
      console.log(VisitingDate)
      
  

      if(VisitingDate){
         const newVisitingDate = await equalDateFunction(VisitingDate);
         console.log(newVisitingDate);
         const response = await AssignEmployee.findOneAndUpdate(
             { clientID: clientId },  // Search by clientID
             { $set: { visitingDate: newVisitingDate } },
             { new: true }  // Return updated document
         );
         console.log(response);
         if(!response){
             res.status(400).json({
                 message:"failed to update dqata"
             })
         }

      }
      const data= await Client.findById({_id:clientId});
      console.log(data);
      const response1 = await  Client.findByIdAndUpdate(
          { _id: clientId },
          { $set: { status: status } },
          { new: true } // This option returns the updated document
        );
        console.log(response1);
        if(!response1){
         res.status(400).json({
             message:"failed to update dqata"
         })
     }

        res.status(200).json({
          data:response1,
          message:"Succesfullly updated"
        })
        

  }catch(error){
      console.log(error);
      res.status(400).json({
          message:"Cannot update status"
      })
  }
}

//Removing Lead from the client model
const removeClientsFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read Excel file from buffer
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]); // Convert to JSON

    if (sheetData.length === 0) {
      return res.status(400).json({ message: "Excel file is empty" });
    }

    let deleteCount = 0;

    for (const row of sheetData) {
      const { name, CurrentDate } = row; // Directly using date from Excel

      if (!name || !CurrentDate) {
        console.log("Skipping row due to missing data:", row);
        continue;
      }

      // Delete clients matching name & date as stored in MongoDB
      const result = await Client.deleteMany({ name, CurrentDate });
      deleteCount += result.deletedCount;
    }

    return res.json({
      message: `Deleted ${deleteCount} clients successfully.`,
    });
  } catch (error) {
    console.error("Error deleting clients:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
const stopMessage=async(req,res)=>{
  try{

    const { clientID } = req.body;

    const response= await Client.find({_id:clientID});

    const data=await Client.updateOne({ _id: clientID }, { messageStatus: false ,reminderDays:0},{new:true});
  
    res.json({ message: "Messages stopped for this client" ,data:response});  }catch(error){

      console.log(error);
      res.status(400).json({
        message:"Cron not stop "
      })
    }

}
const deleteassignemployee=async(req,res)=>{
  try{
    const id="67bc0a92b18888057188ecbe"
    console.log(req.body);
    const deletedData = await AssignEmployee.deleteMany({ fieldEmpID: id });

    if (deletedData.deletedCount === 0) {
        return res.status(404).json({ message: "No employees found", success: false });
    }
    
    res.status(200).json({ 
        message: "Deleted successfully", 
        success: true, 
        deletedCount: deletedData.deletedCount 
    });
    

    return res.status(200).json({
message:"deleted",
status:true,
    })

  }catch(error){
    console.log(error);

  }
}

// const SchduleMessage=async(req,res)=>{
//   try {
//     const { clientId, message, WhatappImage, WhatappPdf, reminderDays } = req.body;
//     console.log(req.body);
//     let reminderDate = new Date();
    
//     // Convert to IST (India Standard Time)
//     reminderDate = new Date(reminderDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    
//     // Ensure `reminderDays` is defined before using it
//     reminderDate.setDate(reminderDate.getDate() + reminderDays); 
    
//     console.log("Updated Reminder Date (IST):", reminderDate);
    
  
//     // Update client with new reminder date
//    const messagee= await Client.findOneAndUpdate(
//       { _id: clientId },
//       {
//         Message: message,
//         WhatappImage,
//         WhatappPdf,
//         reminderDate,
//         reminderDays,
//         messageStatus: true, // Enable scheduling
//       },
//       { new: true }
//     );
//     if(!messagee){
//       res.status(401).json({
//         message:"error"
//       })
//     }

//     res.status(200).json({ message: "Message reminders scheduled successfully",data:messagee });
// } catch (error) {
//     console.error("Error scheduling message:", error);
//     res.status(500).json({ error: "Server error" });
// }


// }
const SchduleMessage = async (req, res) => {
  try {
    const { clientId, message,  reminderDays ,companymobile} = req.body;
    console.log(req.body,"req.body is here");


    
    const Whatapp = (await req.files["Whatapp"])
      ? `${process.env.SERVER_URL}uploads/whatapp/${req.files["Whatapp"][0].filename}`
      : null;
      console.log(Whatapp,"whatapp");
    
    // let reminderDate = new Date();
    // console.log(reminderDate,"dartatete")
    
    // // Convert to IST (India Standard Time)
    // reminderDate = new Date(reminderDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    // console.log(reminderDate,"indian format");
    // // Ensure `reminderDays` is defined before using it
    // reminderDate.setDate(reminderDate.getDate() + (reminderDays || 0)); // Avoid NaN error
    
    // console.log("Updated Reminder Date (IST):", reminderDate);
    let reminderDate = moment().tz("Asia/Kolkata").toDate();
    console.log("Original Reminder Date (IST):", reminderDate);
    
    // Ensure `reminderDays` is defined before using it
    const daysToAdd = reminderDays || 0; // Default to 0 if undefined
    
    // ✅ Correct way to add days
    reminderDate = new Date(reminderDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    
    console.log("Updated Reminder Date (IST):", reminderDate);

    // Update client with new reminder date
    const messagee = await Client.findOneAndUpdate(
      { _id: clientId },
      {
        Message: message,
        WhatappImage:Whatapp,
        companymobile:companymobile,
      
        reminderDate:reminderDate,
        reminderDays:reminderDays,
        messageStatus: true, // Enable scheduling
      },
      { new: true }
    );

    console.log(messagee,"mesagae");

    if (!messagee) {
      return res.status(401).json({ message: "Error: Client not found" }); // ✅ RETURN here
    }

    return res.status(200).json({
      message: "Message reminders scheduled successfully",
      data: messagee,
    });

  } catch (error) {
    console.error("Error scheduling message:", error);

    if (!res.headersSent) { // ✅ Ensure response is only sent once
      return res.status(500).json({ error: "Server error" });
    }
  }
};

const greatingWhatapp=async(req,res)=>{
  try{
    const {clientId,message,companymobile}=req.body;
    console.log(req.body);

    const client= await Client.find({_id:clientId});
    console.log(client);
    const Whatapp = (await req.files["Whatapp"])
    ? `${process.env.SERVER_URL}/uploads/whatapp/${req.files["Whatapp"][0].filename}`
    : null;
    console.log(Whatapp,"whatapp");
   
 
    console.log(client[0]?.mobile,"mobile");

    const mobileNumber = client[0].mobile.replace(/^\+91/, "");
    console.log(mobileNumber)

    const status=await bulkmessage(
      `+91${mobileNumber}`,
      "crm_4",
      Whatapp,
      ["Galo Energy Pvt. Ltd.", `${message}`, companymobile]
  );
  console.log(status);
  res.status(200).json({
    MESSAGE:"SUCCESSFULLY DONE",
    status:true,
    data:client,
  })

  }catch(error){
    console.log(error);
    res.status(400).json({
     message:"Fialed to send whatapp",
     status:false,
    })
  }
}

const bulkwhatapp = async (req, res) => {
  try {
    let successcount = 0;
    let unsuccesscount = 0;
    let deliveredClients = [];
    let undeliveredClients = [];

    let { clientId, message, companymobile } = req.body; // clientId is an array
    console.log(req.body);

   

    if (!Array.isArray(clientId) || clientId.length === 0) {
      return res.status(400).json({
        message: "clientId must be a non-empty array",
        status: false,
      });
    }

    const clients = await Client.find({ _id: { $in: clientId } }); // Fetch multiple clients
    console.log(clients);

    const Whatapp = req.files?.["Whatapp"]
      ? `${process.env.SERVER_URL}uploads/whatapp/${req.files["Whatapp"][0].filename}`
      : null;
    console.log(Whatapp, "WhatsApp Image");

    // Loop through each client and send WhatsApp message
    for (const client of clients) {
      if (!client?.mobile){
        unsuccesscount++
        continue;
      } // Skip if no mobile number

    

      const mobileNumber = client.mobile.replace(/^\+91/, "");
      console.log(`Sending message to: +91${mobileNumber}`);
      if (!/^[6789]\d{9}$/.test(mobileNumber)) {
     
        unsuccesscount++;
        undeliveredClients.push(client._id);
        continue; // Skip this client
      }

      try {
        const status = await bulkmessage(
          `+91${mobileNumber}`,
          "crm_4",
          Whatapp,
          ["Galo Energy Pvt. Ltd.", `${message}`, companymobile]
        );

        console.log(`Status for ${mobileNumber}:`, status);

        // Assuming `status` is an object with a `success` key (Modify as per your API response)
        if (status?.success) {
          successcount++;
          deliveredClients.push(client._id);
        } else {
          unsuccesscount++;
          undeliveredClients.push(client._id);
        }
      } catch (err) {
        console.log(`Failed to send message to ${mobileNumber}:`, err);
        unsuccesscount++;
        undeliveredClients.push(client._id);
      }
    }

    res.status(200).json({
      MESSAGE: "WhatsApp messages processed",
      status: true,
      successcount,
      unsuccesscount,
      deliveredClients,
      undeliveredClients,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to send WhatsApp messages",
      status: false,
    });
  }
};


  const  quotation=async(req,res)=>{
  try{
    const{state,Kw,clientId,message}=req.body;
    console.log(Kw);
    console.log(req.body);
    console.log("Kw Type:", typeof Kw);

    const client= await Client.find({_id:clientId});
    console.log(client)
  
    const mobileNumber = client[0].mobile.replace(/^\+91/, "");
    console.log(mobileNumber);

    if(state==='Uttar Pradesh'){
     
      const pdfMapping = {
       
        "2kw": `${process.env.SERVER_URL}uploads/quotation/UttarPradesh/2kw/dummy.pdf`,
        "3kw-1phase": `${process.env.SERVER_URL}uploads/quotation/UttarPradesh/3kw-phase-1/dummy.pdf`,
        "3kw-3phase": `${process.env.SERVER_URL}uploads/quotation/UttarPradesh/3kw-phase-3/dummy.pdf`,
        "4kw-1phase": `${process.env.SERVER_URL}uploads/quotation/UttarPradesh/4kw-phase-1/dummy.pdf`,
        "4kw-3phase": `${process.env.SERVER_URL}uploads/quotation/UttarPradesh/4kw-phase-3/dummy.pdf`,
        "5kw-1phase": `${process.env.SERVER_URL}uploads/quotation/UttarPradesh/5kw-phase-1/dummy.pdf`,
        "5kw-3phase": `${process.env.SERVER_URL}uploads/quotation/UttarPradesh/5kw-phase-3/dummy.pdf`,
        "6kw": `${process.env.SERVER_URL}uploads/quotation/UttarPradesh/6kw/dummy.pdf`,
        "7kw": `${process.env.SERVER_URL}uploads/quotation/UttarPradesh/7kw/dummy.pdf`,
        "8kw": `${process.env.SERVER_URL}uploads/quotation/UttarPradesh/8kw/dummy.pdf`,
        "9kw": `${process.env.SERVER_URL}uploads/quotation/UttarPradesh/9kw/dummy.pdf`,
        "10kw": `${process.env.SERVER_URL}uploads/quotation/UttarPradesh/10kw/dummy.pdf`,
      
      };
      console.log(pdfMapping["2kw"]);
      
   
   
      // const key = `${String(Kw)}kw`;
   
 
      pdfFilePath = pdfMapping[Kw];
      console.log(pdfFilePath)
    
      if (!pdfFilePath) {
        return res.status(400).json({
          message: "Invalid Kw value",
          status: false,
        });
      }
      sendwhatapp( `+91${mobileNumber}`,
        'crm_3',
        { link: pdfFilePath, filename: "GautamSolar.pdf" },
        ["Galo Energy Pvt. Ltd.", message]);
    } 
    // else if(state==='Delhi'){
    //   const pdfMapping = {
       
    //     "2kw": `${process.env.SERVER_URL}/uploads/quotation/Delhi/2kw/Delhi.pdf`,
    //     "3kw": `${process.env.SERVER_URL}/uploads/quotation/Delhi/2kw/Delhi.pdf`,
    //     "4kw": `${process.env.SERVER_URL}/uploads/quotation/Delhi/2kw/Delhi.pdf`,
    //     "5kw": `${process.env.SERVER_URL}/uploads/quotation/Delhi/2kw/Delhi.pdf`,
    //     "6kw": `${process.env.SERVER_URL}/uploads/quotation/Delhi/2kw/Delhi.pdf`,
    //     "7kw": `${process.env.SERVER_URL}/uploads/quotation/Delhi/2kw/Delhi.pdf`,
    //     "8kw": `${process.env.SERVER_URL}/uploads/quotation/Delhi/2kw/Delhi.pdf`,
    //     "9kw": `${process.env.SERVER_URL}/uploads/quotation/Delhi/2kw/Delhi.pdf`,
    //     "10kw": `${process.env.SERVER_URL}/uploads/quotation/Delhi/2kw/Delhi.pdf`,
      
    //   };;
    //   pdfFilePath = pdfMapping[`${Kw}kw`];
    //   if (!pdfFilePath) {
    //     return res.status(400).json({
    //       message: "Invalid Kw value",
    //       status: false,
    //     });
    //   }
    //   sendwhatapp( `+91${mobileNumber}`,
    //     'crm_3',
    //     { link: pdfFilePath, filename: "Quotation.pdf" },
    //     ["Galo Energy Pvt. Ltd.", "Your quotation is attached."])
    // }
    
    else{
      const pdfMapping = {
       
        "2kw": `${process.env.SERVER_URL}/uploads/quotation/Others/2kw/dummy.pdf`,
        "3kw-1phase": `${process.env.SERVER_URL}/uploads/quotation/Others/3kw-phase-1/dummy.pdf`,
        "3kw-3phase": `${process.env.SERVER_URL}/uploads/quotation/Others/3kw-phase-3/dummy.pdf`,
        "4kw-1phase": `${process.env.SERVER_URL}/uploads/quotation/Others/4kw-phase-1/dummy.pdf`,
        "4kw-3phase": `${process.env.SERVER_URL}/uploads/quotation/Others/4kw-phase-3/dummy.pdf`,
        "5kw-1phase": `${process.env.SERVER_URL}/uploads/quotation/Others/5kw-phase-1/dummy.pdf`,
        "5kw-3phase": `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`,
        "6kw": `${process.env.SERVER_URL}/uploads/quotation/Others/6kw/dummy.pdf`,
        "7kw": `${process.env.SERVER_URL}/uploads/quotation/Others/7kw/dummy.pdf`,
        "8kw": `${process.env.SERVER_URL}/uploads/quotation/Others/8kw/dummy.pdf`,
        "9kw": `${process.env.SERVER_URL}/uploads/quotation/Others/9kw/dummy.pdf`,
        "10kw": `${process.env.SERVER_URL}/uploads/quotation/Others/10kw/dummy.pdf`
      };
      pdfFilePath = pdfMapping[Kw];
      if (!pdfFilePath) {
        return res.status(400).json({
          message: "Invalid Kw value",
          status: false,
        });
      }
      sendwhatapp( `+91${mobileNumber}`,
        'crm_3',
        { link: pdfFilePath, filename: "Quotation.pdf" },
        ["Galo Energy Pvt. Ltd.", message])
    }


    res.status(200).json({
      MESSAGE: "Successfully sent WhatsApp pdf messages",
      status: true,
     
    });

  }catch(error){
    console.log(error);
    res.status(400).json({
      message: "Failed to send Pdf ",
      status: false,
    });
  }
}



module.exports = {
  clientAdd,
  fetchClients,
  updateClient,
  fetchByFile,
  fetchAssignEmployee,
  bulkAssign,
  Assignfieldemployee,
  updatestatus,
  removeClientsFromExcel,
  deleteassignemployee,
  SchduleMessage,
  stopMessage,
  greatingWhatapp,
  bulkwhatapp,
  quotation,
};
