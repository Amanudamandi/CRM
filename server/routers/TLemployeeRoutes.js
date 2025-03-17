const express=require("express");
const router=express.Router();
const DealerEmployee= require("../controllers/DealerEmployee");

router.post("/register",DealerEmployee.registeremployeeDL);
router.get("/FetchDLemployee",DealerEmployee.fetchAllDealerEmployee);
router.put("/updateDLemp",DealerEmployee.UpdateDLemplpoyee);
router.get("/todayLeads",DealerEmployee.todayLeads);




module.exports=router;