import axios from "axios";

export  const AddDealerEmployeeApi= async(registrationData)=>{
    console.log("register data ",registrationData)
    try{
      const resData=await axios.post(`${process.env.REACT_APP_URL}/DLemp/register`,registrationData);
      const response=await resData.data;
      console.log("data send : ",response);

      const success=response.success;
      if(success){
        alert("Employee successfully created...");
       
      }else{
        alert("Employee Not created...");
      }

    }catch(error){
        console.log(error);
        if(error.response.data.success===false){
            alert(error.response.data.message);
        }else{
            const errorList=error.response.data.errors;
            console.log(errorList);

            let errorsStr = "";
            for(let data of errorList){
                // console.log(data.msg);
                errorsStr += `${data.msg}\n`;
            }
            alert(errorsStr);
        }
    }
} 