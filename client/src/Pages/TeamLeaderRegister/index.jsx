import React, { useState } from 'react';
// import DynamicDropDown from '../../component/DropDown2/index';
import { useEffect } from 'react';
import axios from 'axios';
import { coordinatorRegistration } from '../../Utils/addCoordinatorAPI';
import { updateCoordinatorProfileApi } from '../../Utils/updateCoordinatorProfileAPI';
import './index.css';

const Index = ({ updateCoordinatorProfile = '', setCoordinatorProfile }) => {
  const [showStateList, setShowStateList] = useState([]);
  // const [ stateId, setStateId ] = useState(null);
  // const [ selectedState, setSelectedState ] = useState(null);
  // const [ isStateOpen, setIsStateOpen ] = useState(false);
  const [coordinatorRegistrationData, setCoordinatorRegistrationData] = useState(
    {
      empID: updateCoordinatorProfile.employeeId || '',
      name: updateCoordinatorProfile.name || '',
      mobile: updateCoordinatorProfile.mobile || ''
    }
  );

  // const setDefaultState = (value, id) => {
  //   setSelectedState(value);
  //   setStateId(id);
  // }

  // const toogleState = (state, id) => {
  //   setSelectedState(state);
  //   setStateId(id);
  //   setIsStateOpen(!isStateOpen);
  // }

  // const toggleStateOption = () => {
  //   setIsStateOpen(!isStateOpen);
  // }

  const handleOnChangeInput = (event) => {
    const { name, value } = event.target;
    setCoordinatorRegistrationData((previous) => ({ ...previous, [name]: value }));
  }

  // console.log("coordinateRegisterData ",coordinatorRegistrationData);

  const [currentStateStatus, setCurrentStateStatus] = useState(new Array(36).fill(0));


  const handleChangeCheckBoxes = (e, pos) => {
    const stateStatusList = [...currentStateStatus];
    console.log(stateStatusList);
    if (e.target.checked) {
      stateStatusList[pos] = e.target.value;
    } else {
      stateStatusList[pos] = 0
    }
    setCurrentStateStatus(stateStatusList);
  }

  
  const handleOnSubmit = (event) => {
    event.preventDefault();
    const selectedStateList = [];
    for (let value of currentStateStatus) {
      if (value !== 0 || value === undefined) {
        selectedStateList.push(value);
      }
    }
    console.log(selectedStateList);
    const { empID, name, mobile } = coordinatorRegistrationData;
    if(!empID){
      alert('Enter the valid empID');
      return;
    }
    if(!name){
      alert('Enter the Coordinator name');
      return;
    }
    if(!mobile){
      if(mobile.length !== 10){
        alert('Enter the valid mobile number');
      }
      else alert('Enter the mobile number');
      return;
    }
    if(selectedStateList.length === 0){
      alert('Select the State');
      return;
    }
    const registrationData = { ...coordinatorRegistrationData, stateID: selectedStateList }
    console.log(registrationData);
    if (updateCoordinatorProfile) {
      const { name, mobile, stateID } = registrationData;
      const { uniqueID } = updateCoordinatorProfile
      console.log("data " ,uniqueID, name, mobile, stateID);
      updateCoordinatorProfileApi(uniqueID, { name, mobile, stateID });
      setCoordinatorProfile({ clicked: false });
    } else {
      coordinatorRegistration(registrationData);
    }
  }


  const showState = async () => {
    try {
      const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/field/showState?countryID=6711fee81cb4aa4e5b7f694b`);
      const response = await sendRequest.data.states;
      setShowStateList(response);
      if (updateCoordinatorProfile) {
        const stateListNames = updateCoordinatorProfile.state;
        const updateCurrentStateStatus = [...currentStateStatus];
        let itr = 0;
        for (let index = 0; index < response.length; index++) {
          if (itr > stateListNames.length) {
            break;
          }
          if (response[index].state === stateListNames[itr]) {
            console.log(response[index].state);
            updateCurrentStateStatus[index] = response[index]._id;
            itr++;
          }
        }
        setCurrentStateStatus(updateCurrentStateStatus);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    showState();
  }, []);

  // useEffect(() => {
  //   if (updateCoordinatorProfile) {
  //     const stateListNames = updateCoordinatorProfile.state;
  //     const updateCurrentStateStatus = [...currentStateStatus];
  //     let itr = 0;
  //     for (let index = 0; index < showStateList.length; index++) {
  //       if (itr > stateListNames.length) {
  //         break;
  //       }
  //       if (showStateList[index].state === stateListNames[itr]) {
  //         // console.log(showStateList[index].state);
  //         updateCurrentStateStatus[index] = 1;
  //         itr++;
  //       }
  //     }

  //     setCurrentStateStatus(updateCurrentStateStatus);
  //   }
  // }, [showStateList]);

  const Styles = {
    topText: { borderRadius: '5px', height: '2rem', border: '2px solid #BBB8B8' },
    submitBtnForTL: {},
    inputBottomMargin: { marginBottom: '1rem' }
  }

  return (
    <>
      <style>
        {`
            ::-webkit-scrollbar {
                width: 6px;
                height: 6px
            }
            
            ::-webkit-scrollbar-track {
                background: #f1f1f1;
            }
            
            ::-webkit-scrollbar-thumb {
                background-color: #888;
                border-radius: 8px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background-color: #AA0B2B;
            }
            `}
      </style>
      <form method='POST' style={{ overflow: 'hidden' }} onSubmit={handleOnSubmit}>
        <div className="outer">

          <div className="top">
            <h1 align="center">Add Coordinator</h1>
            <label htmlFor='empID'>Employee Id</label>
            <input type="text" name="empID" id="empID" style={Styles.topText} value={coordinatorRegistrationData.empID} onChange={handleOnChangeInput} disabled={updateCoordinatorProfile ? true : false} />
          </div>

          <div className="bottom">
            <div className="bottomLeft ">
              <label htmlFor='empName'>Name</label>
              <input type="text" name="name" id="empName" value={coordinatorRegistrationData.name} onChange={handleOnChangeInput} />
              
              <label htmlFor='empMobile'>Mobile</label>
              <input type="number" name="mobile" id="empMobile" value={coordinatorRegistrationData.mobile} onChange={handleOnChangeInput} />
              <button type="submit" className='submitBtn' style={Styles.submitBtnForTL}>Submit</button>
            </div>
            <div className="bottomRight">
              {/* <label htmlFor='empDOJ'>Date of Joining</label>
                  <input type="date" name="doj" id="empDOJ" style={Styles.inputBottomMargin} /> */}
              {/* <div>
                    <label htmlFor='emp-state' style={{marginTop: '0.5rem'}}>State</label>
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
                  </div> */}
              <fieldset style={{ marginTop: '1rem' }}>
                <legend style={{ fontWeight: '700', margin: '1rem', padding: '0px 5px', color: '#880104' }}>State</legend>
                <section style={{ overflowY: 'auto', height: '130px', width: '95%', margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px' }}>
                  {
                    showStateList !== null && showStateList.map((eachState, index) => (
                      <div key={eachState._id} style={{ display: 'flex', width: 'min-content', gap: '4.5px' }}>
                        <input type="checkbox" name="district" id={eachState._id} value={eachState._id} style={{ width: 'min-content' }} onChange={(event) => handleChangeCheckBoxes(event, index)} checked={currentStateStatus[index] ? true : false} />
                        <label htmlFor={eachState._id} style={{ padding: '0px', fontSize: '12px', width: 'max-content', color: 'black' }}>{eachState.state}</label>
                      </div>
                    ))
                  }
                </section>
              </fieldset>
              {/* <label htmlFor='empLicense' style={{marginTop: '1.5rem'}}>License</label>
                  <input type="text"  name="license" id="empLicense" /> */}

            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default Index;