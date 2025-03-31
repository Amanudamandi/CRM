import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import DynamicDropDown from '../../DropDown2/index';

const UpdateDealer = () => {
    const Styles = {
        topText: { borderRadius: '5px', height: '2rem', border: '2px solid #BBB8B8' },
        submitBtnForTL: {},
        inputBottomMargin: { marginBottom: '1rem' }
    }

    const navigate = useNavigate();
    const dynamicData = useLocation();
    const oldData = dynamicData?.state;
    console.log("old data fetch ", oldData);

    const [formData, setFormData] = useState({
        name: oldData?.name,
        mobile: oldData?.mobile,
        teamLeader: oldData?.teamLeader?.name,
        state: oldData?.stateID.state

    })

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const [teamLeaderList, setTeamLeaderList] = useState(null);
    const [teamLeaderId, setTeamLeaderId] = useState(null);
    const [selectedTeamLeader, setSelectedTeamLeader] = useState(null);
    const [isTeamLeaderOpen, setIsTeamLeaderOpen] = useState(null);
    const [stateNames, setStateNames] = useState([]);
    const [currentStateStatus, setCurrentStateStatus] = useState(new Array(stateNames.length).fill(0));

    const setDefaultTeamLeader = (value, id) => {
        setTeamLeaderId(id);
        setSelectedTeamLeader(value);
    }

    const toggleTeamLeader = (teamLeader, id, stateID) => {
        setTeamLeaderId(id);
        setSelectedTeamLeader(teamLeader);
        setStateNames(stateID);
        setIsTeamLeaderOpen(!isTeamLeaderOpen)
    }

    const toggleTeamLeaderOption = () => {
        setIsTeamLeaderOpen(!isTeamLeaderOpen)
    }

    const showTeamLeader = async () => {
        // try {
        //     const response = await axios.get(`${process.env.REACT_APP_URL}/dealerTL/fetchall`);
        //     setTeamLeaderList(response?.data?.data);

        //     // Set default Team Leader if available
        //     if (oldData?.teamLeader) {
        //         setDefaultTeamLeader(oldData.teamLeader.name, oldData.teamLeader._id);
        //     }
        // } catch (error) {
        //     console.error("Error fetching team leaders:", error);
        // }

        const response = await axios.get(`${process.env.REACT_APP_URL}/dealerTL/fetchall`);
        setTeamLeaderList(response?.data?.data);
        setDefaultTeamLeader("Select Team leader", null);
    }

    useEffect(() => {
        showTeamLeader();
    }, [])


    const handleStateCheckBox = (event, pos) => {
        const statusStateDL = [...currentStateStatus];
        // console.log("checked state ",event.target.checked);

        if (event.target.checked) {
            statusStateDL[pos] = event.target.value;
        } else {
            statusStateDL[pos] = 0;
        }
        setCurrentStateStatus(statusStateDL);
        // console.log("curr state added ",statusStateDL);

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData?.name === "") {
            alert('Enter the name');
            return;
        }
        if (formData?.mobile === " " || formData?.mobile.length < 10 || formData?.mobile.length > 10) {
            alert("Enter Number with valid number ,Number must be 10 digits");
            return;
        }

        try {
            const selectedState = [];
            for (let index = 0; index < currentStateStatus.length; index++) {
                if (currentStateStatus[index] !== 0 && currentStateStatus[index] !== undefined) {
                    selectedState.push(currentStateStatus[index]);
                }
            }
            console.log("state selected: ", selectedState);

            if (selectedState.length === 0) {
                alert('Select the states');
                return;
            }

            let UpdateDealerEmployee = await axios.put(`${process.env.REACT_APP_URL}/DLemp/updateDLemp`, {
                empID: oldData?.empID,
                name: formData?.name,
                mobile: formData?.mobile,
                teamleader: teamLeaderId,
                stateID: currentStateStatus.filter(state => state !== 0 && state !== undefined),

            });
            alert("Employee Updated Successfully");
            if (UpdateDealerEmployee.data.success) {
                setFormData({});
                setDefaultTeamLeader("Assign a TL", null);
                setStateNames([]);

                navigate("/admin/employeeDL-dashboard");
            }

            console.log("updated data: ", UpdateDealerEmployee);

        } catch (error) {
            console.error("Error updating employee:", error);
            alert(error.response?.data?.msg || "Failed to update employee.");
        }
    }

    return (
        <form method="POST" style={{ overflow: 'auto', height: '100vh' }} onSubmit={handleSubmit}>
            <div className='outer'>
                <div className="top">
                    <h1 align="center">Update Dealer Employee</h1>
                    <label htmlFor='empID'>Employee Id</label>
                    <input type="text" name="empID" id="empID" style={Styles.topText} value={oldData?.empID} disabled={true} />
                </div>
                <div className="bottom">
                    <div className="bottomLeft ">
                        <label htmlFor='empName'>Name</label>
                        <input type="text" id='empName' name="name" value={formData?.name} onChange={handleInputChange} ></input>

                        <label htmlFor='empMobile'>Mobile</label>
                        <input type="number" id="empMobile" name="mobile" placeholder="9999XXXXXX" value={formData?.mobile} pattern="[0-9]{10} " onChange={handleInputChange} required />
                        <div>
                            <label htmlFor="teamLeader">Team Leader</label>
                            <DynamicDropDown
                                objectList={teamLeaderList}
                                selectedValue={selectedTeamLeader}
                                setSelectedValue={toggleTeamLeader}
                                isOpen={isTeamLeaderOpen}
                                setIsOpen={toggleTeamLeaderOption}
                                key1='name'
                                key2='_id'
                                key3='stateID'
                            />
                        </div>


                        <div>
                            <fieldset style={{ border: "1px solid black", fontSize: "15px", padding: "10px", borderRadius: "5px", marginTop: "15px", marginBottom: "15px" }}>
                                <legend style={{ fontWeight: '700', margin: '1rem', padding: '0px 5px', fontSize: "15px", color: '#880104' }}>State</legend>
                                <section style={{ overflowY: 'auto', height: '5rem', width: '95%', margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px' }}>

                                    {
                                        stateNames?.map(({ _id, state }, index) => (
                                            <div key={_id} style={{ display: 'flex', width: 'min-content', gap: '4.5px' }}>
                                                <input type="checkbox" name="state" id={state} value={_id} style={{ width: 'min-content', fontSize: '15px', }} onChange={(event) => { handleStateCheckBox(event, index) }} />
                                                <label style={{ padding: '5px', fontSize: '15px', width: 'max-content', color: 'black' }} htmlFor={state}>{state}</label>
                                            </div>
                                        ))
                                    }
                                </section>
                            </fieldset>
                        </div>

                        <button type="submit" className='submitBtn' style={Styles.submitBtnForTL}>Update</button>

                    </div>

                </div>


            </div>
        </form>
    )
}

export default UpdateDealer