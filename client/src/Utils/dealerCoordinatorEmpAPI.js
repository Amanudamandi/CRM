import axios from "axios";

export const dealerCoordinatorEmpAPI = async(id, isMounted, setData) => {
    console.log("id :",id)
    try{        
        const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/dealerTL/TeamleaderDLProfile?id=${id}`);
        if(isMounted){
            const response = await sendRequest.data;
            console.log("data response : ",response);
            const success = response.success;
            if(!success){
                alert(response.msg);
            }
            else{
                setData(response.data);
                console.log(response);
            }
        }
    }catch(error){
        console.error(error);
    }
}
 