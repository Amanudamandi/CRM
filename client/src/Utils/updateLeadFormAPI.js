import axios from "axios"

export const updateLeadApi = async( updateDetails, closeForm ) => {
    try{
        const sendRequest = await axios.put(`${process.env.REACT_APP_URL}/client/updateClient`, updateDetails,
            {
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }
    );
        const response = sendRequest.data;
        const { success } = response;
        console.log('Update Lead Response:', response.data);
        closeForm(); 
       
        if( success ){
            console.log("response after update lead",response);
            // alert(response.msg);
            closeForm((previous) => ({...previous, clicked: false}));
        }
    }catch(error){
        console.error(error);
        if(error.response.data.success === false){
            alert(error.response.data.msg);
        }
        else{
            const allErrors = error.response.data;
            alert(allErrors);
        }
    }
}