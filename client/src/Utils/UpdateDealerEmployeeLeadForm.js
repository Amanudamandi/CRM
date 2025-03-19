import axios from "axios"

export const UpdateDealerEmployeeLeadForm = async ({ updateLeadData, onClose }) => {
    console.log("update lead data : ", updateLeadData);
    try {
        const sendRequest = await axios.put(`${process.env.REACT_APP_URL}/clientDL/updateDLClient`, updateLeadData, 
            {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        const response = sendRequest.data;
        const { success } = response;
        console.log("updated Data : ", response.data);
        onClose();
        if (success) {
            console.log("response after update lead", response);
            // alert(response.msg);
            onClose((previous) => ({ ...previous, clicked: false }));
        }
        return response.data;

    } catch (error) {
        console.error(error);
        if (error.response.data.success === false) {
            alert(error.response.data.msg);
        }
        else {
            const allErrors = error.response.data;
            alert(allErrors);
        }
    }

}