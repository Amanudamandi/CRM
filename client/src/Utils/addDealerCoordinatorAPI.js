import axios from "axios"


export const coordinatorDealerRegistration= async(coordinatorDealerRegistrationData)=>{
  
    console.log("coordinatorDealerRegistrationData",coordinatorDealerRegistrationData);
    try{
        const response = await axios.post(`${process.env.REACT_APP_URL}/dealerTL/addTLDealer`,coordinatorDealerRegistrationData);
         const resData= await response.data;
         console.log("response data ",resData);
          const success=resData.success;

          if(!success){
            alert("Employee not added")
          }else{
            alert("Employee sucessfully added");
            console.log(response);
          }

    }catch(error){
        if(error.resData.data.success===false){
            alert(error.resData.data.msg);
        }else{
            const errorsList = error.resData.data.errors;
            console.log(errorsList);
            let errorsStr = "";
            for(let data of errorsList){
                // console.log(data.msg);
                errorsStr += `${data.msg}\n`;
            }
            alert(errorsStr);
        }
    }
}