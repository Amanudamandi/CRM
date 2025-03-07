import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DynamicDropDown from '../../../component/DropDown2/index'
import { useNavigate } from 'react-router-dom';
import { addDealer } from '../../../Utils/addDealerAPI';

const Index = ({employeeID}) => {
  const navigator=useNavigate();

  const [newDealerLead, setNewDealerLead] = useState({
    name: '',
    email: '',
    mobile: '',
    zipCode: '',
    empID: employeeID || null
  })

  const handleInput = (event) => {
    const { name, value } = event.target;
    setNewDealerLead({ ...newDealerLead, [name]: value });
  }
  // console.log("lead Data ",newDealerLead);

  const [stateList, setStateList] = useState(null)
  const [stateId, setStateId] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [isOpen, setIsOpen] = useState(null);

  const setDefaultState = (value, id) => {
    setStateId(id);
    setSelectedState(value);
  }

  const toggleState = (state, id) => {
    setSelectedState(state);
    setStateId(id);
    setIsOpen(!isOpen);
  }

  const toggleStateOption = () => {
    setIsOpen(!isOpen);
  }

  const showState = async () => {
    try {
      const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/field/showState?countryID=6711fee81cb4aa4e5b7f694b`);
      const response = await sendRequest.data;
      // console.log("state : ",response.states);
      setStateList(response.states);
      setDefaultState('Select a State', null);
    } catch (error) {
      console.log(error);
    }
    // console.log("state : ",stateList);
  }

  useEffect(() => {
    showState();
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    // const { empName, empEmail, mobile, pincode } = newDealerLead;
    const leadData = { ...newDealerLead, stateID: stateId };
    console.log(leadData);
    addDealer(leadData);
    navigator("/admin/showDL-leads");
  }
  
  const Styles = {
    leadFormContainer: { margin: 'auto', display: 'flex', alignItems: 'center', width: '60%', height: '100vh', padding: '0rem 8rem' },
    allInputContainer: { display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, border: '1px solid #ddd', padding: '3rem 2rem', boxShadow: '0px 0px 8px rgb(120, 120, 120)', borderRadius: '5px' },
    formHeading: { width: '100%', textAlign: 'center' },
    formLabel: { color: '#AA0B2B', fontWeight: 800 },
    formSubmitBtn: { backgroundColor: '#AA0B2B', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', color: '#fff', marginTop: '0.5rem' }
  }

  return (
    <section>
      <form action="#" method='POST' style={Styles.leadFormContainer} onSubmit={handleSubmit}>
        <div style={Styles.allInputContainer}>
          <h2 style={Styles.formHeading}> Add Dealer Lead</h2>

          <div>
            <label htmlFor="name" style={Styles.formLabel}>Name </label>
            <input type="text" name="name" id="name" onChange={handleInput} />
          </div>

          <div>
            <label htmlFor="mobile" style={Styles.formLabel}>Mobile Number </label>
            <input type="number" name="mobile" id="mobile" onChange={handleInput} />
          </div>

          <div>
            <label htmlFor="email" style={Styles.formLabel}>Email </label>
            <input type="email" name='email' id='email' onChange={handleInput} />
          </div>

          <div>
            <label htmlFor="state" style={Styles.formLabel}>State</label>
            <DynamicDropDown
              objectList={stateList}
              selectedValue={selectedState}
              setSelectedValue={toggleState}
              isOpen={isOpen}
              setIsOpen={toggleStateOption}
              key1='state'
              key2='_id'
              height='128'
              overflow='scroll'
            />
          </div>

          <div>
            <label htmlFor="zipCode" style={Styles.formLabel}>PineCode</label>
            <input type="number" name="zipCode" id="zipCode" onChange={handleInput} />
          </div>

          <div>
            <button type='submit' style={Styles.formSubmitBtn}>Add Lead</button>
          </div>
        </div>


      </form>
    </section >
  )
}

export default Index