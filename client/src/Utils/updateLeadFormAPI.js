import axios from "axios"

export const updateLeadApi = async( updateDetails, closeForm ) => {
    try{
        const sendRequest = await axios.put(`${process.env.REACT_APP_URL}/client/updateClient`, updateDetails);
        const response = sendRequest.data;
        const { success } = response;
        if( success ){
            console.log(response);
            alert(response.msg);
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