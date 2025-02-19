import axios from "axios";

export const stateListApi = async(setStates) => {
    try {
        const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/field/showState`);
        // console.log(typeof sendRequest);
        const response = sendRequest?.data?.states;

        console.log(response);
        setStates(response);
    } catch (error) {
        console.error(error);
    }
}