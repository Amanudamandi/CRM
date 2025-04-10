const express = require("express");
const router = express.Router(); // for creating router
const multer = require('multer');

const clientController =require("../controllers/clientController");
const verifyToken = require('../middlewares/authMiddleware')
const { clientRegisterValidation  } = require("../helpers/client/clientValidation");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadd=require("../middlewares/Multer")

router.post("/clientAdd", clientController.clientAdd); //completed 2.0
router.get("/fetchClients", clientController.fetchClients); // completed 3.0
router.put('/updateClient',uploadd.fields([
   {name:'electricitybill',maxCount:1},
   {name:'proposalpdf',maxCount:1},
]),clientController.updateClient); //completed 2.0
router.post('/fetchByFile',  upload.single('file'), clientController.fetchByFile); //completed 2.0
router.get("/fetchAssignEmployee", clientController.fetchAssignEmployee); //completed 1.5
router.put("/bulkAssign", clientController.bulkAssign) //completed 2.0
router.post("/FetchAssignemployee",clientController.Assignfieldemployee);
router.put("/updateStatus",clientController.updatestatus);
router.post("/delete-clients", upload.single('file'), clientController.removeClientsFromExcel);
router.delete("/deleteemp",clientController.deleteassignemployee);
router.post("/whatappSchdule",uploadd.fields([
   {name:'Whatapp',maxCount:1},
   
]),clientController.SchduleMessage);
router.post("/stopWhatapp",clientController.stopMessage);
router.post("/greetWhatapp",uploadd.fields([
   {name:'Whatapp',maxCount:1},
   
]),clientController.greatingWhatapp);
router.post(
   "/bulkWhatapp",
   uploadd.fields([{ name: "Whatapp", maxCount: 1 }]), // Correctly closing the bracket here
   clientController.bulkwhatapp
 );
 router.post("/quatationWhatapp",clientController.quotation);

 router.get("/PaymentDetails",clientController.fetchClientsPaymentManager);
 router.get("/InstallerManager",clientController.fetchClientsInstallerManager);
 router.post("/updatePaymentAndStatus", clientController.updateAmountAndStatus);
 router.post("/updateAdditionalDetails",clientController.updateAdditionalDetails);
 router.get("/netmetricClients",clientController.fetchClientsNetMetricManager);
 router.get("/InstallerLeads",verifyToken,clientController.fetchInstallerleads);
 router.get("/getNetmetric",clientController.fetchClientsNetMetricManager2);
 
// router.post()
module.exports = router;



