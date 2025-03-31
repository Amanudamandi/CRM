


import axios from "axios"

export const updateCoordinatorDealerProfile = async( TLID, updatedData ) => {
    try{
        const sendRequest = await axios.put(`${process.env.REACT_APP_URL}/dealerTL/updateTL?TLid=${TLID}`, updatedData);
        const response = await sendRequest.data;
        console.log(response);
        const { success } = response;
        if( success ){
            console.log(response);
            alert(response.message);
        }
    }catch(error){
        console.error(error);
        const allErrors = error.response.data;
        // alert(allErrors);
    }
}