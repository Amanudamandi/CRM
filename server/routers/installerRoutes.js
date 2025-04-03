const InstallerController = require("../controllers/Instraller.js"); // Corrected typo in the import
const express = require("express");
const router = express.Router(); 

// Route to add a new installer
router.post("/addInstaller", InstallerController.addInstaller);

module.exports = router;
