const express=require("express");
const router=express.Router();
const DLclient= require("../controllers/ClientDealer");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



router.post("/addDealerLead",DLclient.addClient);
router.get("/fetchAllLeads",DLclient.Fetchclients);
router.post("/dLBulkLead", upload.single('file'),DLclient.bulkExcelLead);













module.exports=router;