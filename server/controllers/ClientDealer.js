const Dlemployee= require("../models/Dealer Models/DealerEmployee");
const DLclient= require("../models/Dealer Models/DealerClient");
const TLdealer= require("../models/Dealer Models/DealerTL")
const insertStageActivity= require("../helpers/common/storeStageActivity")
const axios = require("axios");
const State= require("../models/state");

const startDateConvertor= require("../helpers/common/dateConversion/startDate");
const endDateConvertor = require('../helpers/common/dateConversion/endDate');

const AssignEmployee= require("../models/assignEmployee");
const Revisit= require("../models/revisit");
const stageActivity=require("../models/stageActivity")
const FollowUp= require("../models/followUp");




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
                        $lookup:{
                            from:"dealeremployees",
                            localField:"empID",
                            foreignField: "_id",
                            as:"empID"
                        }
                    },
                    { $unwind: { path: "$empID", preserveNullAndEmptyArrays: true } },
                    // Populate TLID
                    {
                        $lookup: {
                            from: "dealertls", // Collection name for TeamLeader
                            localField: "TLID",
                            foreignField: "_id",
                            as: "TLID"
                        }
                    },
                    { $unwind: { path: "$TLID", preserveNullAndEmptyArrays: true } },// Unwind TLID array to a single object
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
                          
                            // "AdditonalDetailsID.AadharCard":1,
                            "empID.name":1,
                            "empID._id":1,
                            "TLID.name": 1, // Include only the name field of TLID
                            "TLID._id" :1,
                            "stateID.state":1,
                            // "AdditonalDetials":1,
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

module.exports={
    Fetchclients,
    addClient,

}