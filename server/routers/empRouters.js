const express = require("express");
const verifyToken = require('../middlewares/authMiddleware')
const router = express.Router();
const empC = require("../controllers/empController");

const tempFun = ()=>{
    console.log("Hi")
}

router.post("/assignEmployee", empC.assignEmployee?empC.assignEmployee:tempFun);
router.get("/todayLead", empC.todayLead?empC.todayLead:tempFun);
router.get("/showVisitingList", verifyToken, empC.showVisitingList?empC.showVisitingList:tempFun); // completed 1.0
router.post("/updateClientByFieldEmp", verifyToken , empC.updateClientByFieldEmp?empC.updateClientByFieldEmp:tempFun); // do work
router.get("/remark", verifyToken, empC.remark?empC.remark:tempFun);
router.get("/Employee",empC.empdetail ?empC.empdetail:tempFun);


// empController.emp();

module.exports = router;