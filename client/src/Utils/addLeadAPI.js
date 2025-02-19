import axios from "axios";

export const addLeadApi = async( leadData ) => {
    console.log("leadleadData", leadData)
    try {
        const sendRequest = await axios.post(`${process.env.REACT_APP_URL}/client/clientAdd`, leadData);
        const response = await sendRequest.data;
        console.log(response);
        if(response.success){
            alert('Lead Added Successfully');
        }
    } catch (error) {
        console.log(error);
    }
}