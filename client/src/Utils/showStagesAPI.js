import axios from "axios"

export const showStageApi = async( isMounted, setShowStages ) => {
    try{
        // let sendRequest;
        // if(stageId === null){
        const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/field/showStage`);
        // }
        // else{
        //    sendRequest = await axios.get(`${process.env.REACT_APP_URL}/field/showStage?id=${stageId}`);
        // }
         
        const response = sendRequest?.data; 
        // console.log("jkdgjkgd",sendRequest?.data?.stage);

        const { success } = response;
        if(success && isMounted){
            console.log(" All Stages",response.stages);
            setShowStages(response?.stages);
            return response.stages;
        }
        else{
            alert(response.msg);
        }

    }catch(error){
        console.log(error?.response?.data?.msg);
    }
}