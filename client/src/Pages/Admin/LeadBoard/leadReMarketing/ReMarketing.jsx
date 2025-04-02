import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5';

const ReMarketing = ({ reMarketingBtnClicked, setReMarketingBtnClicked, clientsID, setReMarketingSuccess, limit, setLeadStatusList }) => {
    console.log("client id ", clientsID);
    const Styles = {
        coordinatorProfileContainer: { margin: '0rem 1rem 0rem 8.2rem', backgroundColor: '#fff', padding: '0rem 0rem', width: '75%', height: '92vh', position: 'fixed', top: '50%', left: '50%', zIndex: '9999', boxShadow: '0px 0px 2px black', borderRadius: '8px', overflow: 'auto', transform: 'translate(-50%, -50%)' },
        closeIconButton: { cursor: 'pointer', position: 'absolute', top: '1rem', right: '0.8rem', transition: 'transform 0.4s ease', transformOrigin: 'center' },
        assigneeLabel: { display: 'inline-block', fontSize: '20px', marginBottom: '8px' },
        assigneeSelectBox: { width: '22rem', padding: '8px', borderRadius: '4px' },
        reAssignBtnContainer: { position: 'absolute', borderRadius: '2px solid red', bottom: '1.8rem', left: '2rem' },
        cancelBtn: { borderRadius: '4px', border: '1px solid black', padding: '8px 32px', cursor: 'pointer' },
        updateForm: { display: 'grid', gridTemplateColumns: '1fr 0.2rem 1fr', gap: '16px', padding: '1.5rem 0rem' },
        inputFieldContainer: { marginBottom: '1rem', marginLeft: "1rem" },
        inputLabel: { display: 'block', width: 'fit-content', marginBottom: '0.2rem', fontWeight: 600 },
        updateBtn: { width: '80%', padding: '0.5rem 1rem', backgroundColor: '#AA0B2B', border: 'none', margin: "15px", borderRadius: '5px', color: '#fff', cursor: 'pointer' },


    }

    const [image, setImage] = useState('');
    const [message, setMessage] = useState('');
    const [compNumber, setCompNumber] = useState('');

    const [data, setData] = useState({
        clientId: Array.isArray(clientsID) ? clientsID.filter(id => id !== undefined) : [],
        message: message,
        Whatapp: image,
        companymobile: compNumber
    })

    console.log("data is : ", data);

    const handleOnInputChange = (event) => {
        const { name, value } = event.target;
        setData((prev) => ({
            ...prev, [name]: value
        }))
    }

    const handleFile = (event) => {
        const file = event.target.files[0];
        //   console.log("file: ",file);
        if (file) {
            setImage(file);
        }
        setData((prev) => ({
            ...prev, Whatapp: file
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let formData = new FormData();

        formData.append("clientId", data?.clientId);
        formData.append("message", data?.message);
        formData.append("companymobile", data?.companymobile);
        formData.append("Whatapp", data?.Whatapp);

        // console.log("final submites data ",[...formData]);

        try {

            const response = await axios.post(`${process.env.REACT_APP_URL}/client/bulkWhatapp`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
            console.log("Server Response:", response.data);
            alert(`Offer sent successfully! and successfully lead ${response?.data?.successcount} & unSuccessfully lead ${response?.data?.unsuccesscount}`);

            
            setReMarketingBtnClicked(false);

        } catch (error) {
            console.log("Error sending data:", error);
            alert("Failed to send bluck offer .Check console for details.");
        }
    }


    return (
        <section style={reMarketingBtnClicked ? { ...Styles.coordinatorProfileContainer, animation: 'slideUp 0.5s ease forwards' } : Styles.coordinatorProfileContainer}>
            <div style={{ width: '100%', backgroundColor: '#AA0B2B', padding: '1.5rem 1.225rem' }}>
                <h2 style={{ color: 'white' }}>Re-Marketing  Lead</h2>
                <IoClose size={40} color='#fff' className='close-btn' style={Styles.closeIconButton}
                    onClick={() => {
                        setReMarketingBtnClicked(false);
                    }}
                />
            </div>

            <div >
                <form method='POST' action="" style={Styles.updateForm} onSubmit={handleSubmit} >
                    <div >
                        <div style={Styles.inputFieldContainer}>
                            <label htmlFor="offer" style={Styles.inputLabel}>Special Offer  </label>
                            <input type="file" name="Whatsapp" id="offer" onChange={handleFile} />
                        </div>
                        <div style={Styles.inputFieldContainer}>
                            <label htmlFor="msg" style={Styles.inputLabel}>Message</label>
                            <textarea style={{ padding: "10px" }} name="message" id="msg" rows={10} cols={40} onChange={handleOnInputChange}></textarea>
                        </div>
                        <div style={Styles.inputFieldContainer}>
                            <label htmlFor="compNumber" style={Styles.inputLabel}>Company Number</label>
                            <input type="number" name="companymobile" id="compNumber" onChange={handleOnInputChange} />
                        </div>

                        <div style={Styles.inputFieldContainer}>
                            <button style={Styles.updateBtn}>Send Offer </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default ReMarketing;