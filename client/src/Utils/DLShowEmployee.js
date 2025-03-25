import axios from "axios";

export const DLShowEmployee = async( setData, pageCount = 1, departmemtID='', coordinatorID='', stage='', state='' ) => {
    try{
        const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/clientDL/fetchAllLeads/?page=${pageCount}&limit=50&department=${departmemtID}&teamLeader=${coordinatorID}&stage=${stage}&state=${state}`);
        
        const response = await sendRequest.data;
        // console.log("response from api ",response);
        const { success } = response;
        if(success){
            setData(response.employees);
            return response.employees;
        }
        else{
            alert(response.msg);
        }
    } catch(error){
        console.error(error);
        alert(error.response.data.msg);
        
    }
} 