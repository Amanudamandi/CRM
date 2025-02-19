import axios from "axios";

export const showTeamLeaderName = async(setData) => {
    try{
        const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/auth/showTeamLeaderName`);
        const response = await sendRequest.data;
        const { success } = response;
        if( success ) {
            console.log(response.data);
            setData(response.data);
            return response.data;
        }
    }catch(error){
        console.error(error);
    }
}