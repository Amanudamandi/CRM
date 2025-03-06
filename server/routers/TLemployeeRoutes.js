const express=require("express");
const router=express.Router();
const DealerEmployee= require("../controllers/DealerEmployee");

router.post("/register",DealerEmployee.registeremployeeDL);
router.get("/FetchDLemployee",DealerEmployee.fetchAllDealerEmployee);




module.exports=router;