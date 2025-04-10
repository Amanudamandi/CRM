const InstallerController = require("../controllers/Instraller.js"); // Corrected typo in the import
const express = require("express");
const router = express.Router(); 
const upload=require("../middlewares/Multer.js");
// Route to add a new installer
router.post("/addInstaller", InstallerController.addInstaller);
router.get("/fetchAllIns",InstallerController.fetchall);
router.post("/assignIns",InstallerController.AssisgnInstaller);
router.post("/InstallerLeads",InstallerController.fetchallinstallerclients)
router.post("/UpdateClients",  upload.fields([{ name: "photos", maxCount: 10 }]),InstallerController.installerClientDetails);


module.exports = router;

