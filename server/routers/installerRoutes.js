const InstallerController = require("../controllers/Instraller.js"); // Corrected typo in the import
const express = require("express");
const router = express.Router(); 

// Route to add a new installer
router.post("/addInstaller", InstallerController.addInstaller);
router.get("/fetchAllIns",InstallerController.fetchall);
router.post("/assignIns",InstallerController.AssisgnInstaller);
router.post("/InstallerLeads",InstallerController.fetchallinstallerclients)


module.exports = router;

