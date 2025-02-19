import axios from 'axios';
import { set } from 'date-fns';
import React, { useEffect, useState } from 'react'
import DynamicDropDown from '../../DropDown2/index';
import { use } from 'react';

const Update = ({ data2, setdata }) => {
  console.log("DATA2", data2)
  const [form, setformdata] = useState({
    emp: data2[0]?.name || '',
    phone: data2[0]?.mobile || '',
    leader: data2[0]?.teamLeader?.name || '',
    state: data2[0]?.stateID[0]?.state || '',
    distict: data2[0]?.district
  })


  const [teamLeaderList, setTeamLeaderList] = useState(null);
  const [teamLeaderId, setTeamLeaderId] = useState(null);
  const [selectedTeamLeader, setSelectedTeamLeader] = useState(null);
  const [isTeamLeaderOpen, setIsTeamLeaderOpen] = useState(null);
  const [stateNames, setStateNames] = useState([]);

  const [currentStateStatus, setCurrentStateStatus] = useState(new Array(stateNames.length).fill(0));
  const [isChecked, setIsChecked] = useState(true);

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
    setDefaultTeamLeader(form.leader, null);
  }

  console.log("all team leader", teamLeaderList);
  console.log("selectes Team leader : ", selectedTeamLeader);


  // const handleStateChangeCheckBoxes = () => { }

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

  const [district, setDistrict] = useState([]);
  const [defaultDistrict, setDefaultDistrict] = useState(data2[0]?.district || []);
  const [currDistrictStatus, setCurrentDistrictStatus] = useState(new Array(stateNames.length).fill().map(() => new Array()));

  useEffect(() => {
    setDistrict(new Array(stateNames.length).fill().map(() => new Array()));
    setCurrentDistrictStatus(new Array(stateNames.length).fill().map(() => new Array()));
  }, [teamLeaderId])


  const showDistrict = async (stateId, row) => {
    if (!stateId) return;
    const districtData = await axios.get(`${process.env.REACT_APP_URL}/field/showDistrict/?stateID=${stateId}`);

    console.log("District : ", districtData.data.Districts.district);
    const response = await districtData.data.Districts.district;

    setDistrict((previousData) => {
      const updateDistrictData = previousData.map((data) => [...data]);
      updateDistrictData[row] = response;
      return updateDistrictData;
    });
  }


  const handleStateChangeCheckBoxes = (e, pos) => {
    const stateStatusList = [...currentStateStatus];
    if (e.target.checked) {
      stateStatusList[pos] = e.target.value;
      console.log("my check state is ", stateStatusList);
      showDistrict(e.target.value, pos);
    } else {
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
  // const Styles = {
  //   topText: { borderRadius: '5px', height: '2rem', border: '2px solid #BBB8B8' }
  // }
  return (
    <form>
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
                        <label style={{ padding: '5px',  fontSize: '15px', width: 'max-content', color: 'black' }} htmlFor={state}>{state}</label>
                      </div>
                    ))
                  }
                </section>
              </fieldset>
            </div>





            <div>
              <fieldset style={{ marginTop: '0.5rem' }}>
                <legend style={{ fontWeight: '700', margin: '1rem', padding: '0px 5px', color: '#880104' }}>
                  District
                </legend>
                <section style={{ overflowY: 'auto', height: '180px', width: '95%', margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px' }}>

                  {/* Show default district when no state is selected */}
                  {currentStateStatus.every(status => status === 0) ? (
                    <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', MaxWidth: '100%' }}>
                      <label htmlFor={form.distict} style={{
                        color: "black",
                        padding: '0px',
                        fontSize: '15px',
                        width: '95%',
                         gap: '10px',
                      }}>
                        {Array.isArray(form.distict) ? form.distict.join(', ') : form.distict}
                      </label>
                    </div>

                  ) : (
                    /* Show assigned districts when a state is selected */
                    district.map((eachDistrict, row) =>
                      eachDistrict.map(({ _id, name, status }) => (
                        <div key={_id} style={{ display: 'flex', width: 'min-content', gap: '4.5px', textDecoration: status ? 'line-through' : 'none' }}>
                          <input type="checkbox" name="district" id={name} value={name} style={{ width: 'min-content' }} disabled={status} />
                          <label htmlFor={name} style={{ padding: '0px', color: status ? 'rgb(120, 120, 120)' : '#000', fontSize: '12px', width: 'max-content' }}>
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