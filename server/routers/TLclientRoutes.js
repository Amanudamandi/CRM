const express=require("express");
const router=express.Router();
const DLclient= require("../controllers/ClientDealer");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadd=require("../middlewares/Multer")



router.post("/addDealerLead",DLclient.addClient);
router.get("/fetchAllLeads",DLclient.Fetchclients);
router.post("/dLBulkLead", upload.single('file'),DLclient.bulkExcelLead);
router.put("/updateDLClient",uploadd.fields([  {name:'Document',maxCount:1},]),DLclient.updateDLClient);
router.put("/bulkAssignLead",DLclient.bulkAssignLead)













module.exports=router;