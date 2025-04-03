const InstallerEmp= require("../models/Installer")

const addInstaller=async(req,res)=>{
    try{
   const {name,email,InsID,mobile,department,stateID}=req.body;
   console.log(req.body);
        if(!InsID){
res.status(400).json({
    message:"Please enter the id",
    status:false,
})
        }

        const response=await InstallerEmp.create({name,email,InsID,mobile,department,stateID});
        res.status(200).json({
            message:"Succesfully created Installer",
            status:true,
        })
   
    }catch(error){
        console.log(error);
        res.status(400).json({
            message:"Error in Installer",
            status:false,
        })
    }
}

module.exports={
    addInstaller
}