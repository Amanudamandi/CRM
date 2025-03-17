import axios from "axios";

export const stageCountForDashboardApiDL = async( empID, stageID, startDate='', endDate='', TLID='', setIsLoading = null ) => {
    setIsLoading !== null && setIsLoading(true);
    try{
        const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/DLemp/todayLeads?empID=${empID}&stageID=${stageID}&startDate=${startDate}&endDate=${endDate}&TLID=${TLID}`);
        const response = await sendRequest.data;
        const { success } = response;
        if(success){
            console.log(response);
            return response.todaysLead;
        }
    }catch(error){
        console.error(error);
    }finally{
        setIsLoading !== null && setIsLoading(false);
    }
}