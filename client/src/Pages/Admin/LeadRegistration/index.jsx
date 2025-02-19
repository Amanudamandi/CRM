import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import DynamicDropDown from '../../../component/DropDown2/index';
import { addLeadApi } from '../../../Utils/addLeadAPI';

const Index = ( {employeeID} ) => {

    const [ newLeadData, setNewLeadData ] = useState({
        name: '',
        email: '',
        mobile: '', 
        pincode: '',
        empID: employeeID || null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLeadData({ ...newLeadData, [name]: value });
      } 

    // ShowState API
    const [ showStateList, setShowStateList ] = useState(null);
    const [ stateId, setStateId ] = useState(null);
    const [ selectedState, setSelectedState ] = useState(null);
    const [ isStateOpen, setIsStateOpen ] = useState(false);

    const setDefaultState = (value, id) => {
        setSelectedState(value);
        setStateId(id);
    }

    const toogleState = (state, id) => {
        setSelectedState(state);
        setStateId(id);
        setIsStateOpen(!isStateOpen);
    }

    const toggleStateOption = () => {
        setIsStateOpen(!isStateOpen);
    }

    const showState = async () => {
        try {
        const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/field/showState?countryID=6711fee81cb4aa4e5b7f694b`);
        const response = await sendRequest.data;
        console.log(response.states);
        setShowStateList(response.states);
        setDefaultState('Select a State', null);
        } catch (error) {
        console.error(error);
        }
    }

    useEffect(() => {
        showState();
    }, []);

    // Add Client/Lead API
    const handleSubmitAddClient = async(event) => {
        event.preventDefault();
        const leadData = { ...newLeadData, stateID: stateId}
        console.log(leadData);
        addLeadApi(leadData);
        // try{
        //     const sendRequest = await axios.post(`http://localhost:8080/client/clientAdd`, );
        //     const response = sendRequest.data;
        //     if(response.success){
        //         alert(response.msg);
        //         setNewLeadData({
        //             name: '',
        //             email: '',
        //             mobile: '', 
        //             state: '',
        //             pincode: ''
        //         });
        //     }
        //     console.log(response);
        // } catch(error){
        //     alert(error.response.data.msg);
        //     console.error(error);
        // }
        

    }

    const Styles = {
        leadFormContainer: { margin: 'auto', display: 'flex', alignItems: 'center', width: '60%', height: '100vh', padding: '0rem 8rem'},
        allInputContainer: { display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, border: '1px solid #ddd', padding: '3rem 2rem', boxShadow: '0px 0px 8px rgb(120, 120, 120)', borderRadius: '5px' },
        formHeading: { width: '100%', textAlign: 'center' },
        formLabel: { color: '#AA0B2B', fontWeight: 800 },
        formSubmitBtn: { backgroundColor: '#AA0B2B', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', color: '#fff', marginTop: '0.5rem' }
    }

    return(
            <section>
               <form action="#" method='POST' style={Styles.leadFormContainer} onSubmit={handleSubmitAddClient}>
                <div style={Styles.allInputContainer}>
                    <h2 style={Styles.formHeading}>Add New Lead</h2>
                    <div>
                        <label htmlFor="name" style={Styles.formLabel} >Name</label>
                        <input type="text" name='name' id='name' onChange={handleChange} autoComplete='off' />
                    </div>
                    
                    <div>
                        <label htmlFor="mobile" style={Styles.formLabel} >Mobile Number</label>
                        <input type="number" name='mobile' id='mobile' onChange={handleChange} autoComplete='off' />
                    </div>
                    
                    <div>
                        <label htmlFor="email" style={Styles.formLabel}>Email</label>
                        <input type="email" name='email' id='email' onChange={handleChange} autoComplete='off' />
                    </div>
                    
                    <div>
                        <label htmlFor="" style={Styles.formLabel} >State</label>
                        <DynamicDropDown
                            objectList={showStateList}
                            selectedValue={selectedState}
                            setSelectedValue={toogleState}
                            isOpen={isStateOpen}
                            setIsOpen={toggleStateOption}
                            key1='state'
                            key2='_id'
                            height='128'
                            overflow='scroll'
                        />
                    </div>   
                    <div>
                        <label htmlFor="pincode" style={Styles.formLabel} >Pincode</label>
                        <input type="text" name='pincode' id='pincode' onChange={handleChange} autoComplete='off' />
                    </div>   
                    <button style={Styles.formSubmitBtn} type='submit'>Submit</button>
                </div>
               </form>
            </section>
    )
}

export default Index;

