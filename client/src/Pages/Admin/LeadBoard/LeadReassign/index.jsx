import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { showEmployeeApi } from '../../../../Utils/showEmployeeAPI';
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import './index.css';

const Index = ({ reAssignBtnClicked, setReAssignBtnClicked, clientsID, setReAssignSuccess, limit, setLeadStatusList }) => {

    const [ employeeList, setEmployeeList ] = useState([]);
    const [ selectedEmployee, setSelectedEmployee ] = useState('');

    useEffect(() => {
        showEmployeeApi(setEmployeeList);
    }, []);

    const Styles = {
        coordinatorProfileContainer: { margin: '0rem 1rem 0rem 8.2rem', backgroundColor: '#fff', padding: '0rem 0rem', width: '75%', height: '92vh', position: 'fixed', top: '50%', left: '50%', zIndex: '9999', boxShadow: '0px 0px 2px black', borderRadius: '8px', overflow: 'auto', transform: 'translate(-50%, -50%)' },
        closeIconButton: { cursor: 'pointer', position: 'absolute', top: '1rem', right: '0.8rem', transition: 'transform 0.4s ease', transformOrigin: 'center' },
        assigneeLabel: { display: 'inline-block', fontSize: '20px', marginBottom: '8px' },
        assigneeSelectBox: { width: '22rem', padding: '8px', borderRadius: '4px' },
        reAssignBtnContainer: { position: 'absolute', borderRadius: '2px solid red', bottom: '1.8rem', left: '2rem'  },
        cancelBtn: { borderRadius: '4px', border: '1px solid black', padding: '8px 32px', cursor: 'pointer'}
    }

    const handleAssignLeadsToEmployee = async() => {
        try{
            const sendRequest = await axios.put(`${process.env.REACT_APP_URL}/client/bulkAssign`, { clientsID , empID: selectedEmployee })
            const response = await sendRequest.data;
            console.log(response);
            // alert(response)
            if(response.success){
                alert(response.msg);
                setReAssignSuccess(true);
                setReAssignBtnClicked(false);
                return true;
            }
        }catch(error){
            console.log(error);
            alert('Something went wrong');
            return false;
        }
    }

    const handleCancelClicked = () => {
        setReAssignBtnClicked(false);
    }

    return (
        <>
            <section style={reAssignBtnClicked ? { ...Styles.coordinatorProfileContainer, animation: 'slideUp 0.5s ease forwards' } : Styles.coordinatorProfileContainer}>
                <div style={{ width: '100%', backgroundColor: '#AA0B2B', padding: '1.5rem 1.225rem'}}>
                    <h2 style={{ color: 'white'}}>Re-Assign Lead</h2>
                    <IoClose size={40} color='#fff' className='close-btn' style={Styles.closeIconButton}
                        onClick={() => {
                            setReAssignBtnClicked(false);
                        }}
                    />
                </div>

                <div style={{ margin: '1rem 2rem' }}>
                    <label htmlFor="assignee" style={Styles.assigneeLabel}>Assignee</label><br/>
                    <select 
                        name="assignee" 
                        id="assignee" 
                        style={Styles.assigneeSelectBox}
                        onChange={(event) => {
                            setSelectedEmployee(event.target.value);
                        }}
                    >
                        <option value="">Select the Employee</option>
                        {
                            employeeList.map(({empID, name}) => (
                                <option value={empID}>{name}</option>
                            ))
                        }
                    </select>
                </div>
                <div style={Styles.reAssignBtnContainer}>
                    <div style={{ display: 'flex', width: '16.5rem', borderRadius: '2px solid red', justifyContent: 'space-between'}}>
                        <div style={Styles.cancelBtn} onClick={() => handleCancelClicked.then((status) => {
                            if(status){
                                setLeadStatusList(() => {
                                    const updateLeadStatusList = [];
                                    for(let index = 0; index < limit; index++){
                                        updateLeadStatusList[index] = false;
                                    }
                                    return updateLeadStatusList;
                                });
                            }
                        })}>
                            <span>Cancel</span>
                        </div>
                        <div style={{...Styles.cancelBtn, backgroundColor: '#AA0B2B', borderColor: '#AA0B2B'}} onClick={handleAssignLeadsToEmployee}>
                            <span style={{ color: '#fff' }}>Assign</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Index;