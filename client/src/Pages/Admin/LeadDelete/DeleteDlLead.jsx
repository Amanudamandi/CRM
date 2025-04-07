import axios from 'axios';
import React, { useState } from 'react'

const DeleteLead = () => {
  const Styles = {
    leadFormContainer: { margin: 'auto', display: 'flex', alignItems: 'center', width: '60%', height: '100vh', padding: '0rem 8rem' },
    formHeading: { width: '100%', textAlign: 'center', marginTop: "3rem" },
    formLabel: { color: '#AA0B2B', fontWeight: 800, fontSize: "20px" },
    formSubmitBtn: { backgroundColor: '#AA0B2B', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', color: '#fff', marginTop: '0.5rem' }
  }

  const [file, setFile] = useState("");

  const handleFile = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && !selectedFile.name.match(/\.(xlsx|xls)$/)) {
      alert("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }
    setFile(selectedFile);
  }


  const handleOnSubmt = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    if (!file) {
      alert("Select the file ")
    }
    formData.append("file ", file);

    console.log("file is ", ...formData);

    // try {
    //   const response = await axios.post(`${process.env.REACT_APP_URL}/client/delete-clients`,  formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     }
    //   });
    //   console.log("Response:", response.data);
    //   alert("Leads delete successfully!");

    // } catch (error) {
    //   console.log("Error is : ", error);
    //   alert("Lead is not delete successfully, please check the console for error..");
    // }
  }
  return (
    <>
      <form method='post' onSubmit={handleOnSubmt}>
        <h2 style={Styles.formHeading}>Delete Dealer Lead in Bulk</h2>
        <div>
          <label htmlFor="fileUpload" style={{ ...Styles.formLabel, marginTop: "30px" }}>Enter Excel File to delete Dealer Leads : </label>
          <input style={{ marginTop: "15px" }} id='fileUpload' name='file' type="file" onChange={handleFile} accept=".xlsx,.xls" />
        </div>
        <div>
          <button style={Styles.formSubmitBtn} type='submit'>Delete Dealer Lead </button>
        </div>
      </form>
    </>
  )
}

export default DeleteLead