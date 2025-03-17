const DLemployee = require("../../models/Dealer Models/DealerEmployee");

const fetch = async (stateID) => {
    console.log("Fetching employees for stateID:", stateID);

    const response = await DLemployee.findOne({ stateID: stateID });

    if (!response) {
        console.log("No employee found for stateID:", stateID);
        return null; // Return null if no data
    }

    return {
        empID: response._id.toString(),
        TLID: response.teamLeader ? response.teamLeader.toString() : null,
    };
};

module.exports = fetch;
