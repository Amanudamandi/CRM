const assignEmp = require("../models/assignEmployee");
const client = require("../models/client");
const startDateConvertor  = require('../helpers/common/dateConversion/startDate');
const endDateConvertor = require("../helpers/common/dateConversion/endDate");
const StageActivity = require('../models/stageActivity');
const employee = require("../models/employee");
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
module.exports ={
    assignEmployee,
    showVisitingList,
    updateClientByFieldEmp,
    todayLead,
    remark,
    empdetail
}