import React, { useEffect, useState } from 'react'

import DynamicDropDown from '../../component/DropDown2/index'
import axios from 'axios';
import { AddDealerEmployeeApi } from '../../Utils/addDealerEmployee';
import { useNavigate } from 'react-router-dom';

const Index = ({ CoordinatorStartIndexDropDown = 4 }) => {
  const navigator=useNavigate();

  const [registrationData, setRegistrationData] = useState({
    empID: '',
    name: '',
    mobile: ''
  })

  const [departmentListTL, setDepartmentListTL] = useState(null);
  const [departmentTLId, setDepartmentTLId] = useState(null);
  const [isOpen, setIsOpen] = useState(null);
  const [selectedDepartDL, setSelectedDepartDL] = useState("Select a Department");

  const setDefaultDepartment = (value, id) => {
    setSelectedDepartDL(value);
    setDepartmentTLId(id);
  }

  const toggleDepartment = (department, id) => {
    setSelectedDepartDL(department);
    setDepartmentTLId(id);
    setIsOpen(!isOpen);
  }

  const setToggleDeparementOption = () => {
    setIsOpen(!isOpen);
  }

  const departmentSelected = async () => {
    try {
      const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/field/showDepartment`);
      // console.log("sendRequest department : ", sendRequest?.data?.departments);
      const response = await sendRequest.data;
      setDepartmentListTL(response.departments)

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    departmentSelected();
  }, [])


  const [teamLeaderDL, setTeamLeaderDL] = useState(null);
  const [selectedTeamLeaderDL, setSelectedTeamLeaderDL] = useState(null);
  const [isTeamLeaderOpenDL, setTeamLeaderOpenDL] = useState(null);
  const [teamLeaderIdDL, setTeamLeaderIdDL] = useState(null);
  const [stateNamesDL, setStateNamesDL] = useState([]);
  const [currentStateStatusDL, setCurrentStateStatus] = useState(new Array(stateNamesDL.length).fill(0));


  const setDefaultTLDelaer = (value, id) => {
    setSelectedTeamLeaderDL(value);
    setTeamLeaderIdDL(id);
  }

  const toggleTLDealer = (teamLeader, id, stateID) => {
    setSelectedTeamLeaderDL(teamLeader);
    setTeamLeaderIdDL(id);
    setStateNamesDL(stateID);
    setTeamLeaderOpenDL(!isTeamLeaderOpenDL);

  }

  const toggleTeamLeaderDLOption = () => {
    setTeamLeaderOpenDL(!isTeamLeaderOpenDL);
  }

  const fetchDealer = async () => {
    try {
      const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/dealerTL/fetchall`)
      // console.log("send request dealer :",sendRequest?.data?.data);
      const response = await sendRequest.data;
      setTeamLeaderDL(response.data)
      setDefaultTLDelaer('Assign a TL', null);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchDealer();
  }, []);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRegistrationData({ ...registrationData, [name]: value });
  }

  const handleStateCheckBox= (event,pos)=>{
    const statusStateDL=[...currentStateStatusDL];
    // console.log("checked state ",event.target.checked);

    if(event.target.checked){
      statusStateDL[pos]=event.target.value;
    }else{
      statusStateDL[pos]=0;
    }
    setCurrentStateStatus(statusStateDL);
    // console.log("curr state added ",statusStateDL);

  }



  const handleSubmitDL=(event)=>{
    event.preventDefault();
    const dealerSelectedState=[];

    for(let value of currentStateStatusDL){
      if(value!==0 || value ===undefined){
        dealerSelectedState.push(value);
      }
    }
    console.log("selectedState: ",dealerSelectedState);
   const {empID,name,mobile}=registrationData;

   if(!empID){
    alert("Enter Employee ID");
    return;
  }
  if(!name){
    alert("Enter Name ");
    return;
  }

  if(!mobile){
    if(mobile.length !== 10 || mobile.length >10){
      alert('Enter the valid mobile number');
      return;
    }
    else alert('Enter the mobile number');
    return;
  }
  if(dealerSelectedState.length==0){
    alert('Select State');
    return;
  }

  if (!departmentTLId) {
    alert('Select the department');
    return;
  }
  if (!teamLeaderIdDL) {
    alert('Select the Team Leader');
    return;
  }

  const dataRegister={...registrationData,stateID:dealerSelectedState,department: departmentTLId, teamLeader: teamLeaderIdDL,}
  console.log("data register : ",dataRegister);
  AddDealerEmployeeApi(dataRegister);
  navigator("/admin/employeeDL-dashboard");


  }

 






  const Styles = {
    topText: { borderRadius: '5px', height: '2rem', border: '2px solid #BBB8B8' }
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
      <form method='post' onSubmit={handleSubmitDL} style={{ overflow: 'hidden', height: '100vh' }}>
        <div className='outer'>
          <div className='top'>
            <h1 align="center">Add Dealer Employee</h1>
            <label htmlFor="empID">Employee Id</label>
            <input type="text" id='empID' name='empID' style={Styles.topText} onChange={handleInputChange} />
          </div>
        </div>
        <div className='bottom'>
          <div className='bottomLeft'>
            <label htmlFor="name">Name</label>
            <input type="text" id='empName' name='name' onChange={handleInputChange} />

            <div>
              <label htmlFor='empDepartment'>Department</label>
              <DynamicDropDown
                objectList={departmentListTL}
                selectedValue={selectedDepartDL}
                setSelectedValue={toggleDepartment}
                isOpen={isOpen}
                setIsOpen={setToggleDeparementOption}
                startIndex={CoordinatorStartIndexDropDown}
                key1='department'
                key2='_id'
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <label htmlFor='mobile'>Mobile</label>
              <input type="number" name="mobile" id="mobile" onChange={handleInputChange} />
            </div>


            <div>
              <label htmlFor="teamLeader">Team Leader</label>
              <DynamicDropDown
                objectList={teamLeaderDL}
                selectedValue={selectedTeamLeaderDL}
                setSelectedValue={toggleTLDealer}
                isOpen={isTeamLeaderOpenDL}
                setIsOpen={toggleTeamLeaderDLOption}
                key1='name'
                key2='_id'
                key3='stateID'
              />
            </div>
            <button type="submit" className='submitBtn' style={{ marginTop: '1rem' }}>Submit</button>
          </div>

          <div className='bottomRight'>
            <fieldset>
              <legend style={{ fontWeight: '700', margin: '1rem', padding: '0px 5px', color: '#880104' }}>State</legend>
              <section style={{ overflowY: 'auto', height: '5rem', width: '95%', margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px' }}>

                

                {
                  stateNamesDL?.length !==0 && stateNamesDL?.map((state,index)=>(
                    // console.log("state :",state.state);

                    <div key={state._id} style={{ display: 'flex', width: 'min-content', gap: '4.5px' }}>
                      <input type="checkbox" id={state._id} name='state' value={state._id} style={{ width: 'min-content' }} onChange={(event)=>handleStateCheckBox(event,index)} />
                      <label htmlFor={state._id} style={{ padding: '0px', fontSize: '12px', width: 'max-content', color: 'black' }}>{state.state}</label>
                    </div>
                  ))
                }
              </section>

              
            </fieldset>
          </div>
        </div>
      </form>
    </>
  )
}

export default Index