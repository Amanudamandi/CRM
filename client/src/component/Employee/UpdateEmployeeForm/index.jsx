import React, { useEffect } from 'react';
import { memo } from 'react';
import { useState } from 'react';
import Hot from '../../../Assest/Images/hot.png';
import Warm from '../../../Assest/Images/warm.png';
import Cold from '../../../Assest/Images/cold.png';
import { IoClose } from "react-icons/io5";
import { showStageApi } from '../../../Utils/showStagesAPI';
import { showEmployeeApi } from '../../../Utils/showEmployeeAPI';
import { updateLeadApi } from '../../../Utils/updateLeadFormAPI';

const Index = ({ showForm, leadInformation, closeForm, pageCount, BooleanShowAllStages = false, setUpdateLeadBtnClicked }) => {
    console.log("LeadInformation sended", leadInformation);
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

    const copyStageValue = leadInformation.stageID.stageValue;
    const [isHoveredOnClose, setIsHoveredOnClose] = useState(false);
    const [showAllStages, setShowAllStages] = useState([]);
    const [showStages, setShowStages] = useState([]);
    const [showFieldSalesMan, setShowFieldSalesMan] = useState([]);
    const [updateLeadInfo, setUpdateLeadInfo] = useState({
        type: leadInformation.type,
        selectedStage: { _id: leadInformation.stageID._id, stageIndex: leadInformation.stageID.stageValue },
    });

    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        clientID: leadInformation._id,
        revisitDate: leadInformation?.revisitDate || '',
        visitingDate: leadInformation?.visitingDate || '',
        followUpDate: leadInformation?.followUpDate || '',
        assignEmp: leadInformation?.assignEmp || '',
        type: leadInformation.type,
        stageID: leadInformation.stageID._id,
        kwpInterested: leadInformation.kwpInterested,
        email: leadInformation.email,
        selectedFieldSales: '',
        remark: (leadInformation.stageActivity[leadInformation.stageActivity.length - 1])?.remark || '',
        address: leadInformation.address,
        electricBil: leadInformation.electricBil,
        state: leadInformation.state,
        location:location
    }); 



    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
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


    const handleOnInputChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value);
        setFormData((previous) => ({ ...previous, [name]: value }));
    }

    const dateObj = (newDate) => {
        const convertDate = new Date(newDate);
        return `${convertDate.getFullYear()}-${convertDate.getMonth() + 1}-${convertDate.getDate()}`;
    }

    const onSubmitLeadUpdateForm = (event) => {
        event.preventDefault();
        console.log("form data fetched when we upload ", formData);
        console.log("final lead updated : ", updateLeadInfo.selectedStage.stageIndex);
        if (updateLeadInfo.selectedStage.stageIndex === 3) {
            const { clientID, type, stageID, kwpInterested, email, remark, followUpDate, address, electricBil, state ,location } = formData;
            updateLeadApi({ clientID, type, stageID, kwpInterested, email, remark, followUpDate, address, electricBil, state ,location}, closeForm).then(() => {
                // if (!setUpdateLeadBtnClicked)
                setUpdateLeadBtnClicked(true);
            });
        }
        else if (updateLeadInfo.selectedStage.stageIndex === 4) {
            const { clientID, type, stageID, kwpInterested, email, remark, visitingDate, address, electricBil, state,location } = formData;
            updateLeadApi({ clientID, type, stageID, kwpInterested, email, remark, visitingDate, address, electricBil, state,location }, closeForm).then(() => {
                // if (!setUpdateLeadBtnClicked)
                setUpdateLeadBtnClicked(true);
            });
        }
        else if (updateLeadInfo.selectedStage.stageIndex === 7) {
            const { clientID, type, stageID, kwpInterested, email, remark, revisitDate, address, electricBil, state } = formData;
            updateLeadApi({ clientID, type, stageID, kwpInterested, email, remark, revisitDate, address, electricBil, state,location }, closeForm).then(() => {
                // if (!setUpdateLeadBtnClicked)
                setUpdateLeadBtnClicked(true);
            });
        }
        else {
            const { clientID, type, stageID, kwpInterested, email, remark, address, electricBil, state } = formData;
            updateLeadApi({ clientID, type, stageID, kwpInterested, email, remark, address, electricBil, state,location }, closeForm).then(() => {
                // if (!setUpdateLeadBtnClicked)
                setUpdateLeadBtnClicked(true);
            });
        }
    }

    useEffect(() => {
        console.log("Form Data sended: ", formData);
        let isMounted = true;
        showStageApi(isMounted, setShowStages);
        return () => {
            isMounted = false;
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        showStageApi(isMounted, setShowAllStages);
        return () => {
            isMounted = false;
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        if (isMounted)
            showEmployeeApi(setShowFieldSalesMan, pageCount, leadInformation._id, '');
        return () => {
            isMounted = false;
        }
    }, []);

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
                            <span style={Style.leadInfoText}>Name: {leadInformation.name}</span>
                            <span style={Style.leadInfoText}>Mobile: {leadInformation.mobile}</span>
                            <span style={Style.leadInfoText}>Email: {leadInformation.email ? leadInformation.email : 'N/A'}</span>
                        </div>
                        <div style={Style.leadInfo}>
                            <span style={Style.leadInfoText} value={leadInformation.state}>State: {leadInformation.state ? leadInformation.state : 'N/A'}</span>
                            <span style={Style.leadInfoText}>District: {leadInformation.district ? leadInformation.district : 'N/A'}</span>
                            <span style={Style.leadInfoText}>City: {leadInformation.city ? leadInformation.city : 'N/A'}</span>
                        </div>
                        <div style={Style.leadType}>
                            <img src={updateLeadInfo.type === 1 ? Hot : updateLeadInfo.type === 2 ? Warm : Cold} alt={updateLeadInfo.type === 1 ? 'Hot' : updateLeadInfo.type === 2 ? 'Warm' : 'Cold'} />
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
                                    setUpdateLeadInfo((previousData) => ({ ...previousData, type: parseInt(event.target.value) }));
                                    setFormData((previousData) => ({ ...previousData, type: parseInt(event.target.value) }))
                                    console.log(parseInt(event.target.value), typeof (type));
                                }}
                            >
                                <option value='1' selected={updateLeadInfo.type === 1 ? true : false}>High Priority</option>
                                <option value='2' selected={updateLeadInfo.type === 2 ? true : false}>Medium</option>
                                <option value='3' selected={updateLeadInfo.type === 3 ? true : false}>Low Priority</option>
                            </select>
                        </div>
                        <div style={Style.inputFieldContainer}>
                            <label htmlFor="email" style={Style.inputLabel}>Email ID</label>
                            <input style={Style.inputField} type="text" name="email" id="email" onChange={handleOnInputChange} autoComplete='off' />
                        </div>

                        {/* adding address field */}

                        <div>
                            <label htmlFor="address" style={Style.inputLabel}>Address</label>
                            <textarea style={Style.inputField} name="address" id="address" cols={45} rows={5} placeholder='Enter Your Address' onChange={(e) => {
                                setUpdateLeadInfo((previous) => (
                                    { ...previous, address: (e.target.value) }
                                ));
                                setFormData((previous) => ({
                                    ...previous,
                                    address: (e.target.value),
                                }
                                ));
                                console.log("address: ", e.target.value)

                            }} ></textarea>
                        </div>
                        <div>
                            <label htmlFor="electricBil" style={Style.inputLabel}>Enter Electric Bil</label>
                            <input type="file" name='electricBil' id='electricBil' onChange={(e) => (
                                setUpdateLeadInfo((previous) => (
                                    { ...previous, electricBil: e.target.files }
                                )),
                                setFormData((previous) => (
                                    {
                                        ...previous,
                                        electricBil: e.target.files
                                    }
                                )),
                                console.log("electric bill : ", e.target.files)
                            )} />
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
                                    console.log(store);
                                    setUpdateLeadInfo((previousData) => ({ ...previousData, selectedStage: { _id: store[0], stageIndex: parseInt(store[1]) + 1 } }))
                                    setFormData((previousData) => ({ ...previousData, stageID: store[0] }))
                                }}
                            >
                                {
                                    !BooleanShowAllStages ? showStages.map(({ _id, stage }, index) => (
                                        index >= (leadInformation.stageID.stageValue - 1) && <option key={_id} value={[_id, index]} selected={formData.stageID === _id ? true : false}>{stage}</option>
                                    )) : showAllStages.map(({ _id, stage }, index) => (
                                        <option key={_id} value={[_id, index]} selected={formData.stageID === _id ? true : false} >{stage}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div style={Style.inputFieldContainer}>
                            <label htmlFor="assign" style={Style.inputLabel}>Assign Employee</label>
                            <select
                                style={Style.inputField}
                                name="assign" id="assign"
                                onChange={(event) => {
                                    setUpdateLeadInfo((previousData) => ({ ...previousData, selectedFieldSales: event.target.value }));
                                    setFormData((previousData) => ({ ...previousData, selectedFieldSales: event.target.value }));
                                    console.log(event.target.value);
                                }}
                                disabled={updateLeadInfo.selectedStage.stageIndex === 4 || updateLeadInfo.selectedStage.stageIndex === 7 ? false : true}
                            >
                                {
                                    showFieldSalesMan.map(({ _id, name }) => (
                                        <option key={_id} value={_id}>{formData.assignEmp !== null ? name : 'Select the Field Man'}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div style={Style.inputFieldContainer}>
                            <label htmlFor="date" style={Style.inputLabel}>{(updateLeadInfo.selectedStage.stageIndex) === 7 ? 'Revisit Date' : (updateLeadInfo.selectedStage.stageIndex) === 3 ? 'Follow-Up Date' : 'Visiting Date'}</label>
                            <input style={Style.inputField} type="date"
                                name={(updateLeadInfo.selectedStage.stageIndex) === 7 ? 'revisitDate' : (updateLeadInfo.selectedStage.stageIndex) === 3 ? 'followUpDate' : 'visitingDate'}
                                id="date" value={(updateLeadInfo.selectedStage.stageIndex) === 3 ? dateObj(formData.followUpDate) : (updateLeadInfo.selectedStage.stageIndex) === 4 ? dateObj(formData.visitingDate) : (updateLeadInfo.selectedStage.stageIndex) === 7 ? dateObj(formData.revisitDate) : ''}
                                disabled={updateLeadInfo.selectedStage.stageIndex === 4 || updateLeadInfo.selectedStage.stageIndex === 3 || updateLeadInfo.selectedStage.stageIndex === 7 ? false : true}
                                onChange={handleOnInputChange}
                            />
                        </div>
                        <div style={Style.inputFieldContainer}>
                            <label htmlFor="remark" style={Style.inputLabel}>Remark</label>
                            <input style={Style.inputField} type="text" name="remark" id="remark" value={formData.remark} onChange={handleOnInputChange} />
                        </div>

                        <div>
                            <label htmlFor="location" style={Style.inputLabel}>Enter Your Location (latitude,longitude)</label>
                                <div>
                            <input
                                type="text"
                                placeholder="Enter your city..."
                                    onChange={(event)=>(
                                        setLocation({ city: event.target.value }),
                                        setUpdateLeadInfo((previous)=>({
                                            ...previous, location 
                                            :event.target.value,
                                        })),
                                        setFormData((previous)=>({
                                            ...previous,location:event.target.value
                                        }))
                                    )}
                            />
                            </div>

                        </div>
                    </div>
                </form>
                <div style={Style.stagesMainContainer}>
                    <div style={Style.stagesContainer} >
                        {
                            showAllStages.map(({ _id, stage }, index) => (
                                <div key={_id} style={Style.eachStageContainer}>
                                    <span style={
                                        {
                                            ...Style.eachStageCircle,
                                            borderColor: updateLeadInfo.selectedStage.stageIndex === (index + 1) ? '#4FE081' : '#AA0B2B'
                                        }}>
                                    </span>
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