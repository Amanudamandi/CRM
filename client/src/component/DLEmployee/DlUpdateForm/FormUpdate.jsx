import React, { useEffect, useState } from 'react'
import { showStageApi } from '../../../Utils/showStagesAPI';
import { IoClose } from 'react-icons/io5';
import { DLShowEmployee } from '../../../Utils/DLShowEmployee';
import axios from 'axios';


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


    const [formData, setFormData] = useState({
        clientID: leadData?._id,
        name: leadData?.name || '',
        mobile: leadData?.mobile || '',
        email: leadData?.emial || '',
        stageID: leadData?.stageID?.stage || '',
        stateID: leadData?.stateID?.state || '',
        district: leadData?.district || '',
        type: leadData?.type || '',
        source: leadData?.source || ''

    })

    // console.log("formData: ", formData);


    const handleOnInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    }





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
                                        value={formData.stateID}
                                        onChange={(event) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                stateID: event.target.value
                                            }))
                                        }}
                                        
                                    >
                                        <option value="">Select a State</option>
                                        {states?.map((state) => (
                                            console.log("state : ",state),
                                            <option key={state._id} value={state.state}>{state.state}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <p>{leadData?.stateID?.state}</p>
                                )}

                                <span style={Style.leadInfoText}>District: {leadData?.district ? leadData.district : 'N/A'}</span>
                            </div>
                        </div>





                    </div>
                </div>
            </div>



        </section>
    )
}

export default FormUpdate