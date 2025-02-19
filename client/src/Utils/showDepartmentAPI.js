import axios from "axios";

export const showDepartmentApi = async( setShowData ) => {
    try{
        const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/field/showDepartment`);
        const response = await sendRequest.data;
        const { success } = response;
        console.log(response);
        if(success){
            const data = response.departments;
            setShowData(data);
        }
        // return response;
    }catch(error){
        console.error(error);
    }
}