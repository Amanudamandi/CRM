const InstallerEmp= require("../models/Installer")
const Client= require("../models/client")


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

const fetchall=async(req,res)=>{
    try{
      const reponse= await InstallerEmp.find({}).populate("stateID").populate("department");
    //   console.log(reponse);

      res.status(200).json({
        data:reponse,
        message:"Fetched Succesfully",
        success:true,
      
      })
    }catch(error){
        console.log(error);
        res.status(400).json({
            message:"Error i n fetching"
        })
    }
}

const AssisgnInstaller=async(req,res)=>{
    try{
        const {installerId,clientId}=req.body;
        console.log(req.body);

        const response = await Client.findByIdAndUpdate(
            clientId, // No need to wrap in an object
            { $set: { InstallerEmp: installerId } },
            { new: true } // Returns the updated document
          );
          

        res.status(200).json({
            message:"Assign Succesfully",
            data:response,
            status:true,
        })

    }catch(error){
        console.log(error);
        res.status(400).json({
            message:"Error in Assiging Installer"
        })
    }
}


const fetchallinstallerclients=async(req,res)=>{
    try{
       const {InstallerID}=req.body;
       console.log(InstallerID);

        const reponse= await Client.find({InstallerEmp:InstallerID});

        res.status(200).json({
            status:true,
            message:"fetched Succesfully",
            data:reponse
        })

    }catch(error){
        console.log(error);
        res.status(400).json({
            message:"Error in Fetching",
            status:false,
        })
    }
}





module.exports={
    addInstaller,
    fetchall,
    AssisgnInstaller,
    fetchallinstallerclients

}