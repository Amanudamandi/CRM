// import axios from "axios";

// export const handleOnFileChangeDL = async ( event, setIsLoading ) => {
//     setIsLoading(true);
//     const file = event.target.files[0];
//     // setSelectedFile(file);
//     console.log(file)
//     const formData = new FormData();
//     formData.append('file', file);

//     try{
//         const sendRequest = await axios.post(`${process.env.REACT_APP_URL}/clientDL/dLBulkLead`, formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data'
//             }
//         });
//         const response = await sendRequest.data;
//         console.log(response);
//         if(response.success){
//             alert(
//                 `Total_Leads: ${response.totalClient}\nTotal_Uploaded_Leads: ${response.uploadedClient}\nNot_Uploaded_Leads: ${response.notUploadClient}`
//             );
//         }
//     } catch(error){
//         console.log(error);
//     }finally{
//         setIsLoading(false);
//     }
// }


import axios from "axios";

export const handleOnFileChangeDL = async ( event, setIsLoading ) => {
    setIsLoading(true);
    const file = event.target.files[0];
    // setSelectedFile(file);
    console.log(file)
    const formData = new FormData();
    formData.append('file', file);
    
    try{
        const sendRequest = await axios.post(`${process.env.REACT_APP_URL}/clientDL/dLBulkLead`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
        const response = await sendRequest.data;
        console.log(response);
        if(response.success){
            alert(
                `Total_Leads: ${response.totalClient}\nTotal_Uploaded_Leads: ${response.uploadedClient}\nNot_Uploaded_Leads: ${response.notUploadClient}`
            );
        }
    } catch(error){
        console.log(error);
    }finally{
        setIsLoading(false);
    }
}