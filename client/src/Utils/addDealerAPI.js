import axios from "axios";


export const addDealer=async(leadData)=>{
 console.log("leadData: ",leadData);
 try {
     const sendRequest=await axios.post(`${process.env.REACT_APP_URL}/clientDL/addDealerLead`,leadData);
     const response=await sendRequest.data;
     if(response.success){
        alert("Lead added successfully");
     }
 } catch (error) {
    console.log("error ",error);
    alert("Lead is not added")
 }
}