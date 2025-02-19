import axios from "axios";

export const showTlProfile = async(id, isMounted, setData) => {
    try{        
        const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/auth/teamLeaderProfile?id=${id}`);
        if(isMounted){
            const response = await sendRequest.data;
            const success = response.success;
            if(!success){
                alert(response.msg);
            }
            else{
                setData(response.employeeList);
                console.log(response);
            }
        }
    }catch(error){
        console.error(error);
    }
}