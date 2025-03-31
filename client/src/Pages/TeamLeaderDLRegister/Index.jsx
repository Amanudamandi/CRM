import React, { useEffect, useState } from 'react'
import '../../index.css';
import axios from 'axios';
import { coordinatorDealerRegistration } from '../../Utils/addDealerCoordinatorAPI';
import { useNavigate } from 'react-router-dom';

import { updateCoordinatorDealerProfile } from '../../Utils/updateCoordinatorDealerProfile';


const Index = ({ updateCoordinatorProfile = '', setCoordinatorProfile }) => {


  const [showStateList, setShowStateList] = useState([]);

  const [coordinatorDealerRegistrationData, setCoordinatorDealerRegistrationData] = useState({
    empID: updateCoordinatorProfile.employeeId || '',
    name: updateCoordinatorProfile.name || '',
    mobile: updateCoordinatorProfile.mobile || '',
  })

  // console.log("coordinator update data : ", coordinatorDealerRegistrationData);


  const navigator = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCoordinatorDealerRegistrationData((previous) => ({ ...previous, [name]: value }))
  }

  // console.log("setCorrdinatorDealerRegistor : ",coordinatorDealerRegistrationData);

  const [currStateStatus, setCurrStateStatus] = useState(new Array(36).fill(0));
  console.log("currStateStatus :", currStateStatus);

  const handleChangeCheckBoxes = (e, pos) => {
    const stateStatusList = [...currStateStatus];
    // console.log("currStatusList: ",stateStatusList);
    if (e.target.checked) {
      stateStatusList[pos] = e.target.value;
    } else {
      stateStatusList[pos] = 0;
    }
    setCurrStateStatus(stateStatusList);
  }

  // console.log("currStateStatus : ",currStateStatus);

  // useEffect(()=>{
  //   handleChangeCheckBoxes();
  // },[])





  // const handleOnSubmit = async (event) => {
  //   event.preventDefault();
  //   const selectedState = [];


  //   for (let value of currStateStatus) {
  //     if (value !== 0 || value === undefined) {
  //       selectedState.push(value);
  //     }
  //   }
  //   console.log("selected state ", selectedState);
  //   const { empID, name, mobile } = coordinatorDealerRegistrationData;

  //   if (!empID) {
  //     alert("Enter Employee ID");
  //     return;
  //   }
  //   if (!name) {
  //     alert("Enter Name ");
  //     return;
  //   }

  //   if (!mobile) {
  //     if (mobile.length !== 10 || mobile.length > 10) {
  //       alert('Enter the valid mobile number');
  //       return;
  //     }
  //     else alert('Enter the mobile number');
  //     return;
  //   }
  //   if (selectedState.length == 0) {
  //     alert('Select State');
  //     return;
  //   }
  //   const registerData = { ...coordinatorDealerRegistrationData, stateID: selectedState };
  //   console.log("Register data ", registerData)
  //   if (updateCoordinatorProfile) {
  //     const { name, mobile, stateID } = registerData;
  //     const { uniqueID } = updateCoordinatorProfile;
  //     console.log("data", uniqueID, name, mobile, stateID);
  //     // coordinatorDealerRegistration(uniqueID,{name,mobile,stateID});
  //     updateCoordinatorDealerProfile(uniqueID, { name, mobile, stateID });
  //     setCoordinatorProfile({ clicked: false });
  //   } else {
  //     coordinatorDealerRegistration(registerData);
  //   }

  //   navigator("/admin/showDL-coordinator");    

  // }

  // const showState = async () => {
  //   try {
  //     let response = await axios.get(`${process.env.REACT_APP_URL}/field/showState?countryID=6711fee81cb4aa4e5b7f694b`);
  //     // console.log("data respose : ", response.data.states);
  //     let dataStore = await response.data.states;
  //     setShowStateList(dataStore);
  //     if (updateCoordinatorProfile) {
  //       const stateListNames = updateCoordinatorProfile.state;
  //       console.log("stateListName : ", stateListNames);
  //       const updateCurrentStateStatus = [...currStateStatus];
  //       // console.log("updateCurrentStateStatus : ",updateCurrentStateStatus)
  //       let itr = 0;
  //       for (let index = 0; index < dataStore.length; index++) {
  //         if (itr >= stateListNames.length) {
  //           break;
  //         }

  //         if (dataStore[index].state === stateListNames[itr]) {
  //           // console.log("state data",dataStore[index].state);
  //           updateCurrentStateStatus[index] = response.data.states[index]._id;
  //           itr++;
  //         }

  //         // const updatedStateStatus = dataStore.map((state) =>
  //         //   stateListNames.includes(state.state) ? state._id : 0
  //         // );

  //         // setCurrStateStatus(updatedStateStatus);
  //       }
  //       const updatedStateStatus = dataStore.map((state) =>
  //         stateListNames.includes(state.state) ? state._id : 0
  //       );
  //       setCurrStateStatus([...updatedStateStatus]);

  //       // setCurrStateStatus(updateCurrentStateStatus);

  //     }


  //   } catch (error) {
  //     console.error(error);
  //   }

  // }

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const selectedState = [];

    for (let value of currStateStatus) {
      if (value && value !== 0) {
        selectedState.push(value);
      }
    }
    console.log("Selected states before submission:", selectedState);

    const { empID, name, mobile } = coordinatorDealerRegistrationData;

    if (!empID) {
      alert("Enter Employee ID");
      return;
    }
    if (!name) {
      alert("Enter Name ");
      return;
    }

    if (!mobile || mobile.length <10 && mobile.length >10) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }
    if (selectedState.length === 0) {
      alert("Select State");
      return;
    }

    const registerData = { ...coordinatorDealerRegistrationData, stateID: selectedState };
    console.log("Register data before API call:", registerData);

    if (updateCoordinatorProfile) {
      const { uniqueID } = updateCoordinatorProfile;
      console.log("Updating profile with:", { uniqueID, name, mobile, stateID: selectedState });

      updateCoordinatorDealerProfile(uniqueID, { name, mobile, stateID: selectedState });
      setCoordinatorProfile({ clicked: false });
    } else {
      coordinatorDealerRegistration(registerData);
    }

    navigator("/admin/showDL-coordinator");
  };

  const showState = async () => {
    try {
      let response = await axios.get(`${process.env.REACT_APP_URL}/field/showState?countryID=6711fee81cb4aa4e5b7f694b`);
      let dataStore = response.data.states;
      setShowStateList(dataStore);

      if (updateCoordinatorProfile) {
        const stateListNames = updateCoordinatorProfile.state || [];
        console.log("stateListName:", stateListNames);

        const updatedStateStatus = dataStore.map((state) =>
          stateListNames.includes(state.state) ? state._id : 0
        );

        setCurrStateStatus(updatedStateStatus);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    showState();
  }, []);

  useEffect(() => {
    console.log("Updated currStateStatus:", currStateStatus);
  }, [currStateStatus]);


  useEffect(() => {
    showState();
  }, [])


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

      <form method='POST' onSubmit={handleOnSubmit} style={{ overflow: 'hidden' }} >
        <div className='outer'>
          <div className='top'>
            <h2 align="center">Add Dealer Coordinator</h2>
            <label htmlFor="empID"> Employee Id</label>
            <input type="text" name="empID" id="empID" placeholder='Enter Emplyee Id' style={Styles.topText} onChange={handleInputChange} value={coordinatorDealerRegistrationData?.empID} disabled={updateCoordinatorProfile ? true : false} />
          </div>
          <div className='bottom'>
            <div className='bottomLeft'>
              <label htmlFor="name">Name  </label>
              <input type="text" name="name" id="name" placeholder='Enter Employee Name' onChange={handleInputChange} value={coordinatorDealerRegistrationData?.name} />

              <label htmlFor="mobile">Mobile </label>
              <input type="number" name='mobile' id='mobile' placeholder='Enter Number' value={coordinatorDealerRegistrationData?.mobile} onChange={handleInputChange} />
              <button type="submit" className='submitBtn' style={Styles.submitBtnForTL}>Submit</button>
            </div>

            <div className='bottomRight'>
              <fieldset style={{ marginTop: '1rem' }}>
                <legend style={{ fontWeight: '700', margin: '1rem', padding: '0px 5px', color: '#880104' }}>State</legend>
                <section style={{ overflowY: 'auto', height: '150px', width: '95%', margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px' }}>

                  {showStateList !== null && showStateList.map((state, index) => (
                    <div key={state._id} style={{ display: 'flex', width: 'min-content', gap: '4.5px' }}>
                      <input type="checkbox" name="state" id={state._id} value={state._id} style={{ width: 'min-content' }} onChange={(event) => handleChangeCheckBoxes(event, index)}
                        checked={currStateStatus[index] ? true : false} />
                      <label htmlFor={state._id} style={{ padding: '0px', fontSize: '12px', width: 'max-content', color: 'black' }}>{state?.state}</label>
                    </div>
                  ))}

                </section>
              </fieldset>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default Index