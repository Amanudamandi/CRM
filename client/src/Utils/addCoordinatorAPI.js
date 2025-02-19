import axios from "axios";

export const coordinatorRegistration = async( coordinatorRegistrationData ) => {
    try{        
        const sendRequest = await axios.post(`${process.env.REACT_APP_URL}/auth/addTeamLeader`, coordinatorRegistrationData);
        const response = await sendRequest.data;
        const success = response.success;
        if(!success){
            alert(response.msg);
        }
        else{
            alert(response.msg);
            console.log(response);
        }
    }catch(error){
        if(error.response.data.success === false){
            alert(error.response.data.msg);
        }
        else{
            const errorsList = error.response.data.errors;
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