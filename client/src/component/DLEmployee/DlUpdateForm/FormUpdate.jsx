import React, { useEffect, useState } from 'react'
import { showStageApi } from '../../../Utils/showStagesAPI';
import { IoClose } from 'react-icons/io5';
import { DLShowEmployee } from '../../../Utils/DLShowEmployee';
import axios from 'axios';
import Hot from '../../../Assest/Images/hot.png';
import Warm from '../../../Assest/Images/warm.png';
import Cold from '../../../Assest/Images/cold.png';

import { UpdateDealerEmployeeLeadForm } from '../../../Utils/UpdateDealerEmployeeLeadForm';



const FormUpdate = ({ showForm, leadData, onClose, pageCount, BooleanShowAllStages = false, setUpdateLeadBtnClicked }) => {

    const Style = {
        updateLeadContainer: { position: 'fixed', width: '75%', height: '92vh', margin: '0rem 1rem 0rem 8.2rem', padding: '3.5rem 1rem', backgroundColor: '#fff', top: '50%', left: '50%', zIndex: '9999', boxShadow: '0px 0px 2px black', borderRadius: '8px', overflow: 'auto', transform: 'translate(-50%, -50%)' },
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
        eachStageCircle: { width: '0.75rem', border: '2px solid #AA0B2B' }
    };
    const [isHoveredOnClose, setIsHoveredOnClose] = useState(false);
    const [showAllStages, setShowAllStages] = useState([]);
    const [showStages, setShowStages] = useState([]);
    const [showFieldSalesMan, setShowFieldSalesMan] = useState([]);

    const [states, setStates] = useState([]);

    const [showOtherInput, setShowOtherInput] = useState(false);
    const [otherValue, setOtherValue] = useState("");
    const [file, setFile] = useState(null);

    console.log("lead data",leadData);


    const [formData, setFormData] = useState({
        clientID: leadData?._id,
        name: leadData?.name || '',
        mobile: leadData?.mobile || '',
        email: leadData?.emial || '',
        stageID: leadData?.stageID?._id || '',
        state: leadData?.stateID?.state || '',
        district: leadData?.district || '',
        type: leadData?.type || '',
        source: leadData?.source || '',
        interstedIn: '',
        Document: file || '',
        other: otherValue,
        empId: leadData?.empID?._id

    })

    console.log("formData: ", formData);


    const handleOnInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    }

    const handleFile = (event) => {
        const selectFile = event.target.files[0];
        if (selectFile && selectFile.type === "application/pdf") {
            setFile(selectFile);
            // setFormData((prev) => ({ ...prev, Document: selectFile }));
        } else {
            alert("Please Upload a valid PDF file");
        }
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        let formDataToSend = new FormData();
        // console.log('Original FormData', formData);
        for (const key in formData) {
            if (formData[key]) {
                // console.log('key by Prince', key, formData[key]);
                formDataToSend.append(key, formData[key]);
            }
        }
        if (file) {
            formDataToSend.append("Document", file);
        }

        // console.log('Update Form Data by Prince', formDataToSend);
        // console.log([...formDataToSend.entries()]);

        try {
            const response = await UpdateDealerEmployeeLeadForm({ updateLeadData: formDataToSend, onClose });
            console.log("data response  ", response)
            setUpdateLeadBtnClicked(true);

        } catch (error) {
            console.log(error);
        }
    }
    console.log("form data ", formData);





    useEffect(() => {
        const fetchState = async () => {
            const response = await axios.get(`${process.env.REACT_APP_URL}/field/showState`);
            const responseData = await response.data;
            //    console.log("state : ",responseData.states);
            setStates(responseData.states);
        }
        fetchState();
    }, [])


    useEffect(() => {
        showStageApi(true, setShowStages);
        showStageApi(true, setShowAllStages);
        DLShowEmployee(setShowFieldSalesMan, pageCount, leadData?._id, '');
    }, [pageCount, leadData?._id]);


    return (
        <section style={showForm ? { ...Style.updateLeadContainer, animation: 'slideUp 0.5s ease forwards' } : Style.updateLeadContainer}>

            <IoClose size={35} color='#AA0B2B' style={{ ...Style.closeFormBtn, transform: isHoveredOnClose ? 'rotate(90deg)' : 'rotate(0deg)' }} onMouseOver={() => setIsHoveredOnClose(true)} onMouseOut={() => setIsHoveredOnClose(false)} onClick={() => onClose({ clicked: false })} />

            <div style={Style.updateLeadInfoContainer}>
                <div style={Style.showOnlyDetailsContainer}>
                    <div style={Style.leadLogoContainer}>
                        <p style={Style.leadLogo}></p>
                    </div>
                    <div style={Style.leadInfoContainer}>
                        <div style={Style.leadInfo}>
                            <span style={Style.leadInfoText}>Name: {leadData?.name}</span>
                            <span style={Style.leadInfoText}>Mobile: {leadData?.mobile}</span>
                            <span style={Style.leadInfoText}>Email: {leadData?.email ? leadData?.email : 'N/A'}</span>
                        </div>

                        <div style={Style.leadInfo}>
                            <div style={Style.inputFieldContainer}>
                                <label htmlFor="state" style={Style.inputLabel}>State</label>

                                {!leadData?.stateID || leadData?.stateID?.state === "N/A" ? (
                                    <select style={Style.inputField}
                                        name="state"
                                        id="state"
                                        value={formData.state}
                                        onChange={(event) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                state: event.target.value
                                            }))
                                        }}

                                    >
                                        <option value="">Select a State</option>
                                        {states?.map((state) => (
                                            // console.log("state : ", state),
                                            <option key={state._id} value={state.state}>{state.state}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <p>{leadData?.stateID?.state}</p>
                                )}

                                <span style={Style.leadInfoText}>District: {leadData?.district ? leadData.district : 'N/A'}</span>
                            </div>
                        </div>
                        <div style={Style.leadType}>
                            <img src={leadData.type === 1 ? Hot : leadData.type === 2 ? Warm : Cold} alt={leadData.type === 1 ? 'Hot' : leadData.type === 2 ? 'Warm' : 'Cold'} />
                        </div>
                    </div>
                </div>
            </div>

            <div style={Style.formContainer}>
                <form method='POST' style={Style.updateForm} onSubmit={handleSubmit} >

                    <div style={Style.leftFormFieldContainer}>
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

                        <div style={Style.inputFieldContainer}>
                            <label htmlFor="Document" style={Style.inputLabel}>Proposal</label>
                            <input type="file" name="Document" id="Document" accept='application/pdf' style={Style.inputField} onChange={handleFile} />
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
                                        index >= (leadData.stageID.stageValue - 1) && <option key={_id} value={[_id, index]}>{stage}</option>
                                    )) : showAllStages.map(({ _id, stage }) => (
                                        <option key={_id} value={_id}>{stage}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div style={Style.inputFieldContainer}>
                            <label htmlFor="date" style={Style.inputLabel}>{(formData.stageID === 7 ? 'Revisit Date' : (formData.stageID === 3 ? 'Follow-Up Date' : 'Visiting Date'))}</label>
                            <input style={Style.inputField} type="date"
                                name={(formData.stageID === 7 ? 'revisitDate' : (formData.stageID === 3 ? 'followUpDate' : 'visitingDate'))}
                                id="date"
                                onChange={handleOnInputChange}
                            />
                        </div>

                        <div style={Style.inputFieldContainer}>
                            <label htmlFor="interstedIn" style={Style.inputLabel}>Intersted In </label>

                            <select name="interstedIn" id="interstedIn" style={Style.inputField}
                                onChange={(event) => {
                                    const selectedValue = parseInt(event.target.value);
                                    setFormData((previousData) => ({ ...previousData, interstedIn: selectedValue }));
                                    setShowOtherInput(selectedValue === 6)
                                }}>
                                <option >Select Intersted In</option>
                                <option value="1">Channel Partner</option>
                                <option value="2"> Distributor</option>
                                <option value="3">DealerShip</option>
                                <option value="4">Franchise</option>
                                <option value="5">Agent</option>
                                <option value="6">Other</option>
                            </select>
                        </div>

                        {/* Show Input Field If "Other" is Selected */}
                        {showOtherInput && (
                            <div style={Style.inputFieldContainer}>
                                <label htmlFor="otherInterest" style={Style.inputLabel}>Specify Other</label>
                                <input
                                    type="text"
                                    name="otherInterest"
                                    id="otherInterest"
                                    placeholder="Please specify..."
                                    value={otherValue}
                                    onChange={(e) => {
                                        setOtherValue(e.target.value);
                                        setFormData((prev) => ({
                                            ...prev, other: e.target.value
                                        }))
                                    }}

                                />
                            </div>
                        )}

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

export default FormUpdate