import axios from "axios";

export const downloadReport = async(  setLoader, jsonData, fileName ) => {
    setLoader(true);
    try{
        jsonData = JSON.stringify(jsonData);
        console.log("JSON-DATA", jsonData);
        const sendRequest = await axios.post(`${process.env.REACT_APP_URL}/field/download-excel`, jsonData, {
            headers: {
                "Content-Type" : "application/json"
            },
            responseType: 'blob'
        });

        const response = await sendRequest.data;
        console.log("Download Excel Response: -", response);
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileName}_${(new Date()).toDateString()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }catch(error){
        console.log(error);
    }finally{
        setLoader(false);
    }
}