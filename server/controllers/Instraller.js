const InstallerEmp= require("../models/Installer")
const Client= require("../models/client")
const ExtraDetail= require("../models/Extradetails")
require('dotenv').config();

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
      const reponse= await InstallerEmp.find({}).populate("department");
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

const installerClientDetails = async (req, res) => {
    try {
        const { panelSerialNumbers, inverterSerialNumbers, clientId } = req.body;
        console.log(req.body);

        console.log(req.files["photos"], "photos");
        let client = await Client.findById({ _id: clientId });
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        const AdditionalDetails = await ExtraDetail.find({ _id: { $in: client?.AdditionalDetails } });

        // Save uploaded photos with full URL
        const photoPaths = req.files["photos"]
            ? req.files["photos"].map(file => `${process.env.SERVER_URL}uploads/Photos/${file.filename}`)
            : [];
            console.log(photoPaths)

        // Update client data
        for (let detail of AdditionalDetails) {
            if (!detail.Photos) {
                detail.Photos = []; // Initialize if undefined
            }
            detail.Photos = [...detail.Photos, ...photoPaths];

            if (panelSerialNumbers) {
                detail.panelSerialNo = JSON.parse(panelSerialNumbers);
            }
            if (inverterSerialNumbers) {
                detail.inverterSerialNo = JSON.parse(inverterSerialNumbers);
            }

            await detail.save(); // Save each document
        }
        client.InstallStatus="Complete";
        client.save();

        res.status(200).json({ message: "Client data updated successfully", data: AdditionalDetails });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Error in Updating Client",
        });
    }
};


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
    fetchallinstallerclients,
    installerClientDetails

}