
import React, { useEffect, useState, memo } from 'react';
import Hot from '../../../Assest/Images/hot.png';
import Warm from '../../../Assest/Images/warm.png';
import Cold from '../../../Assest/Images/cold.png';
import { IoClose } from "react-icons/io5";
import { showStageApi } from '../../../Utils/showStagesAPI';
import { showEmployeeApi } from '../../../Utils/showEmployeeAPI';
import { updateLeadApi } from '../../../Utils/updateLeadFormAPI';
import axios, { all } from 'axios';
import Whatsapp from '../../WhatsAppHandling/Whatsapp';
import { useNavigate } from 'react-router-dom';

const Index = ({ showForm, leadInformation, closeForm, pageCount, BooleanShowAllStages = false, setUpdateLeadBtnClicked }) => {
    const Style = {
        updateLeadContainer: { position: 'fixed', width: '75%', height: '92vh', margin: '0rem 1rem 0rem 8.2rem', padding: '3.5rem 1rem', backgroundColor: '#fff', top: '50%', left: '50%', zIndex: '5555', boxShadow: '0px 0px 2px black', borderRadius: '8px', transform: 'translate(-50%, -50%)' },
        closeFormBtn: { position: 'absolute', top: '1rem', right: '1rem', cursor: 'pointer', transition: 'transform 0.4s ease' },
        updateLeadInfoContainer: { margin: 'auto', width: '85%', borderBottom: '3px solid #AA0B2B' },
        showOnlyDetailsContainer: { display: 'flex', backgroundColor: 'rgba(217, 217, 217, 0.35)', gap: '8px', borderRadius: '5px' },
        leadLogoContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#AA0B2B', width: '4.5rem', height: '4rem', borderTopLeftRadius: '5px' },
        leadLogo: { color: '#fff', fontSize: '2.5rem', fontWeight: 800, textAlign: 'center' },
        leadInfoContainer: { width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 4rem', padding: '4px 0px' },
        leadInfo: { display: 'flex', flexDirection: 'column', justifyContent: 'space-around' },
        leadInfoText: { letterSpacing: '0.75px' },
        leadType: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        formContainer: { margin: 'auto', width: '85%', display: 'grid', gridTemplateColumns: '2fr 15rem', gap: '12px' },
        updateForm: { display: 'grid', gridTemplateColumns: '1fr 0.2rem 1fr', gap: '16px', padding: '1.5rem 0rem' },
        updateBtn: { width: '100%', padding: '0.5rem 1rem', backgroundColor: '#AA0B2B', border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer' },
        leftFormFieldContainer: {},
        inputFieldContainer: { marginBottom: '1rem' },
        inputLabel: { display: 'block', width: 'fit-content', marginBottom: '0.2rem', fontWeight: 600 },
        inputField: { width: '100%', borderColor: '#000', padding: '0.5rem', borderRadius: '5px' },
        stagesMainContainer: { backgroundColor: 'rgba(217, 217, 217, 35%)', padding: '2.5rem 1.8rem' },
        stagesContainer: { height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', borderLeft: '2px solid #AA0B2B' },
        eachStageContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
        eachStageCircle: { width: '0.75rem', border: '2px solid #AA0B2B' },
        whatsappBtn: { fontSize: "15px", padding: "7px", borderRadius: "10px", backgroundColor: '#AA0B2B', border: "none", color: "white", cursor: "pointer", margin: "5px" }
    };

    const navigate = useNavigate();

    const [isHoveredOnClose, setIsHoveredOnClose] = useState(false);
    const [showAllStages, setShowAllStages] = useState([]);
    const [showStages, setShowStages] = useState([]);
    const [showFieldSalesMan, setShowFieldSalesMan] = useState([]);
    const [file, setFile] = useState(null);
    const [empAssign, setEmpAssign] = useState([]);
    const [electricitybill, setElectrictybill] = useState(null);
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);

    const [states, setStates] = useState([]);

    // console.log("my leadinormation is ", leadInformation)
    const [formData, setFormData] = useState({
        clientID: leadInformation?._id,
        revisitDate: leadInformation?.revisitDate || '',
        visitingDate: leadInformation?.visitingDate || '',
        followUpDate: leadInformation?.followUpDate || '',
        type: leadInformation?.type || '',
        stageID: leadInformation?.stageID?._id || '',
        kwpInterested: leadInformation?.kwpInterested || '',
        email: leadInformation?.email || '',
        selectedFieldSales: '',
        remark: (leadInformation?.stageActivity[leadInformation?.stageActivity?.length - 1])?.remark || '',
        address: leadInformation?.address || '',
        electricitybill: electricitybill || '',
        state: leadInformation?.state || '',
        proposalpdf: file || '',
        location: location || '',
    });

    const handleOnInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    }
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: parseFloat(position.coords.latitude),
                        longitude: parseFloat(position.coords.longitude),
                    });
                },
                (error) => {
                    setError(error.message);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    }, []);

    const handleFile = (event) => {
        const selectFile = event.target.files[0];
        if (selectFile && selectFile.type === "application/pdf") {
            setFile(selectFile);
        } else {
            alert("Please Upload a valid PDF file");
        }
    }




    const handleBill = (event) => {
        const selectBill = event.target.files[0];
        if (selectBill) {
            // console.log("electricBill: ",selectBill);

            // Check if the file type is an image
            const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

            if (allowedTypes.includes(selectBill.type)) {
                setElectrictybill(selectBill);
            } else {
                alert("enter vaild bill that type is png , jpeg ,jpg");
            }
        }
    }
    // console.log("electricBill: ",electricitybill);


    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_URL}/field/showState`);
                setStates(response.data.states); // Ensure this matches the API response structure
            } catch (error) {
                console.error("Error fetching states:", error);
            }
        };
        fetchStates();
    }, []);

    const assignEmp = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_URL}/client/FetchAssignemployee`, {
                Statename: formData.state
            }
            );
            setEmpAssign(response?.data?.data);
        } catch (error) {
            console.error("Error assigning employee:", error);
        }
    };
    useEffect(() => {
        if (
            // (formData.stageID === showStages[3]._id || formData.stageID === showStages[6].stage) &&
            formData.state && formData.state !== "N/A"
        ) {
            assignEmp();
        } else {
            setEmpAssign([]); // Clear employee list if stage changes
        }
    }, [formData.stageID, formData.state]);


    const onSubmitLeadUpdateForm = async (event) => {
        event.preventDefault();
        const formDataToSend = new FormData();
        for (const key in formData) {
            // formDataToSend.append(key, formData[key]);
            if (formData[key]) { // Only add non-empty values
                formDataToSend.append(key, formData[key]);
            }

        }
        if (electricitybill) {
            formDataToSend.append('electricitybill', electricitybill);
        }
        if (file) {
            formDataToSend.append('proposalpdf', file);
        }

        console.log("formDataToSend ", formDataToSend);

        try {
            console.log("form data : ", formData);

            const response = await updateLeadApi(formDataToSend, closeForm);
            console.log("response data : ", response);
            setUpdateLeadBtnClicked(true);
        } catch (error) {
            console.error("Error updating lead:", error);
        }
    }


    useEffect(() => {
        showStageApi(true, setShowStages);
        showStageApi(true, setShowAllStages);
        showEmployeeApi(setShowFieldSalesMan, pageCount, leadInformation?._id, '');
    }, [pageCount, leadInformation?._id]);


    const [isOpenWhatsapp, setIsOpenWhatsapp] = useState(false);
    const handleWhatsApp = () => {
        setIsOpenWhatsapp(true);
    }

    const stopRemaindering = async (event) => {
        const clientID =  leadInformation?._id;
        console.log("clientID: ", clientID);
        try {
             await axios.post(`${process.env.REACT_APP_URL}/client/stopWhatapp`, { clientID:leadInformation?._id});
            alert("Reminder stop successfully!");
        } catch (error) {
            console.log("Error sending data:", error);
            alert("Failed to stop reminder. Check console for details.");
        }
    }



    return (
        <section style={showForm ? { ...Style.updateLeadContainer, animation: 'slideUp 0.5s ease forwards' } : Style.updateLeadContainer}>
            <IoClose size={35} color='#AA0B2B' style={{ ...Style.closeFormBtn, transform: isHoveredOnClose ? 'rotate(90deg)' : 'rotate(0deg)' }} onMouseOver={() => setIsHoveredOnClose(true)} onMouseOut={() => setIsHoveredOnClose(false)} onClick={() => closeForm({ clicked: false })} />
            <div style={Style.updateLeadInfoContainer}>
                <div style={Style.showOnlyDetailsContainer}>
                    <div style={Style.leadLogoContainer}>
                        <p style={Style.leadLogo}></p>
                    </div>
                    <div style={Style.leadInfoContainer}>
                        <div style={Style.leadInfo}>
                            <span style={Style.leadInfoText}>Name: {leadInformation?.name}</span>
                            <span style={Style.leadInfoText}>Mobile: {leadInformation?.mobile}</span>
                            <span style={Style.leadInfoText}>Email: {leadInformation?.email ? leadInformation?.email : 'N/A'}</span>
                        </div>
                        <div style={Style.leadInfo}>
                            <div style={Style.inputFieldContainer}>
                                <label htmlFor="state" style={Style.inputLabel}>State</label>

                                {/* Show dropdown only if state is "N/A" */}
                                {leadInformation?.state === "N/A" ? (
                                    <select
                                        style={Style.inputField}
                                        name="state"
                                        id="state"
                                        value={formData?.state}
                                        onChange={(event) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                state: event.target.value
                                            }));
                                        }}
                                    >
                                        <option value="">Select a State</option>
                                        {states.map((state) => (
                                            //  console.log("state: ",state),
                                            <option key={state._id} value={state?.state}>{state?.state}</option>
                                        ))}
                                    </select>
                                ) : (
                                    // If state exists, display it as non-editable text
                                    <p>{leadInformation?.state}</p>
                                )}
                            </div>

                            <span style={Style.leadInfoText}>District: {leadInformation?.district ? leadInformation?.district : 'N/A'}</span>
                            <span style={Style.leadInfoText}>City: {leadInformation?.city ? leadInformation?.city : 'N/A'}</span>
                        </div>
                        <div style={Style.leadType}>
                            <img src={leadInformation?.type === 1 ? Hot : leadInformation?.type === 2 ? Warm : Cold} alt={leadInformation?.type === 1 ? 'Hot' : leadInformation?.type === 2 ? 'Warm' : 'Cold'} />
                        </div>
                        <div>
                            <button style={Style.whatsappBtn} onClick={handleWhatsApp} >WhatsApp</button>
                            {
                                isOpenWhatsapp && (
                                    <Whatsapp
                                        data={leadInformation}
                                        showWhatsappForm={isOpenWhatsapp}
                                        closeForm={setIsOpenWhatsapp}
                                    />
                                )
                            }
                        </div>
                        <div>
                            <button style={Style.whatsappBtn} onClick={stopRemaindering} >Stop Remainder</button>
                        </div>

                    </div>
                </div>
            </div>
            <div style={Style.formContainer}>
                <form method='POST' action="" style={Style.updateForm} onSubmit={onSubmitLeadUpdateForm}>
                    <div style={Style.leftFormFieldContainer}>
                        <div style={Style.inputFieldContainer}>
                            <label htmlFor="kwp" style={Style.inputLabel}>KWP</label>
                            <input style={Style.inputField} type="text" name="kwpInterested" id="kwp" onChange={handleOnInputChange} autoComplete='off' />
                        </div>
                        <div style={Style.inputFieldContainer}>
                            <label htmlFor="types" style={Style.inputLabel}>Types</label>
                            <select
                                style={Style.inputField}
                                name="types" id="types"
                                onChange={(event) => {
                                    setFormData((previousData) => ({ ...previousData, type: parseInt(event.target.value) }));
                                }}
                            >
                                <option value='1'>High Priority</option>
                                <option value='2'>Medium</option>
                                <option value='3'>Low Priority</option>
                            </select>
                        </div>
                        <div style={Style.inputFieldContainer}>
                            <label htmlFor="email" style={Style.inputLabel}>Email ID</label>
                            <input style={Style.inputField} type="text" name="email" id="email" onChange={handleOnInputChange} autoComplete='off' />
                        </div>
                        <div>
                            <label htmlFor="address" style={Style.inputLabel}>Address</label>
                            <textarea style={Style.inputField} name="address" id="address" cols={45} rows={5} placeholder='Enter Your Address' onChange={handleOnInputChange}></textarea>
                        </div>
                        <div>
                            <label htmlFor="electricitybill" style={Style.inputLabel}>Enter Electric Bill</label>
                            <input type="file" name='electricitybill' id='electricitybill' onChange={handleBill} accept="image/*" />
                            {electricitybill && <p>Selected File: {electricitybill.name}</p>}
                        </div>
                        <div>
                            <button type="submit" style={Style.updateBtn}>Update</button>
                        </div>
                    </div>
                    <hr style={{ width: '0.166rem', border: 'none', height: '92%', alignSelf: 'flex-end', backgroundColor: '#AA0B2B' }} />

                    <div style={Style.rightForm}>
                        <div style={Style.inputFieldContainer}>
                            <label htmlFor="stage" style={Style.inputLabel}>Stage</label>
                            <select
                                style={Style.inputField}
                                name="stage" id="stage"
                                onChange={(event) => {
                                    const store = [...event.target.value].join('').split(',');
                                    setFormData((previousData) => ({ ...previousData, stageID: store[0] }));
                                }}
                            >
                                {
                                    !BooleanShowAllStages ? showStages.map(({ _id, stage }, index) => (
                                        index >= (leadInformation?.stageID?.stageValue - 1) && <option key={_id} value={[_id, index]}>{stage}</option>
                                    )) : showAllStages.map(({ _id, stage }) => (
                                        <option key={_id} value={_id}>{stage}</option>
                                    ))
                                }
                            </select>
                        </div>
                        {(formData.stageID.toString() == "66e15efc774c6b5fb4ab6277" || formData?.stageID?.toString() == "66e1622c774c6b5fb4ab6285") && <div style={Style.inputFieldContainer}>
                            <label htmlFor="assign" style={Style.inputLabel}>Assign Employee</label>
                            <select
                                style={Style.inputField}
                                name="assignEmp" id="assignEmp"
                                onChange={(event) => {
                                    setFormData((previousData) => ({ ...previousData, selectedFieldSales: event.target.value }));
                                }}
                            >
                                {/* {console.log("dksgjhk",showStages[3].stage)}
                            {console.log("dksgjhk",showStages[6].stage)} */}
                                <option value="">Select an Employee</option>
                                {
                                    empAssign.map((item) => (
                                        <option key={item._id} value={item._id}>{item.name}</option>
                                    ))
                                }
                            </select>
                        </div>}
                        <div style={Style.inputFieldContainer}>
                            <label htmlFor="date" style={Style.inputLabel}>{(formData.stageID === 7 ? 'Revisit Date' : (formData.stageID === 3 ? 'Follow-Up Date' : 'Visiting Date'))}</label>
                            <input style={Style.inputField} type="date"
                                name={(formData.stageID === 7 ? 'revisitDate' : (formData.stageID === 3 ? 'followUpDate' : 'visitingDate'))}
                                id="date"
                                onChange={handleOnInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="location" style={Style.inputLabel}>Enter Your Location (latitude,longitude)</label>
                            <input
                                type="text"
                                placeholder="Enter your city..."
                                onChange={(event) => {
                                    setFormData((previous) => ({ ...previous, location: event.target.value }));
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="proposalpdf" style={Style.inputLabel}>Enter Your Proposal</label>
                            <input type="file" name="proposalpdf" id="proposalpdf" accept='application/pdf' style={Style.inputField} onChange={handleFile} />
                            {file && <p>Selected File: {file.name}</p>}
                        </div>
                        <div style={Style.inputFieldContainer}>
                            <label htmlFor="remark" style={Style.inputLabel}>Remark</label>
                            <input style={Style.inputField} type="text" name="remark" id="remark" value={formData.remark} onChange={handleOnInputChange} />
                        </div>
                    </div>
                </form>
                <div style={Style.stagesMainContainer}>
                    <div style={Style.stagesContainer}>
                        {
                            showAllStages.map(({ _id, stage }, index) => (
                                <div key={_id} style={Style.eachStageContainer}>
                                    <span style={{
                                        ...Style.eachStageCircle,
                                        borderColor: formData.stageID === _id ? '#4FE081' : '#AA0B2B'
                                    }}></span>
                                    <span>{stage}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default memo(Index);

