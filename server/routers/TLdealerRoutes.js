const express=require("express");
const router=express.Router();
const DealerTLController= require("../controllers/DealerTLController");


router.post("/addTLDealer",DealerTLController.addDealerTL);
router.get("/fetchall",DealerTLController.fetchAllTL);
router.put("/updateTL",DealerTLController.updateDlTl);
router.get("/TeamleaderDLProfile",DealerTLController.teamLeaderDLprofile);
module.exports=router;