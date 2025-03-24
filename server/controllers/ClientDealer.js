const Dlemployee= require("../models/Dealer Models/DealerEmployee");
const DLclient= require("../models/Dealer Models/DealerClient");
const TLdealer= require("../models/Dealer Models/DealerTL")
const insertStageActivity= require("../helpers/common/storeStageActivity")
const axios = require("axios");
const State= require("../models/state");
const mongoose= require('mongoose');

// const incrementDateFunction = require('../helpers/common/dateConversion/incrementDate');
const equalDateFunction = require('../helpers/common/dateConversion/equalDate');


const startDateConvertor= require("../helpers/common/dateConversion/startDate");
const endDateConvertor = require('../helpers/common/dateConversion/endDate');

const AssignEmployee= require("../models/assignEmployee");
const Revisit= require("../models/revisit");
const stageActivity=require("../models/stageActivity")
const FollowUp= require("../models/followUp");
const xlsx = require("xlsx");
const findEmpIDAndTLID= require("../helpers/employee/findDLEmpandTL");
const CurrentDate = require('../helpers/common/dateConversion/currentDate');
const  FindEmpIdByDistrict= require("../helpers/common/findDLEmpAndTLByDistrict");
const ErrorClient=require("../models/errorClient");
const findEmpIdAndTLIDByState= require("../helpers/common/FinndEmpdIDAndTLIDByState")
const assignEmployee=require("../models/assignEmployee");




const addClient=async(req,res)=>{
    try{
        let {name,email,empID,mobile,source,stageID,stateID,kwpInterested,remark,zipCode} = req.body;
        console.log(zipCode);

      

        if (zipCode && zipCode.length >= 5) {
      
           zipCode=Number(zipCode);
            try {
                const zipCodeResponse = await axios.get(`https://api.postalpincode.in/pincode/${zipCode}`);
                console.log(zipCodeResponse.data[0])
                
                if (zipCodeResponse.data && zipCodeResponse.data.length > 0 && zipCodeResponse.data[0].Status === "Success") {
                    const postOffice = zipCodeResponse.data[0].PostOffice[0];
                   
                  
                    if (postOffice) {
                      var  district = postOffice.District;
                      var  city = postOffice.District;
                    }
                }
            } catch (error) {
                console.error("Error fetching zip code data:", error.message);
            }
        }
        
        let empdata;
        if(empID!=null){
            empdata=await Dlemployee.findById(empID).select("teamLeader").exec()
        }

        const response= new DLclient({name,email,empID,mobile,source,stageID,stateID,district,city,kwpInterested,remark,CurrentDate:Date.now(),TLID:empdata?.teamLeader,zipCode})
        const newclient= await response.save();
        if(newclient && newclient._id){
            const clientId=newclient._id.toString();
            const stageUpdateDate = new Date();
            await insertStageActivity(clientId,empID,stageID,stageUpdateDate)
        }
        if(newclient){
            return res.status(200).json({
                data:newclient,
                success:true,
                msg:"Client Added Successfully."
            });
        }else{
            return res.status(400).json({
                success:false,
                msg:'Something is Missing'
            });
        }
        
            
    }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}

const Fetchclients=async(req,res)=>{
    try{
        const id = req.id;
        const {TLID, name, empID, district, state, email, mobile, source, stage, page, limit, date, startDate, endDate, type, kwpInterested, employeeName, teamLeaderName}= req.query;
        console.log("QUERY",req.query)
        const stateName = await State.find({state: {$regex : `^${state}`, $options:'i'}}).select("_id");
        console.log(stateName);
       
        const stateList = stateName.map(state => state._id);
        console.log(stateList);
        const filters ={};
        if(empID) filters.empID = new mongoose.Types.ObjectId(empID);
        if(id) filters._id = new mongoose.Types.ObjectId(id);
        if (TLID) filters.TLID = new mongoose.Types.ObjectId(TLID);


    






        
        if(employeeName === "N/A" || employeeName === "n/a") filters.empID = null; // for find not assign clients
        // find employee id according to employee name and apply filter
        if(employeeName && employeeName != 'undefined' && employeeName != "N/A" && employeeName != "n/a"){
            const empData = await Dlemployee.find({name : { $regex: `^${employeeName}`, $options: 'i' }}).select("_id");
            const empIDs = empData.map(item => item._id);
            console.log(empIDs)
            filters.empID = { $in : empIDs};
        }
        if(teamLeaderName && teamLeaderName != 'undefined'){

            const teamLeaderData = await TLdealer.find({name : { $regex: `^${teamLeaderName}`, $options: 'i' }}).select("_id");
            const TLIDs = teamLeaderData.map(item =>item._id);
            filters.TLID = {$in : TLIDs};
        }
        if (name) filters.name = { $regex: `^${name}`, $options: 'i' }; // Case-insensitive search
        if (district) filters.district = { $regex: district, $options: 'i' };
        if (state){
            filters.stateID = {$in: stateList}
        };
        if (email) filters.email = { $regex: email, $options: 'i' };
        if (mobile) filters.mobile = mobile;
        if (source) filters.source = { $regex: source, $options : 'i' };
        // if (stage) filters.stageID = stage;  // OLD
        if(stage){
            filters.stageID = new mongoose.Types.ObjectId(stage);
        }
        if (date) {
            filters.CurrentDate = {
                $gte: await startDateConvertor(date),
                $lte: await endDateConvertor(date)    // Less than or equal to end of the day
            };  
        }
        if (startDate && endDate) {
            filters.CurrentDate = {
                $gte: await startDateConvertor(startDate),
                $lte: await endDateConvertor(endDate)
            };
        }
        // console.log(type)
        const typeValue = type?.toLowerCase();
        let typeIndex = 1;
        if(typeValue == 'cold') typeIndex = 3;
        if(typeValue == 'warm') typeIndex = 2;
        if(typeValue) filters.type = typeIndex;
        if(kwpInterested) filters.kwpInterested = {$regex : kwpInterested, $options : 'i'};

        /* new update for unique clients */
        const pages = parseInt(page);
        const limits = parseInt(limit);
        const skip = (pages - 1) * limits;
        const skipValue = (typeof skip === 'number' && !isNaN(skip)) ? skip : 0;
        const limitValue = (typeof limits === 'number' && !isNaN(limits)) ? limits : undefined; // Default to undefined if limits is invalid
        console.log(filters,"app");

           const uniqueClients = await DLclient.aggregate([
                    { $match: filters}, // Apply filter criteria
                    {
                        $group: {
                            _id: "$mobile", // Group by mobile
                            client: { $first: "$$ROOT" } // Get the first client document per mobile
                        }
                    },
                    {$replaceRoot: { newRoot: "$client" } },// Replace the root with the client document itself
                    // populate empID
                    {
                        $lookup: {
                            from: "dealertls", // Collection name for TeamLeader
                            localField: "TLID",
                            foreignField: "_id",
                            as: "TLID"
                        }
                    },
                    { $unwind: { path: "$TLID", preserveNullAndEmptyArrays: true } },// Unwind TLID array to a single object
                    {
                        $lookup:{
                            from:"dealeremployees",
                            localField:"empID",
                            foreignField: "_id",
                            as:"empID"
                        }
                    },
                    { $unwind: { path: "$empID", preserveNullAndEmptyArrays: true } },
                    // Populate stateID
                    {
                        $lookup: {
                            from: "states", // Collection name for State
                            localField: "stateID",
                            foreignField: "_id",
                            as: "stateID"
                        }
                    },
                    { $unwind: { path: "$stateID", preserveNullAndEmptyArrays: true } },
                    {
                        $lookup:{
                            from:"stages",
                            localField:"stageID",
                            foreignField: "_id",
                            as: "stageID"
                        } 
                    },
                    { $unwind: { path: "$stageID", preserveNullAndEmptyArrays: true } },
                   
                    {
                        $project: {
                            _id:1,
                            name: 1,
                            email: 1,
                            assignEmp:1,
                            mobile: 1,
                            source: 1,
                            stageID: 1,
                            district: 1,
                            city: 1,
                            zipCode: 1,
                            kwpInterested: 1,
                            type: 1,
                            CurrentDate: 1,
                            interstedIn:1, 
                            remark:1,
                            Document:1,
                            
                          
                         "TLID.name":1,
                            "empID.name":1,
                            "empID._id":1,
                            "stateID.state":1,
                            "StateID._id":1
                           
                       }
                     },
                    { $sort: { CurrentDate: -1 } },
                    { $skip: skipValue },       // Skip documents for pagination
                    ...(limitValue !== undefined ? [{ $limit: limitValue }] : [])
                ]);
       
               const updatedClients =await Promise.all(uniqueClients.map(async(client) =>{
                   const clientID =await client._id.toString();
                   // For finding name of assign Employee and visiting Date
                   const assignEmpData = await AssignEmployee.findOne({clientID})
                       .populate({
                           path:'fieldEmpID',
                           select:{'name':1,}
                       })
                       .lean();
                       let name = null;    
                       let date = null;
                       if(assignEmpData != null){
                           name = assignEmpData?.fieldEmpID?.name;
                           date = assignEmpData.visitingDate;
                       }
                       //For find Revisit date
                       const revisitData = await Revisit.findOne({clientID}).select("revisitDate");
                       const revisitDate =(revisitData)? revisitData.revisitDate : null;
                       // For find all stage according to client and update Date
                       const stageActivityData = await stageActivity.find({clientID})
                       .populate({
                           path:"stageID",
                       })
                       const stageActivityList = (stageActivityData) ? stageActivityData : null;
                       // show followUpDate
                       const followData = await FollowUp.findOne({clientID}).select("followUpDate").sort("-createAt");
                       // console.log(followData)
                       return {
                           ...client,
                           assignEmp: name,
                           visitingDate: date,
                           revisitDate:(revisitDate),
                           stageActivity:stageActivityList,
                           followUpDate : followData?.followUpDate
                       }
               }));
               // console.log(updatedClients.length)
               return res.status(200).json({
                   success:true,
                   clients:(updatedClients) ? updatedClients : 'No data found' ,
                   nextPage: (updatedClients.length >= limit) ? +page + 1 : null,
               })

    }catch(error){
  console.log(error);
  res.status(400).json({
    status:false,
    message:"Error in fetching lead"
  })
    }
}
const bulkExcelLead= async(req,res) =>{
    let uploadedFreshClient = 0;
    let notUploadedClient = 0;
    let totalClient = 0;
    let clientData;
    let stageResult = 0;
    let wlcSuccessMsg = 0;
    let wlcUnsuccessMsg = 0;
    let empID = null;
    let teamLeaderID = null;
    var state = null;
    let StateID = null;
    let district = null;
    try {
        if (!req.file) {
            return res.status(400).json({ success:false, message: 'No file uploaded' });
        }
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = xlsx.utils.sheet_to_json(worksheet); // it is converted data excel->json
        // console.log(excelData);
        let ClientArray = [];
        for(const row of excelData){

            district = row['city'];
            state = row['state'];
          
            ++totalClient; // count total leads
            
            let stateName ;

          if(state==="string"){
              
            const cleanedState = state.trim();
           
             stateName = await State.findOne({ state: { $regex: new RegExp(`^${cleanedState}$`, 'i') } }).select("state")[0];
          }else{
            state=null;
          }

            if (stateName) {
                state = stateName.state;
                console.log(state, "states");
            } else {
                // console.log("State not found for:", cleanedState);
                state = null; // Set state to null if not found
            }
            
             let zipCode = row['zip_code'];
             console.log(zipCode);
             
           
           

             if (typeof zipCode === "number" && zipCode.toString().length >= 5) {
                console.log("hello");
                console.log(zipCode, "zip");
            
                try {
                    const zipCodeResponse = await axios.get(`https://api.postalpincode.in/pincode/${zipCode}`);
            
                    if (zipCodeResponse.data[0].Status === "Success") {
                        const postOffice = zipCodeResponse?.data?.[0]?.PostOffice?.[0];
                        console.log(postOffice);
            
                        district = postOffice?.District;
                        state = postOffice?.State;
                    }
                } catch (error) {
                    console.error("Error fetching zip code data:", error.message);
                }
            } else {
                zipCode = null;
            }
            
        
            if(state){
                const responseStateID = await State.findOne({state},'_id');
                StateID = responseStateID?._id.toString();
            }
            console.log(StateID);
            
          
            const excelEmpID = row['employeeID'];
          
            if(excelEmpID){
                console.log(excelEmpID);
                const employeeResponseData = await findEmpIDAndTLID(excelEmpID);
                console.log(employeeResponseData);
                empID = employeeResponseData.empID;
                teamLeaderID = employeeResponseData.TLID;
            }else{
             
                const Stateresponse=await findEmpIdAndTLIDByState(StateID);
               
                console.log(Stateresponse,"hello")
                empID=Stateresponse?.empID,
                teamLeaderID=Stateresponse?.TLID; 
            }
            const currentDate = await CurrentDate();
            // if(typeof zipCode === "string") zipCode = 0;
            
            clientData = {
                name: row['full_name'],
                mobile: row['mobile'],
                source: row['platform'],
                stateID: StateID,
                district: district,
                city: row['city'],
                zipCode:zipCode?zipCode:null,
                empID:empID,
                TLID: teamLeaderID,
                CurrentDate :currentDate
            };
            console.log("Client data ",clientData);
            // ExcelData.push(clientData);
            try{
                const newClient = await DLclient.create(clientData);
                               if(newClient && newClient._id){
                                   const newClientID = newClient._id.toString();
                                   const stageUpdateDate = new Date();
                                   const stageID = "66e15ed1774c6b5fb4ab626b";
                                   const stageResponse =await insertStageActivity(newClientID, empID, stageID, stageUpdateDate);
                                   if(stageResponse) stageResult++;
                               }
                               uploadedFreshClient++;
                console.log(uploadedFreshClient,"not hwerere")
                // const whatsAppResponse = await welcomeTemplate(clientData.mobile); 
                // (whatsAppResponse) ? ++wlcSuccessMsg : --wlcUnsuccessMsg;
            }catch(error){
                const newClientData = {...clientData, errors:error.message};
                const errorClient = await ErrorClient.create(newClientData);
                notUploadedClient++;
                console.log(notUploadedClient,"not uploADED")
                console.log(error.message);
                if(!errorClient){
                    ClientArray.push(clientData);
                }
            }
        }
        return res.status(200).json({
            success:true,
            msg:'Successfully added client in server',
            stage:stageResult,
            totalClient:totalClient,
            uploadedClient:uploadedFreshClient,
            notUploadClient:notUploadedClient,
            // welcomeSuccessMsg:wlcSuccessMsg,
            // welcomeUnsuccessfullyMsg: wlcUnsuccessMsg,
            // list:ExcelData
        })
    } catch (error) {
        const newClientData = {...clientData, errors:error.message};
            const errorClient = await ErrorClient.create(newClientData);
            notUploadedClient++;
            if(!errorClient){
                ClientArray.push(clientData);
            }
        return res.status(400).json({
            success:false,
            message:"error",
            msg:error.message
        });
    }
}




// const   updateDLClient = async(req,res) =>{
//     try {
//         console.log("hgff",req.query || req.body || req.params);
//         let newVisit = null;
//         const {kwpInterested, type, email, stageID, selectedFieldSales, visitingDate, followUpDate, remark, clientID, empID,address,state,interstedIn,other} = req.body;
//         console.log(visitingDate,"vsuisting date");
//         console.log(address,"adrees")
        
       
//         if(!req?.body?.clientID){
//             return res.status(400).json({
//                 success:false,
//                 msg:"client Id not Exist!"
//             });
//         }

//         // const StateName="Delhi";
//         const response=await State.find({state:state});
   
//         console.log(response,"state response");
       

       
//     //     const ElectrcityBill=await req.files["electricitybill"]?`${process.env.SERVER_URL}uploads/ElectricityBill/${req.files["electricitybill"][0].filename}`:null;
//     //     console.log(ElectrcityBill);
//     //     const   ProposalPdf=await req.files["proposalpdf"]?`${process.env.SERVER_URL}uploads/proposalpdf/${req.files["proposalpdf"][0].filename}`:null;
//     //     const additionalsdetails=new Extradetails({
//     //    ElectrcityBill,ProposalPdf
//     //     })
//     //     additionalsdetails.save();
//     // const Document = await req.files['DLDocument']?`${process.env.SERVER_URL}uploads/DLDocument/${req.files["DLDocument"][0].filename}`:null;

//         if(followUpDate || visitingDate){ // check given date is not less the current date
//             const queryData = new Date(followUpDate || visitingDate);
//             const today = new Date();
//             if(queryData.getDate() < today.getDate() && queryData.getMonth() < today.getMonth() && queryData.getYear() < today.getYear()){
//                 return res.status(400).json({
//                     success:false,
//                     msg:" Please give valid Date."
//                 })
//             }  
//         }
//         if(followUpDate){
//             const newFollowUpDate = await equalDateFunction(followUpDate);
//             console.log(newFollowUpDate);
//             await FollowUp.findOneAndUpdate({clientID: clientID}, {$set : {followUpDate:newFollowUpDate}},{new: true, upsert:true, runValidators: true });
//         }
//         // console.log("RB",req.body);
//         // if(visitingDate && assignEmp == ''){
//         //     return res.status(400).json({
//         //         success:false,
//         //         msg:"Visiting date not save without assign employee."
//         //     })
//         // }
//         if(visitingDate){
//             console.log("missin Success")
//             const newVisitingDate = await equalDateFunction(visitingDate);
//             console.log(newVisitingDate,"DEFEFE")
//             const visit = new AssignEmployee({
//                 clientID, fieldEmpID:selectedFieldSales, visitingDate:newVisitingDate
//             });
//             newVisit = await visit.save();
//             console.log(newVisit)
//         }
//         if(interstedIn=="1"){
//             interstedIn="Channel Partner"
//         }else if(interstedIn=="2"){
//             interstedIn="Distributor"
//         }else if(interstedIn=="3"){
//             interstedIn="DealerShip"
//         }else if(interstedIn=="4"){
//             interstedIn="Franchise"
//         }else if(interstedIn=="5"){
//             interstedIn="Agent"
//         }else if(interstedIn=="6"){
//             interstedIn=other;
//         }
//         const UpdatedData ={
//              stateID:response[0]._id,
//             kwpInterested:kwpInterested,
//             type:type,
//             email:email,
//             stageID:stageID, 
//             address:address,
//             status:"Pending",
//             interstedIn:interstedIn,
//             // Document:Document || null
           
//         }
       
//         const updateClient = await DLclient.findByIdAndUpdate(clientID, UpdatedData, { new:true, runValidators: true }).populate("AdditionalDetails");
//         if(!updateClient){
//             return res.status(404).json({
//                 success:false,
//                 msg:'Something is Wrong please try again !'
//             });
//         }
//         if(stageID){
//             const stageUpdateDate = new Date();
//             await insertStageActivity(clientID, empID, stageID, stageUpdateDate, remark);
//         }
       
//         return res.status(200).json({
//             success:true,
//             msg:"Update SuccessFully .",
//             data:updateClient,
//         });
//     } catch (error) {
//         console.log(error)
//         return res.status(400).json({
//             success:false,
//             msg:error.message
//         });
//     }
// }
const updateDLClient = async (req, res) => {
    try {
        console.log("Request Data:", req.body);

        const { kwpInterested, type, email, stageID, selectedFieldSales, visitingDate, followUpDate, remark, clientID, empID, address, state, interstedIn, other } = req.body;

        if (!clientID) {
            return res.status(400).json({
                success: false,
                msg: "Client ID does not exist!"
            });
        }
        const Document=await req.files["Document"]?`${process.env.SERVER_URL}/uploads/DLproposal/${req.files["Document"][0].filename}`:null;

        const stateResponse =  await State.find({state});
        console.log(stateResponse);
        if (!stateResponse) {
            return res.status(404).json({
                success: false,
                msg: "State not found!"
            });
        }

        if (followUpDate || visitingDate) {
            const queryDate = new Date(followUpDate || visitingDate);
            const today = new Date();

            if (queryDate < today) {
                return res.status(400).json({
                    success: false,
                    msg: "Please provide a valid future date."
                });
            }
        }

        if (followUpDate) {
            const newFollowUpDate = await equalDateFunction(followUpDate);
           const data= await FollowUp.findOneAndUpdate(
                { clientID },
                { $set: { followUpDate: newFollowUpDate } },
                { new: true, upsert: true, runValidators: true }
            );
            console.log(data,"respo0nse")
        }

        let newVisit = null;
        if (visitingDate) {
            console.log("Adding visiting date...");
            const newVisitingDate = await equalDateFunction(visitingDate);
            const visit = new AssignEmployee({ clientID, fieldEmpID: selectedFieldSales, visitingDate: newVisitingDate });
            newVisit = await visit.save();
        }

        const interestMap = {
            "1": "Channel Partner",
            "2": "Distributor",
            "3": "DealerShip",
            "4": "Franchise",
            "5": "Agent",
            "6": other
        };
        const interestValue = interestMap[interstedIn] || "Unknown";
        const updatedData = {
            stateID: stateResponse?.[0]?._id || null,
            kwpInterested: kwpInterested || "N/A",
            type: type || 1,
            email: email || "",
            stageID: stageID || "66e15ed1774c6b5fb4ab626b",
            address: address || null,
            interstedIn: interestValue || "N/A",
            Document:Document || null,
            remark:remark || null,
        };
        console.log(updatedData,"data")
        console.log("Client ID:", clientID);


const data = await DLclient.find({ _id: clientID });
console.log(data);



        const updateClient = await DLclient.findByIdAndUpdate(
            clientID,
            updatedData,
            { new: true, runValidators: true }
        ).exec();
        
        if (!updateClient) {
            return res.status(404).json({
                success: false,
                msg: "Something went wrong, please try again!"
            });
        }

        if (stageID) {
            const stageUpdateDate = new Date();
            await insertStageActivity(clientID, empID, stageID, stageUpdateDate, remark);
        }

        return res.status(200).json({
            success: true,
            msg: "Update successful.",
            data: updateClient,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};




module.exports={
    Fetchclients,
    addClient,
    bulkExcelLead,
    updateDLClient,

}