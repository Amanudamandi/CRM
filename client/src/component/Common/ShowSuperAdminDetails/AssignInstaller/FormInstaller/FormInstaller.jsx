import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5';

const FormInstaller = ({ info, showForm, closeForm }) => {
    // console.log("info : ",info)
    const Style = {
        updateLeadContainer: { position: 'fixed', width: '75%', height: '92vh', margin: '0rem 1rem 0rem 8.2rem', padding: '3.5rem 1rem', backgroundColor: '#fff', top: '50%', left: '50%', zIndex: '9999', boxShadow: '0px 0px 2px black', borderRadius: '8px', overflow: 'auto', transform: 'translate(-50%, -50%)' },
        closeFormBtn: { position: 'absolute', top: '1rem', right: '1rem', cursor: 'pointer', transition: 'transform 0.4s ease' },
        updateLeadInfoContainer: { margin: 'auto', width: '85%', borderBottom: '3px solid #AA0B2B' },
        showOnlyDetailsContainer: { display: 'flex', backgroundColor: 'rgba(217, 217, 217, 0.35)', gap: '8px', borderRadius: '5px' },
        leadLogoContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#AA0B2B', width: '4.5rem', height: '4rem', borderTopLeftRadius: '5px' },
        leadLogo: { color: '#fff', fontSize: '2.5rem', fontWeight: 800, textAlign: 'center' },
        leadInfoContainer: { width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 4rem', padding: '4px 0px', },
        leadInfo: { display: 'flex', flexDirection: 'column', justifyContent: 'space-around' },
        leadInfoText: { letterSpacing: '0.75px' },
        leadType: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        formContainer: { margin: 'auto', width: '85%', display: 'grid', gridTemplateColumns: '2fr 15rem', gap: '12px' },
        updateForm: { display: 'grid', gridTemplateColumns: "1fr 1fr", gap: '16px', padding: '1.5rem 0rem', margin: "15px" },
        updateBtn: { width: '100%', padding: '0.5rem 1rem', backgroundColor: '#AA0B2B', border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer', fontSize: "15px" },
        leftFormFieldContainer: {},
        inputFieldContainer: { marginBottom: '1rem' },
        inputLabel: { display: 'block', width: 'fit-content', marginBottom: '0.2rem', fontWeight: 600 },
        inputField: { width: '100%', borderColor: '#000', padding: '0.5rem', borderRadius: '5px' },
        stagesMainContainer: { backgroundColor: 'rgba(217, 217, 217, 35%)', padding: '2.5rem 1.8rem' },
        stagesContainer: { height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', borderLeft: '2px solid #AA0B2B' },
        eachStageContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
        eachStageCircle: { width: '0.75rem', border: '2px solid #AA0B2B' },
    };
    const [isHoveredOnClose, setIsHoveredOnClose] = useState(false);

    let [emp, setEmp] = useState([]);
    const fetchInstaller = async () => {
        try {
            const responseData = await axios.get(`${process.env.REACT_APP_URL}/ins/fetchAllIns`);
            let response = await responseData?.data;
            // console.log("installer : ", response)
            setEmp(response?.data);
        } catch (error) {
            console.log("Not fetching installer successfully...");
        }
    }

    useEffect(() => {
        fetchInstaller();
    }, [])

    //  console.log("employee list : ",emp);

    const [empAssign, setEmpAssign] = useState({
        clientId: info,
        installerId: ""
    });

    console.log("empAssign", empAssign)

    const handleOnChange = (event) => {
        const { name, value } = event.target
        setEmpAssign((prev) => ({
            ...prev, [name]: value
        }))
    }




    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const sendRequest = await axios.post(`${process.env.REACT_APP_URL}/ins/assignIns`, empAssign);
            const response = await sendRequest.data;
            alert("Installer assign successfully");

            closeForm(false)
        } catch (error) {
            alert("Installer not assign successfully,please check the console....");
            console.error(error);
        }
    }

    return (
        <section style={showForm ? { ...Style.updateLeadContainer, animation: 'slideUp 0.5s ease forwards' } : Style.updateLeadContainer}>
            <IoClose size={35} color='#AA0B2B' style={{ ...Style.closeFormBtn, transform: isHoveredOnClose ? 'rotate(90deg)' : 'rotate(0deg)' }} onMouseOver={() => setIsHoveredOnClose(true)} onMouseOut={() => setIsHoveredOnClose(false)} onClick={() => closeForm(false)} />

            <h2 style={Style.leadInfoContainer}>Assign Installer Employee  </h2>
            <form method='POST' style={Style.updateForm} onSubmit={handleSubmit} >
                <div style={Style.main}>


                    <div style={Style.inputFieldContainer}>
                        <label htmlFor="installer" style={Style.inputLabel}> Installer Employee List  : </label>
                        <select style={Style.inputField} name="installerId" id="installer" onChange={handleOnChange} >
                            <option value="">Select Employee Assign</option>
                            {emp.map((employee) => (
                                // console.log("emp",employee);
                                <option value={employee?._id}> {employee?.name} </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button type="submit" style={Style.updateBtn}>Assign Installer </button>
                    </div>
                </div>
            </form>
        </section>
    )
}

export default FormInstaller

