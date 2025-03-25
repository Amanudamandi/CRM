import axios from "axios";

export const showDealerEmployeeApi = async( setData, pageCount = 1, departmemtID='', coordinatorID='', stage='', state='' ) => {
    try{
        const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/DLemp/FetchDLemployee/?page=${pageCount}&limit=50&department=${departmemtID}&teamLeader=${coordinatorID}&stage=${stage}&state=${state}`);
        
        const response = await sendRequest?.data;
        console.log("response from api ",response);
        const { message } = response;
        if(message){
            setData(response?.data);
            return response?.data;
        }
        else{
            console.log("not data added successfully... ");
            alert(response.msg);
        }
        console.log("final Data ",response.data)

    } catch(error){
        console.error(error);
        alert(error.response.data.msg);
        
    }
} 