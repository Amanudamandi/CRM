import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import LeadBoardHeader from '../../../component/Common/showLeadsHeader/index';
import { useAuth } from '../../../Context/Authentication/AuthContext';
import { showDepartmentApi } from '../../../Utils/showDepartmentAPI';
import { showEmployeeApi } from '../../../Utils/showEmployeeAPI';
import { showTeamLeaderName } from '../../../Utils/showTeamLeaderNameAPI';
import { downloadReport } from '../../../Utils/downloadReportAPI';
import { employeeLeads } from '../../../Utils/employeeLeadsAPI';
import { stateListApi } from '../../../Utils/stateListAPI';
import { showStageApi } from '../../../Utils/showStagesAPI';
import Loader from '../../../component/Common/Loader/index';

const Index = ( { startIndex = 1 }) => {
    const { isAuthenticated } = useAuth();
    // const [ leadClickedInfo, setLeadClickedInfo ] = useState({ clicked: false });
    const [ showDepartments, setShowDepartments ] = useState([]);
    const [ selectedDepartmentID, setSelectedDepartmentID ] = useState('');
    const [ showDepartmentEmployees, setShowDepartmentEmployees ] = useState([]);
    const [ selectedDepartmentEmployeeId, setSelectedDepartmentEmployeeId ] = useState('');
    const [ startDate, setStartDate ] = useState('');
    const [ endDate, setEndDate ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);
    const [ showAllStates, setShowAllStates ] = useState([]);
    const [ selectedStateId, setSelectedStateId ] = useState('');
    const [ showAllStages, setShowAllStages ] = useState([]);
    const [ selectedStageId, setSelectedStageId ] = useState('');
    console.log(isAuthenticated);

    const Styles = {
        adminContainer: { position: 'relative', display: 'grid', height: '100vh', gridTemplateColumns: '1fr', gridTemplateRows: '3.5rem 1fr', backgroundColor: '#E8EFF9', overflow: 'hidden' },
        navBar: { gridRow: '1 / span 2' },
        dashboardContainer: { gridColumns: '2', gridRow: '1' },
        headerContainer: { display: 'flex', padding: '0.5rem 1rem', position: 'sticky', left: 0, top: 0 },
        reportContainer: { gridColumns: '2', gridRow: '2', backgroundColor: '#fff', margin: '0.5rem 1rem', borderRadius: '5px', overflow: 'auto' },
        dropDownContainers: { margin: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 5rem', gap: '16px', width: '95%', justifyContent: 'space-evenly' },
        eachDropDown: { display: 'flex', flexDirection: 'column', gap: '5px', padding: '1rem 0rem' },
        optionLabel: { fontWeight: '600' },
        selectFields: { padding: '0.5rem 0.2rem', border: '2px solid grey', borderRadius: '5px', fontWeight: '600'},
        loaderMainContainer: {
            width: '79%',
            height: '91vh',
        },
        loaderContainer: {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-40%, -50%)',
            zIndex: 9999,
        }
    }

    useEffect( () => {
        let isMounted = true;
        showStageApi(isMounted, setShowAllStages);
        showDepartmentApi( setShowDepartments );
        stateListApi(setShowAllStates);
        startIndex === 1 ? showTeamLeaderName( setShowDepartmentEmployees )
        .then((res) => {
            const result = [ {_id: '', name: 'Select the Employee'}, ...res];
            setShowDepartmentEmployees(result);
        }) : showEmployeeApi( setShowDepartmentEmployees, 1, selectedDepartmentID, '')
        .then((res) => {
            const result = [ {_id: '', name: 'Select the Employee'}, ...res];
            setShowDepartmentEmployees(result);
        });
        return () => {
            isMounted = false;
        }
    }, []); 

    useEffect( () => {
        let name = '';
        for(let data of showDepartments){
            if(data._id === selectedDepartmentID){
                name = data.department;
            }
        }
        
        if(name === "Coordinator"){
            showTeamLeaderName( setShowDepartmentEmployees )
            .then((res) => {
                const result = [ {_id: '', name: 'Select the Employee'}, ...res];
                setShowDepartmentEmployees(result); 
            });
        }
        else if(name === "Calling Team" || name === "Field Sales"){
            showEmployeeApi( setShowDepartmentEmployees, 1, selectedDepartmentID, '')
            .then((res) => {
                const result = [ {_id: '', name: 'Select the Employee'}, ...res];
                setShowDepartmentEmployees(result);
            });
        }

    }, [selectedDepartmentID]);

    const handleOnSubmit = (event) => {
        event.preventDefault();
        // if( selectedDepartmentID === null ){
        //     alert('Fill all the fields');
        //     return;
        // }
        // console.log("Button Clicked");
        // // if( selectedDepartmentEmployeeId === null || startDate === null || endDate === null){
        // //     alert('Fill all the fields');
        // //     return;
        // // }
        setIsLoading(true);
        let name = '';
        for(let data of showDepartments){
            if(data._id === selectedDepartmentID){
                console.log("Selected Department ID: ", data._id);
                name = data.department;
                console.log("Data:",data);
            }
        }
        console.log(name, selectedDepartmentEmployeeId);

        if(name === "Coordinator" || name === ""){
            console.log("SelectedStageId", selectedStageId, "Selected State ID", selectedStateId);
            employeeLeads( null, '', selectedDepartmentEmployeeId, '', '', startDate, endDate, '', '', '', '', selectedStageId, selectedStateId)
            .then((res) => {
                // console.log(res);
                if(res === null || res === undefined){
                    alert("No Record of the selected Employee");
                    setIsLoading(false);
                    return;
                }
                if(res.length === 0){
                    setIsLoading(false);
                }
                // console.log(res);
                const jsonData = [];
                let teamLeader;
                if(res.length !== 0)
                    teamLeader = res[0].TLID;
                for(let index = 0; index < res.length; index++){
                    const { name, mobile, district,  stateID , empID, source, stageID, kwpInterested, CurrentDate, stageActivity } = res[index];
                    const temp = { 
                        Calling_Person: empID?.name ? empID.name : '',  
                        Client_Name: name || '' ,
                        Mobile: mobile || '',
                        KWP_Interested: kwpInterested || '',
                        stage: stageID?.stage ? stageID.stage : '',
                        District: district || '',
                        state: stateID?.state ? stateID.state : '',
                        Source: source || '',
                        Date: CurrentDate || '',
                        remark: stageActivity[stageActivity.length-1]?.remark || ''
                    }
                    jsonData.push(temp);
                }
                if(jsonData.length === 0){
                    alert("No Record Found");
                    return;
                }
                downloadReport( setIsLoading, jsonData, name !== "" ? teamLeader.name : "StateList");
            });
        }
        else if(name === "Calling Team" || name === "Field Sales"){
            console.log("SelectedStageId", selectedStageId, "Selected State ID", selectedStateId);
            employeeLeads(null, selectedDepartmentEmployeeId, '', '', '', startDate, endDate, '', '', '', '', selectedStageId, selectedStateId)
            .then((res) => {
                // console.log(res);
                if(res === null || res === undefined){
                    alert("No Record of the selected Employee");
                    setIsLoading(false);
                    return;
                }
                console.log(res);
                const jsonData = [];
                // const { name, mobile, district,  stateID , empID, source, stageID, kwpInterested, CurrentDate } = res;
                // console.log(res);
                for(let index = 0; index < res.length; index++){
                    const { name, mobile, district,  stateID , empID, source, stageID, kwpInterested, CurrentDate, stageActivity } = res[index];
                    const temp = { 
                        Calling_Person: empID?.name ? empID.name : '',  
                        Client_Name: name || '',
                        Mobile: mobile || '',
                        KWP_Interested: kwpInterested || '',
                        stage: stageID?.stage ? stageID.stage : '',
                        District: district || '',
                        state: stateID?.state ? stateID.state : '',
                        Source: source || '',
                        Date: CurrentDate || '',
                        remark: stageActivity[stageActivity.length-1]?.remark || ''
                    }
                    console.log(temp);
                    jsonData.push(temp);
                }
                
                downloadReport( setIsLoading, jsonData, 'CallingTeam');
            });
        }
    }


    return (
        <section style={Styles.adminContainer}>
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
            <div style={Styles.dashboardContainer}>
                <div style={Styles.headerContainer}>
                    <LeadBoardHeader
                        title='Report Board'
                    />
                </div>
            </div>

            <div style={Styles.reportContainer}>
                <div style={Styles.dropDownContainers}>
                    <div style={Styles.eachDropDown}>
                        <label htmlFor="department" style={Styles.optionLabel}>Department</label>
                        <select style={Styles.selectFields} name="department" id="department" 
                            onChange={(event) => { console.log(event.target.value); setSelectedDepartmentID(event.target.value)}}
                        >
                            <option value="">Select the Coordinator</option>
                            {
                                showDepartments.map(({_id, department}, index) => (
                                    index >= startIndex && <option value={_id}>{department}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div style={Styles.eachDropDown}>
                        <label htmlFor="employees" style={Styles.optionLabel}>Department Employee</label>
                        <select style={Styles.selectFields} name="employees" id="employees"
                            onChange={(event) => { 
                                console.log("Department Employee ID: ",event.target.value); 
                                setSelectedDepartmentEmployeeId(event.target.value) 
                            }}
                        >
                            {

                                showDepartmentEmployees.map(({ _id, name }) => (
                                    <>
                                        <option value={_id}>{name}</option>
                                    </>
                                ))
                            }
                        </select>
                    </div>

                    <div style={Styles.eachDropDown}>
                        <label htmlFor="stage" style={Styles.optionLabel}>Stage</label>
                        <select style={Styles.selectFields} name="stage" id="stage"
                            onChange={(event) => { 
                                console.log("Stage Id: ",event.target.value); 
                                setSelectedStageId(event.target.value); 
                            }}
                        >
                            <option value="">Select the Stage</option>
                            {

                                showAllStages.map(({ _id, stage }) => (
                                    <>
                                        <option value={_id}>{stage}</option>
                                    </>
                                ) )
                            }
                        </select>
                    </div>

                    <div style={Styles.eachDropDown}>
                        <label htmlFor="state" style={Styles.optionLabel}>State</label>
                        <select style={Styles.selectFields} name="state" id="state"
                            onChange={(event) => { 
                                console.log("state ID: ",event.target.value); 
                                setSelectedStateId(event.target.value) 
                            }}
                        >
                            <option value="">Select the State</option>
                            {

                                showAllStates.map(({ _id, state }) => (
                                    <>
                                        <option key={_id} value={state}>{state}</option>
                                    </>
                                ) )
                            }
                        </select>
                    </div>
                    
                    <div style={Styles.eachDropDown}>
                        <label htmlFor="start-date" style={Styles.optionLabel}>Start Date</label>
                        <input onChange={(event) => { console.log(event.target.value); setStartDate(event.target.value)}} style={Styles.selectFields} type="date" name="start-date" id="start-date" />
                    </div>

                    <div style={Styles.eachDropDown}>
                        <label htmlFor="end-date" style={Styles.optionLabel}>End Date</label>
                        <input onChange={(event) => { console.log(event.target.value); setEndDate(event.target.value)}} style={Styles.selectFields} type="date" name="end-date" id="end-date" />
                    </div>

                    <div style={Styles.eachDropDown}>
                        <label htmlFor="submit" style={Styles.optionLabel}>Download</label>
                        <button 
                            onClick={handleOnSubmit}
                            style={{...Styles.selectFields, backgroundColor: '#AA0B2B', border: '2px solid #AA0B2B', color: '#fff' }} 
                            type="submit" id='submit'
                        >
                            Get Report
                        </button>
                    </div>

                </div>
            </div>

            {isLoading && 
                <div style={{ ...Styles.loaderContainer, ...Styles.loaderMainContainer }}>
                    <div style={Styles.loaderContainer}>
                        <Loader />
                    </div>
                </div>
            }
        </section>
    )
}

export default Index;