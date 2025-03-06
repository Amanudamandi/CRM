import React, { useState } from 'react';
import DynamicDropDown from '../../component/DropDown2/index';
import { useEffect } from 'react';
import axios from 'axios';
import './index.css';
import { useNavigate } from 'react-router-dom';

const Index = ({ CoordinatorStartIndexDropDown }) => {

  const [RegistrationData, setRegistration] = useState({
    empID: '',
    name: '',
    mobile: ''
  });

  const navigator = useNavigate();

  // showDepartment API
  const [departmentId, setDepartmentId] = useState(null);
  const [departmentList, setDepartmentList] = useState(null);
  const [selectedDepart, setSelectedDepart] = useState('Select a Department');
  const [isOpen, setIsOpen] = useState(false);

  const setDefaultDepartment = (departmentName, departmentId) => {
    setSelectedDepart(departmentName);
    setDepartmentId(departmentId);
  }

  const toggleDepartment = (departmentName, departmentId) => {
    setSelectedDepart(departmentName);
    setDepartmentId(departmentId);
    setIsOpen(!isOpen);
  }

  const toggleDepartmentOption = () => {
    setIsOpen(!isOpen);
  }

  const getShowDepartment = async () => {
    try {
      const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/field/showDepartment`);
      const response = await sendRequest.data;
      console.log(" department : ", response.departments);
      setDepartmentList(response.departments);
      // setDefaultDepartment("Select Department", null);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getShowDepartment();
  }, []);

  // console.log("department id ",departmentId);


  // showTeamLeader API
  const [teamLeaderList, setTeamLeaderList] = useState(null);
  const [teamLeaderId, setTeamLeaderId] = useState(null);
  const [selectedTeamLeader, setSelectedTeamLeader] = useState(null);
  const [isTeamLeaderOpen, setIsTeamLeaderOpen] = useState(null);
  const [stateNames, setStateNames] = useState([]);
  const [currentStateStatus, setCurrentStateStatus] = useState(new Array(stateNames.length).fill(0));

  const setDefaultTeamLeader = (value, id) => {
    setSelectedTeamLeader(value);
    setTeamLeaderId(id);
  }

  const toogleTeamLeader = (teamLeader, id, stateID) => {
    setSelectedTeamLeader(teamLeader);
    setTeamLeaderId(id);
    setStateNames(stateID);
    setIsTeamLeaderOpen(!isTeamLeaderOpen);
  }

  const toggleTeamLeaderOption = () => {
    setIsTeamLeaderOpen(!isTeamLeaderOpen);
  }

  const showTeamLeader = async () => {
    try {
      const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/auth/showTeamLeaderName`);
      const response = await sendRequest.data;
      console.log(response.data);
      setTeamLeaderList(response.data);
      setDefaultTeamLeader('Assign a TL', null);
        
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    showTeamLeader()
  }, []);


  // showDistrict API
  const [showDistrictList, setShowDistrictList] = useState(new Array(stateNames.length).fill().map(() => new Array()));
  const [currentDistrictStatus, setCurrentDistrictStatus] = useState(new Array(stateNames.length).fill().map(() => new Array()));

  useEffect(() => {
    setShowDistrictList(new Array(stateNames.length).fill().map(() => new Array()));
    setCurrentDistrictStatus(new Array(stateNames.length).fill().map(() => new Array()));
  }, [teamLeaderId]);

  const showDistrict = async (stateId, row) => {
    try {
      const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/field/showDistrict/?stateID=${stateId}`);
      const response = await sendRequest.data.Districts.district;
      console.log(response);

      setShowDistrictList((previousData) => {
        const updatedDistrict = previousData.map((eachList) => [...eachList]);
        updatedDistrict[row] = response;
        return updatedDistrict;
      });
      // setCurrentDistrictStatus([]);
      let updatedCurrentDistrictStatus = [];
      for (let index = 0; index < response.length; index++) {
        if (!response[index].status) {
          updatedCurrentDistrictStatus = [...updatedCurrentDistrictStatus, false];
          // setCurrentDistrictStatus((previousList) => [...previousList, false]);
        } else {
          // setCurrentDistrictStatus((previousList) => [...previousList, -1]); 
          updatedCurrentDistrictStatus = [...updatedCurrentDistrictStatus, -1];
        }
      }

      // console.log(updatedCurrentDistrictStatus);

      setCurrentDistrictStatus((previous) => {
        console.log(previous, row);
        const copyCurrentDistrictStatus = previous.map((data) => [...data]);
        copyCurrentDistrictStatus[row] = updatedCurrentDistrictStatus;
        return copyCurrentDistrictStatus;
      });

      // console.log(currentDistrictStatus);

    } catch (error) {
      console.error(error);
    }
  }

  const handleStateChangeCheckBoxes = (e, pos) => {
    const stateStatusList = [...currentStateStatus];
    console.log("stateStatusList : ",stateStatusList);
    console.log(e.target.checked);
    if (e.target.checked) {
      stateStatusList[pos] = e.target.value;
      showDistrict(e.target.value, pos);
    } else {
      stateStatusList[pos] = 0;
      setShowDistrictList((previousData) => {
        const copyCurrentDistrictStatus = previousData.map((data) => [...data]);
        copyCurrentDistrictStatus[pos] = [];
        return copyCurrentDistrictStatus;
      });
      setCurrentDistrictStatus((previousData) => {
        const copyCurrentDistrictStatus = previousData.map((data) => [...data]);
        copyCurrentDistrictStatus[pos] = [];
        return copyCurrentDistrictStatus;
      });
    }
    setCurrentStateStatus(stateStatusList);
  }

  // useEffect(() => {
  //   for (let index = 0; index < currentStateStatus.length; index++) {
  //     // console.log(currentStateStatus[index]);
  //     if (currentStateStatus[index] !== 0 && currentStateStatus[index] !== undefined) {
  //         showDistrict(currentStateStatus[index], index);
  //     }
  //     else {
  // setShowDistrictList((previousData) => {
  //   const copyCurrentDistrictStatus = previousData.map((data) => [...data]);
  //   copyCurrentDistrictStatus[index] = [];
  //   return copyCurrentDistrictStatus;
  // });
  // setCurrentDistrictStatus((previousData) => {
  //   const copyCurrentDistrictStatus = previousData.map((data) => [...data]);
  //   copyCurrentDistrictStatus[index] = [];
  //   return copyCurrentDistrictStatus;
  // });
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentStateStatus]);

  const handleChangeCheckBoxes = (e, row, col) => {
    console.log("xyz", currentDistrictStatus);
    console.log(row, col);
    const updatedListOfCheckBoxed = currentDistrictStatus.map((data) => [...data]);
    console.log("updated Checked box ", updatedListOfCheckBoxed);
    if (currentDistrictStatus[row][col] !== -1) {
      if (e.target.checked)
        updatedListOfCheckBoxed[row][col] = true;
      else
        updatedListOfCheckBoxed[row][col] = false;
    }
    console.log("current disrtrict Status", currentDistrictStatus[row][col]);
    console.log(updatedListOfCheckBoxed);
    setCurrentDistrictStatus(updatedListOfCheckBoxed);
  }


  // const addEmployeeOnSubmit = (event) => {
  //   event.preventDefault();
  // }

  const Styles = {
    topText: { borderRadius: '5px', height: '2rem', border: '2px solid #BBB8B8' }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistration({ ...RegistrationData, [name]: value });
  }



  const handleEmployeeRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!RegistrationData.empID && !RegistrationData.name && !RegistrationData.mobile) {
      alert(`Enter the valid employee Id\n Enter the valid name\n Enter the 10 digits mobile number`);
      return;
    }
    if (!RegistrationData.empID) {
      alert('Enter the valid employee Id');
      return;
    }
    if (!RegistrationData.name) {
      alert('Enter the valid name');
      return;
    }
    if (!RegistrationData.mobile) {
      alert('Enter the 10 digits mobile number');
      return;
    }
    if (!departmentId) {
      alert('Select the department');
      return;
    }
    if (!teamLeaderId) {
      alert('Select the Team Leader');
      return;
    }
    try {
      const states = [];
      for (let index = 0; index < currentStateStatus.length; index++) {
        if (currentStateStatus[index] !== 0 && currentStateStatus[index] !== undefined) {
          states.push(currentStateStatus[index]);
        }
      }
      const district = [];
      for (let row = 0; row < currentDistrictStatus.length; row++) {
        for (let col = 0; col < currentDistrictStatus[row].length; col++) {
          if (currentDistrictStatus[row][col] !== -1) {
            if (currentDistrictStatus[row][col]) {
              district.push(showDistrictList[row][col].name);
            }
          }
        }
      }
      if (states.length === 0) {
        alert('Select the states');
        return;
      }
      // if (district.length === 0) {
      //   alert('Select the districts to be assigned');
      //   return;
      // }

      console.log(states);

      console.log(RegistrationData, departmentId, teamLeaderId, states, district);
      const response = await axios.post(`${process.env.REACT_APP_URL}/auth/empRegister`,
        { ...RegistrationData, department: departmentId, teamLeader: teamLeaderId, stateID: states, district }
      );
      // console.log(response.data);
      alert("Employee added Successfully");
      if (response.data.success) {
        setRegistration({});
        // setDefaultState("Select State", null);
        setDefaultDepartment("Select a Department", null);
        setDefaultTeamLeader("Assign a TL", null);
        setStateNames([]);
        setShowDistrictList(new Array(stateNames.length).fill().map(() => new Array()));
        setCurrentDistrictStatus(new Array(stateNames.length).fill().map(() => new Array()));
        navigator("/admin/employee-dashboard");
      }
      // set
    } catch (error) {
      // console.error(error);
      const errorsList = error.response.data.msg;
      console.log(errorsList);
      let errorsStr = "";
      for (let data of errorsList) {
        errorsStr += `${data.msg}\n`;
      }
      alert(errorsStr);
    }
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
      <form method="POST" onSubmit={handleEmployeeRegisterSubmit} style={{ overflow: 'hidden', height: '100vh' }}>
        <div className="outer">

          <div className="top">
            <h1 align="center">Add Employee</h1>
            <label htmlFor='empID'>Employee Id</label>
            <input type="text" name="empID" id="empID" style={Styles.topText} onChange={handleChange} />
          </div>

          <div className="bottom">
            <div className="bottomLeft ">
              <label htmlFor='empName'>Name</label>
              <input type="text" className='' name="name" onChange={handleChange} id="empName" />

              <div>
                <label htmlFor='empDepartment'>Department</label>
                <DynamicDropDown
                  objectList={departmentList}
                  startIndex={CoordinatorStartIndexDropDown}
                  // endIndex={CoordinatorEndIndexDropDown}
                  selectedValue={selectedDepart}
                  setSelectedValue={toggleDepartment}
                  isOpen={isOpen}
                  setIsOpen={toggleDepartmentOption}
                  key1='department'
                  key2='_id'
                />
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <label htmlFor='empMobile'>Mobile</label>
                <input type="number" name="mobile" onChange={handleChange} id="empMobile" />
              </div>

              <div>
                <label htmlFor='empDepartment'>Team Leader</label>
                <DynamicDropDown
                  objectList={teamLeaderList}
                  selectedValue={selectedTeamLeader}
                  setSelectedValue={toogleTeamLeader}
                  isOpen={isTeamLeaderOpen}
                  setIsOpen={toggleTeamLeaderOption}
                  key1='name'
                  key2='_id'
                  key3='stateID'
                />

              </div>

              <button type="submit" className='submitBtn' style={{ marginTop: '1rem' }}>Submit</button>

            </div>
            <div className="bottomRight">
              <fieldset>
                <legend style={{ fontWeight: '700', margin: '1rem', padding: '0px 5px', color: '#880104' }}>State</legend>
                <section style={{ overflowY: 'auto', height: '5rem', width: '95%', margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px' }}>
                  {
                    stateNames.length !== 0 && stateNames.map((eachState, index) => (
                      <div key={eachState._id} style={{ display: 'flex', width: 'min-content', gap: '4.5px' }}>
                        <input type="checkbox" name="district" id={eachState._id} value={eachState._id} style={{ width: 'min-content' }} onChange={(event) => handleStateChangeCheckBoxes(event, index)} />
                        <label htmlFor={eachState._id} style={{ padding: '0px', fontSize: '12px', width: 'max-content', color: 'black' }}>{eachState.state}</label>
                      </div>
                    ))
                  }
                </section>
              </fieldset>


              {departmentId!== "66e139caa9afb40e2bbbd82e" &&
                <fieldset style={{ marginTop: '0.5rem' }}>
                  <legend style={{ fontWeight: '700', margin: '1rem', padding: '0px 5px', color: '#880104' }}>District</legend>
                  <section style={{ overflowY: 'auto', height: '180px', width: '95%', margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px' }}>
                    {
                      showDistrictList.map((eachDistrict, row) => {
                        return eachDistrict.map(({ _id, name, status }, col) => (
                          <div key={_id} style={{ display: 'flex', width: 'min-content', gap: '4.5px', color: "black" }}>
                            <input type="checkbox" name="district" id={name} value={name} style={{ width: 'min-content' }} onChange={(e) => handleChangeCheckBoxes(e, row, col)} />
                            <label htmlFor={name} style={{ padding: '0px', color: 'black', fontSize: '12px', width: 'max-content' }}>{name}</label>
                          </div>
                        ))
                      }
                      )}
                  </section>
                </fieldset>
              }
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default Index;