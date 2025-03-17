const DLEmployee = require("../../models/Dealer Models/DealerEmployee");
// const teamLeader = require("../../models/teamLeader");
// const State = require('../../models/state');
const empDataa = async (district, stateName) => {
    let empID = null;
    let TLId = null;

    const empData = await DLEmployee.findOne( 
        {district: { $regex: new RegExp(district, "i") }},
        { _id: 1,}
    ).populate("teamLeader");

    if(empData && empData.teamLeader._id){ TLId = empData.teamLeader._id.toString();}
    if(empData && empData._id){ empID = empData._id.toString();}
    
    return {
        empID:empID,
        teamLeaderID:TLId
    };
}

module.exports = empDataa;