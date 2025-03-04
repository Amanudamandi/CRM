import axios from 'axios';
import { set } from 'date-fns';
import React, { useEffect, useState } from 'react'
import DynamicDropDown from '../../DropDown2/index';
import './../../../Pages/employeeRegister/index.css'
import { useNavigate } from 'react-router-dom';
const Update = ({ data2, setdata }) => {
  console.log("DATA2", data2);
  const navigate = useNavigate();

  const [form, setformdata] = useState({
    emp: data2[0]?.name || '',
    phone: data2[0]?.mobile || '',
    leader: data2[0]?.teamLeader?.name || '',
    state: data2[0]?.stateID || [],
    distict: data2[0]?.district || []
  })
  console.log("district : ", form.distict);

  console.log("form  state: ", form.state)

  const [teamLeaderList, setTeamLeaderList] = useState(null);
  const [teamLeaderId, setTeamLeaderId] = useState(null);
  const [selectedTeamLeader, setSelectedTeamLeader] = useState(null);
  const [isTeamLeaderOpen, setIsTeamLeaderOpen] = useState(null);
  const [stateNames, setStateNames] = useState([]);

  const [currentStateStatus, setCurrentStateStatus] = useState(new Array(stateNames.length).fill(0));
  // const [currentStateStatus, setCurrentStateStatus] = useState(
  //   data2[0]?.stateID?.map(({ _id }) => _id) || []
  // );

  // useEffect(() => {
  //   // Ensure selected states are set when loading the component
  //   setCurrentStateStatus(data2[0]?.stateID?.map(({ _id }) => _id) || []);
  // }, [data2]);


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
    const response = await axios.get(`${process.env.REACT_APP_URL}/auth/showTeamLeaderName`);
    // console.log("response is:",response.data);
    setTeamLeaderList(response?.data?.data);
    setDefaultTeamLeader("Select Team leader", null);
  }

  console.log("all team leader", teamLeaderList);
  console.log("selectes Team leader : ", selectedTeamLeader);



  useEffect(() => {
    showTeamLeader();
  }, []);


  //handling State
  const handleState = async (e) => {
    e?.preventDefault();
    // Get the selected leader's name from the dropdown OR fallback to `form.leader`
    const selectedLeaderName = e?.target?.value || selectedTeamLeader;
    console.log("Selected Leader Name:", selectedLeaderName);

    // Find the leader's details from `teamLeaderList`
    const selectedLeader = teamLeaderList?.find((leader) => leader.name === selectedLeaderName);
    console.log("Selected Leader Object:", selectedLeader);

    // Update stateNames with the leader's `stateID`
    if (selectedLeader) {
      setStateNames(selectedLeader.stateID || []); // Update state list
    } else {
      setStateNames([]); // Reset if no leader is found
    }
    // Update the form data
    setformdata((prev) => ({
      ...prev,
      leader: selectedLeaderName,
    }));
  };
  useEffect(() => {
    handleState();
  }, [selectedTeamLeader]);
  console.log("state store : ", stateNames);

  // fetching district ===========
  const [oldAssignedDistricts, setOldAssignedDistricts] = useState([]);
  useEffect(() => {
    setOldAssignedDistricts([...form.distict]); // Store initial selected districts
  }, [form.distict]);

  const [district, setDistrict] = useState([]);
  const [assignedDistricts, setAssignedDistricts] = useState(form.distict);
  const [currDistrictStatus, setCurrentDistrictStatus] = useState(new Array(stateNames.length).fill().map(() => new Array()));

  // console.log("assigned district :", assignedDistricts);
  // console.log("district status :", currDistrictStatus);

  useEffect(() => {
    setDistrict(new Array(stateNames.length).fill().map(() => new Array()));
    setCurrentDistrictStatus(new Array(stateNames.length).fill().map(() => new Array()));
  }, [teamLeaderId])

  const showDistrict = async (stateID, row) => {
    try {
      if (!stateID) return;
      const districtData = await axios.get(`${process.env.REACT_APP_URL}/field/showDistrict/?stateID=${stateID}`);

      console.log("District Data : ", districtData.data.Districts.district);
      const response = await districtData.data.Districts.district;

      setDistrict((previousData) => {
        const updateDistrictData = previousData.map((data) => [...data]);
        updateDistrictData[row] = response;
        return updateDistrictData;
      });

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

      setCurrentDistrictStatus((previous) => {
        console.log(previous, row);
        const copyCurrentDistrictStatus = previous.map((data) => [...data]);
        copyCurrentDistrictStatus[row] = updatedCurrentDistrictStatus;
        return copyCurrentDistrictStatus;
      });

    } catch (error) {
      console.error(error);
    }

  }

  const handleStateChangeCheckBoxes = (e, pos) => {
    const stateID = e.target.value;

    console.log("state Id : ",stateID);

    const stateStatusList = [...currentStateStatus];
    if (e.target.checked) {

      stateStatusList[pos] = stateID;
      console.log("my check state is ", stateStatusList);
      showDistrict(stateID, pos);
      // console.log("district checked: ",district);
    } else {

      // stateStatusList = stateStatusList.filter((id) => id !== stateID); //change here

      // it work when we unchecked input
      stateStatusList[pos] = 0;
      setDistrict((previousData) => {
        const copyCurrentDistrictStatus = previousData.map((data) => [...data]);
        console.log("copycurrdistrictStatus", copyCurrentDistrictStatus);
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

  // const handleChangesCheckBox = (e, row, col) => {
  //   console.log("row and col are : ", row, col);
  //   const checkBoxedUpdated = currDistrictStatus.map((data) => [...data]);
  //   console.log("checkboxStatus: ", checkBoxedUpdated);


  //   if (currDistrictStatus !== -1) {
  //     if (e.target.checked) {
  //       checkBoxedUpdated[row][col] = true;
  //     } else {
  //       checkBoxedUpdated[row][col] = false;
  //     }
  //   }
  //   console.log("current disrtrict Status", currDistrictStatus[row][col]);
  //   console.log("updated list of checked boxed", checkBoxedUpdated);
  //   setCurrentDistrictStatus(checkBoxedUpdated);

  //   // Remove unselected districts from assignedDistricts list
  //   const selectedDistrictName = district[row][col].name;
  //   if (!e.target.checked) {
  //     setAssignedDistricts((prev) => prev.filter((dist) => dist !== selectedDistrictName));
  //   }

  // }

  // const handleChangesCheckBox=(e,row,col)=>{ // in 
  //   const districtName=district[row][col].name;
  //   const isChecked=e.target.value;

  //   setCurrentDistrictStatus((prevStatus)=>{
  //     const updatedStatus=prevStatus.map((data)=>[...data]);
  //      updatedStatus[row][col]=isChecked;
  //      return updatedStatus;
  //   });

  //   setAssignedDistricts((prevAssigned)=>{
  //     if(isChecked){
  //       return [...new Set([...prevAssigned, districtName])];
  //     }else{
  //       return prevAssigned.filter((dist) => dist === districtName);
  //     }
  //   })
  // }

  const handleChangesCheckBox = (e, row, col) => {
    const districtName = district[row][col].name;
    const isChecked = e.target.checked;

    setCurrentDistrictStatus((prevStatus) => {
      const updatedStatus = prevStatus.map((data) => [...data]);
      updatedStatus[row][col] = isChecked;
      console.log("updateStatus : ",updatedStatus);
      return updatedStatus;
    });

    setAssignedDistricts((prevAssigned) => {
      const updatedAssigned = isChecked
        ? [...new Set([...prevAssigned, districtName])]  // Add if checked
        : prevAssigned.filter((dist) => dist !== districtName);  // Remove if unchecked

      // Find newly added districts
      const addedDistricts = updatedAssigned.filter(dist => !oldAssignedDistricts.includes(dist));
      console.log("Added Districts:", addedDistricts);

      // Find removed districts
      const removedDistricts = oldAssignedDistricts.filter(dist => !updatedAssigned.includes(dist));
      console.log("Removed Districts:", removedDistricts);

      return updatedAssigned;
    });
  };

  function changehandler(e) {
    e.preventDefault();
    setformdata((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      }
    })
  }

  const Styles = {
    topText: { borderRadius: '5px', height: '2rem', border: '2px solid #BBB8B8' },
    submitBtnForTL: {},
    inputBottomMargin: { marginBottom: '1rem' }
  }


  const handleEmployeeUpdateSubmit = async (e) => {
    e.preventDefault();

    if (form.emp === " ") {
      alert('Enter the name');
      return;
    }

    const addedDistricts = assignedDistricts.filter(dist => !oldAssignedDistricts.includes(dist));
    const removedDistricts = oldAssignedDistricts.filter(dist => !assignedDistricts.includes(dist));

    console.log("Final Assigned Districts:", assignedDistricts);
    console.log("Added Districts:", addedDistricts);
    console.log("Removed Districts:", removedDistricts);

    try {
      const states = currentStateStatus.filter(state => state !== 0 && state !== undefined);
      const selectedState = [];

      // console.log("state : ", states);

      for (let index = 0; index < currentStateStatus.length; index++) {
        if (currentStateStatus[index] !== 0 && currentStateStatus[index] !== undefined) {
          selectedState.push(currentStateStatus[index]);
        }
      }
      console.log("state selected: ", selectedState);
      
      // Extracting district names where status is true
      const selectedDistricts = [];
      currDistrictStatus.forEach((districtRow, rowIndex) => {
        districtRow.forEach((status, colIndex) => {
          if (status === true) {
            selectedDistricts.push(district[rowIndex][colIndex].name); // Extracting name
          }
        });
      });


      console.log(" New Selected Districts: ", selectedDistricts);



      //// finding the status of newSeleted district
      const districtSts = [];
      for (let index = 0; index < currDistrictStatus.length; index++) {

        if (currDistrictStatus[index] !== 0 || currDistrictStatus[index] === undefined) {
          districtSts.push(currDistrictStatus[index]);
        }

      }

      if (selectedState.length === 0) {
        alert('Select the states');
        return;
      }
      if (district.length === 0) {
        alert('Select the districts to be assigned');
        return;
      }

      let updateData = await axios.put(`${process.env.REACT_APP_URL}/emp/UpdateEmployee`, {
        empId: data2[0]?.empID,
        name: form?.emp,
        mobile: form?.phone,
        teamleader: teamLeaderId,
        // stateID: selectedState,
        // district: selectedDistricts,
        stateID: currentStateStatus.filter(state => state !== 0 && state !== undefined),
        district: assignedDistricts, // Send final updated districts
        // addedDistricts: addedDistricts,  // Send added separately
        // removedDistricts: removedDistricts // Send removed separately
      });
      alert("Employee added Successfully");

      if (updateData.data.success) {
        setformdata({});
        setDefaultTeamLeader("Assign a TL", null);
        setStateNames([]);
        setDistrict(new Array(stateNames.length).fill().map(() => new Array()));
        setCurrentDistrictStatus(new Array(stateNames.length).fill().map(() => new Array()));
        setAssignedDistricts([]); // Reset assigned districts

        navigate("/admin/employee-dashboard");
      }

      console.log("updated data: ", updateData);

    } catch (error) {
      console.error("Error updating employee:", error);
      alert(error.response?.data?.msg || "Failed to update employee.");
    }


  }

  return (
    <form method="POST" onSubmit={handleEmployeeUpdateSubmit} style={{ overflow: 'auto', height: '100vh' }}>
      <div className='outer'>
        <div className="top">
          <h1 align="center">Update Employee</h1>
          <label htmlFor='empID'>Employee Id</label>
          <input type="text" name="empID" id="empID" style={Styles.topText} value={data2[0]?.empID} disabled={true} />
        </div>


        <div className="bottom">
          <div className="bottomLeft ">
            <label htmlFor='empName'>Name</label>
            <input type="text" name="emp" value={form?.emp} onChange={changehandler}></input>

            <label htmlFor='empMobile'>Mobile</label>
            <input type="number" id="phone" name="phone" placeholder="9999XXXXXX" value={form?.phone} onChange={changehandler} pattern="[0-9]{10} " required />


            <div>
              <label htmlFor='empDepartment'>Team Leader</label>
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
                        <input type="checkbox" name="state" id={state} value={_id} style={{ width: 'min-content', fontSize: '15px', }} onChange={(event) => { handleStateChangeCheckBoxes(event, index) }} />
                        <label style={{ padding: '5px', fontSize: '15px', width: 'max-content', color: 'black' }} htmlFor={state}>{state}</label>
                      </div>
                    ))
                  }
                </section>
              </fieldset>
            </div>

            <div>
              <fieldset style={{ marginTop: '1rem', marginBottom: "1rem" }}>
                <legend style={{ fontWeight: '700', margin: '1rem', padding: '0px 5px', color: '#880104' }}>
                  District
                </legend>
                <section style={{ overflowY: 'auto', height: '180px', width: '95%', margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px' }}>

                  {/* Show default district when no state is selected */}
                  {currentStateStatus?.every(status => status === 0) ? (
                    form?.distict?.map((item) => (
                      // console.log("items ",item);
                      <div>
                        <input type="checkbox" checked name={item} id={item} />
                        <label style={{ color: "black" }} htmlFor={item}>{item}</label>
                      </div>
                    ))

                  ) : (
                    /* Show assigned districts when a state is selected */
                    district.map((eachDistrict, row) =>
                      eachDistrict.map(({ _id, name, status }, col) => (
                        <div key={_id} style={{ display: 'flex', width: 'min-content', gap: '4.5px', }}>
                          <input type="checkbox" name="district" id={name} value={name} style={{ width: 'min-content' }} checked={assignedDistricts.includes(name) || currDistrictStatus[row][col] === true} onChange={(e) => { handleChangesCheckBox(e, row, col) }}  />
                          <label htmlFor={name} style={{ padding: '0px', color: "black", fontSize: '12px', width: 'max-content' }}>
                            {name}
                          </label>
                        </div>
                      ))
                    )
                  )}
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

export default Update