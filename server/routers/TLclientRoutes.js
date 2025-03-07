const express=require("express");
const router=express.Router();
const DLclient= require("../controllers/ClientDealer")


router.post("/addDealerLead",DLclient.addClient);
router.get("/fetchAllLeads",DLclient.Fetchclients);






module.exports=router;