import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Offer = ({ data, closeForm, showOffer }) => {
  const Style = {
    updateLeadContainer: { position: 'fixed', width: '75%', height: '92vh', margin: '0rem 1rem 0rem 8.2rem', padding: '3.5rem 1rem', backgroundColor: '#fff', top: '50%', left: '40%', zIndex: '9999', boxShadow: '0px 0px 2px black', borderRadius: '8px', transform: 'translate(-50%, -50%)' },
    closeFormBtn: { position: 'absolute', top: '1rem', right: '1rem', cursor: 'pointer', transition: 'transform 0.4s ease' },
    updateLeadInfoContainer: { margin: 'auto', width: '90%', borderBottom: '3px solid #AA0B2B' },
    showOnlyDetailsContainer: { display: 'flex', backgroundColor: 'rgba(217, 217, 217, 0.35)', gap: '8px', borderRadius: '5px' },
    leadLogoContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#AA0B2B', width: '4.5rem', height: '4rem', borderTopLeftRadius: '5px' },
    leadLogo: { color: '#fff', fontSize: '2.5rem', fontWeight: 800, textAlign: 'center' },
    leadInfoContainer: { width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 4rem', padding: '4px 0px' },
    leadInfo: { display: 'flex', flexDirection: 'column', justifyContent: 'space-around' },
    leadInfoText: { letterSpacing: '0.75px' },
    leadType: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
    formContainer: { margin: 'auto', width: '85%', display: 'grid', gridTemplateColumns: '2fr 15rem', gap: '12px' },
    updateForm: { display: 'grid', gridTemplateColumns: '1fr 0.2rem 1fr', gap: '16px', padding: '1.5rem 0rem' },
    updateBtn: { width: '80%', padding: '0.5rem 1rem', backgroundColor: '#AA0B2B', border: 'none', margin: "15px", borderRadius: '5px', color: '#fff', cursor: 'pointer' },
    leftFormFieldContainer: {},
    inputFieldContainer: { marginBottom: '1rem' },
    inputLabel: { display: 'block', width: 'fit-content', marginBottom: '0.2rem', fontWeight: 600 },
    inputField: { width: '100%', borderColor: '#000', padding: '0.5rem', borderRadius: '5px' },
    stagesMainContainer: { backgroundColor: 'rgba(217, 217, 217, 35%)', padding: '2.5rem 1.8rem' },
    stagesContainer: { height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', borderLeft: '2px solid #AA0B2B' },
    eachStageContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
    eachStageCircle: { width: '0.75rem', border: '2px solid #AA0B2B' },
    whatsappBtn: { fontSize: "15px", padding: "7px", borderRadius: "10px", backgroundColor: '#AA0B2B', border: "none", color: "white", cursor: "pointer", margin: "5px" },
    employeeValue: { padding: '0.3rem', fontSize: '1rem', textAlign: 'center', fontWeight: '500', whiteSpace: 'nowrap' }

  };

  const navigate = useNavigate();

  const [isHoveredOnClose, setIsHoveredOnClose] = useState(false);
  const [photo, setPhoto] = useState(null)
  const [message, setMessage] = useState("");
  const [compNumber, setCompNumber] = useState("")

  const [dataForm, setDataForm] = useState({
    clientId: data?._id,
    name: data?.name,
    mobile: data?.mobile,
    state: data?.state,
    Whatapp: photo,
    message: message,
    companymobile: compNumber
  })

  const handleOnInputChange = (event) => {
    const { name, value } = event.target
    setDataForm((prev) => ({
      ...prev, [name]: value,
    }))
  }

  const handlePhoto = (event) => {
    const file = event.target.files[0];
    // console.log("photo ", file)
    if (file) {
      setPhoto(file);
    }

    setDataForm((prev) => ({
      ...prev, photo: file,
    }))
  }

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("clientId", dataForm.clientId);
    formData.append("name", dataForm.name);
    formData.append("mobile", dataForm.mobile);
    formData.append("state", dataForm.state);
    formData.append("Whatapp", dataForm.photo);
    formData.append("message", dataForm.message);
    formData.append("companymobile", dataForm.companymobile);

    console.log("formData : ", [...formData]);

    try {

      const response = await axios.post(`${process.env.REACT_APP_URL}//client/greetWhatapp`, formData,
        {
          headers: {
            "Content-Type": 'multipart/form-data'
          }
        }
      )
      console.log("Server Response:", response.data);
      alert("Offer sent successfully!");

      navigate('/admin/show-leads');


    } catch (error) {
      console.log("Error sending data:", error);
      alert("Failed to send offer .Check console for details.");
    }
  }




  return (
    <section style={showOffer ? { ...Style.updateLeadContainer, animation: 'slideUp 0.5s ease forwards' } : Style.updateLeadContainer}>
      <IoClose size={35} color='#AA0B2B' style={{ ...Style.closeFormBtn, transform: isHoveredOnClose ? 'rotate(90deg)' : 'rotate(0deg)' }} onMouseOver={() => setIsHoveredOnClose(true)} onMouseOut={() => setIsHoveredOnClose(false)} onClick={() => closeForm(false)} />
      <div style={Style.updateLeadInfoContainer}>
        <div style={Style.showOnlyDetailsContainer}>
          <div style={Style.leadLogoContainer}>
            <p style={Style.leadLogo}></p>
          </div>
          <div style={Style.leadInfoContainer}>
            <div style={Style.leadInfo}>
              <span style={Style.leadInfoText}>Name: {data?.name}</span>
              <span style={Style.leadInfoText}>Mobile: {data?.mobile}</span>
              <span style={Style.leadInfoText}>Email: {data?.email ? data?.email : 'N/A'}</span>
              <span style={Style.leadInfoText}>State: {data?.state}</span>
            </div>
          </div>
        </div>
      </div>

      <div >
        <form method='POST' action="" style={Style.updateForm} onSubmit={handleOnSubmit}  >
          <div style={Style.leftFormFieldContainer}>
            <div style={Style.inputFieldContainer}>
              <label htmlFor="photo" style={Style.inputLabel}>Photo</label>
              <input type="file" name='Whatapp' id='photo' onChange={handlePhoto} />
            </div>

            <div style={Style.inputFieldContainer}>
              <label htmlFor="msg" style={Style.inputLabel}>Message</label>
              <textarea style={{ padding: "10px" }} name="message" id="msg" rows={10} cols={40} onChange={handleOnInputChange}></textarea>
            </div>
            <div style={Style.inputFieldContainer}>
              <label htmlFor="compNumber" style={Style.inputLabel}>Company Number</label>
              <input type="number" name="companymobile" id="compNumber" onChange={handleOnInputChange} />
            </div>

            <div style={Style.inputFieldContainer}>
              <button style={Style.updateBtn}>Send Offer </button>
            </div>

          </div>
        </form>
      </div>
    </section >
  )
}

export default Offer