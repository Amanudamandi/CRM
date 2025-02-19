import React from 'react';
import { useEffect } from 'react';
import { CiFilter } from "react-icons/ci";
import { useState } from 'react';
import { showStageApi } from '../../../../Utils/showStagesAPI';
import { DateRangePicker } from 'react-date-range';
import enUS from "date-fns/locale/en-US";

import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 

const Index = ( { headingList, dropDownList, showDeleteButton, showSelectBox = false, storeFilterData = null, setStoreFilterData = null, setAppliedFilterClicked, setIsResetFilterBtnClicked, setSelectAllLeadsChecked } ) => {

    const Styles = {
        employeeTableHeadContainer: { backgroundColor: 'rgb(80, 80, 80)', position: 'sticky', top: '0', borderRadius: '5px', },
        employeeTableHead: {  color: '#fff', textAlign: 'center', padding: '0.5rem 0.2rem', whiteSpace: 'nowrap' },
    }

    const [ showStages, setShowStages ] = useState([]);
    const [ filterClickedStatus, setFilterClickedStatus ] = useState([]);
    const [ state, setState ] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
      ]);

    useEffect(() => {
        // console.log(state);
        const filterOpenOnHavingIcon = [];
        const updateFilterData = { startDate: '', endDate: '' };
        for(let index = 0; index < dropDownList.length; index++){
            if(dropDownList[index] === false){
                filterOpenOnHavingIcon[index] = -1;
            }
            else{
                filterOpenOnHavingIcon[index] = false;
            }
            // if(storeFilterData !== null) 
            updateFilterData[headingList[index]] = '';
        }
        console.log(updateFilterData);
        setFilterClickedStatus(filterOpenOnHavingIcon); 
        // if(storeFilterData !== null) 
            setStoreFilterData(updateFilterData);
    }, []);

    const handleCheckBox = (e) => {
        if(e.target.checked){
            setSelectAllLeadsChecked(true);
        }
        else{
            setSelectAllLeadsChecked(false);
        }
    }

    useEffect (() => {
        let isMounted = true;
        showStageApi(isMounted, setShowStages);
        return () => {
            isMounted = false;
        }
    }, []); 

    const handleOnClickFilter = (index) => {
        const copyFilterClickedStatus = [...filterClickedStatus];
        // console.log('Before Clicked', copyFilterClickedStatus);
        for(let anotherIndex = 0; anotherIndex < filterClickedStatus.length; anotherIndex++){
            if(copyFilterClickedStatus[anotherIndex] !== -1 && index !== anotherIndex){
                copyFilterClickedStatus[anotherIndex] = false;
            }
        }
        if(copyFilterClickedStatus[index] !== -1){
            copyFilterClickedStatus[index] = !copyFilterClickedStatus[index];
            setFilterClickedStatus(copyFilterClickedStatus);
        }
        // console.log("After Clicked", copyFilterClickedStatus);
    }

    const handleChangeDataOfFilterOptions = (event) => {
        const { name, value} = event.target;
        console.log(name, value);
        const updateFilterData = {...storeFilterData, [name] : value};
        setStoreFilterData(updateFilterData);
    }

    const handleResetAllFilter = () => {
        setIsResetFilterBtnClicked(true);
        let updateStoreFilterData = { }
        for(let data in storeFilterData){
            updateStoreFilterData[data] = ''
        }
        console.log(updateStoreFilterData);
        setStoreFilterData(updateStoreFilterData);
        // setFilterClickedStatus(copyFilterClickedStatus);
        // console.log(storeFilterData);
    }

    const dateObj = (newDate) => {
        return new Date(newDate);
    }


    return(
        <thead style={Styles.employeeTableHeadContainer}>
            {showSelectBox && <th style={Styles.employeeTableHead} onClick={handleCheckBox}><input type="checkbox" name="" id="" /></th>}
            {headingList.map((value, index) => (
                <th key={index} style={{...Styles.employeeTableHead, textAlign: value === 'Districts' ? "start" : "center"}}>
                    {value} { dropDownList[index] ? <CiFilter size={15} style={{ height: 'inherit', verticalAlign: 'bottom', cursor: 'pointer'}} onClick={() => handleOnClickFilter(index)} /> : null} 
                   { filterClickedStatus[index] !== -1 && filterClickedStatus[index] && <div style={{ width: 'inherit', position: 'absolute', border: '1px solid black', boxShadow: '0px 0px 10px black', backgroundColor: 'white', top: '36px', left: headingList[index] === 'Date' ? '50%' : 'inherit', padding: '8px 4px', }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {
                                headingList[index] === 'Stage' && 
                                <>
                                    <label htmlFor="Stage" style={{ color: 'black', textAlign: 'start', fontStyle: 'italic'}}>Select Stage</label>
                                    <select 
                                        name='Stage'
                                        id='Stage'
                                        style={{ width: '10rem', padding: '3px' }}
                                        onChange={handleChangeDataOfFilterOptions}
                                        value={ showStages.map(({_id, stage}) => {
                                            console.log(storeFilterData[index])
                                            if( headingList[index] === 'Stage' && storeFilterData[index] === _id) return stage;
                                            else return 'Select the Stage'
                                        })}
                                    >
                                        <option value="">Select the stage</option>
                                        {
                                            showStages.map(({ _id, stage}) => (
                                                <option value={_id}>{stage}</option>
                                            ))
                                        }
                                    </select>
                                </>
                            }
                            { 
                                headingList[index] === 'Type' && 
                                <>
                                    <label htmlFor="Type" style={{ color: 'black', textAlign: 'start', fontStyle: 'italic'}}>Select Stage</label>
                                    <select 
                                        name='Type'
                                        id='Type'
                                        style={{ width: '10rem', padding: '3px' }}
                                        onChange={handleChangeDataOfFilterOptions}
                                    >
                                        <option value=''>Select the type</option>
                                        <option value="Hot">Hot</option>
                                        <option value="Warm">Warm</option>
                                        <option value="Cold">Cold</option>
                                    </select>
                                
                                </>
                            }
                            {
                                headingList[index] === 'Date' && 
                                    <DateRangePicker
                                        ranges={state}
                                        onChange={item => {
                                            setState([item.selection]);
                                            console.log(`${dateObj(item.selection.startDate).getDate()}/${dateObj(item.selection.startDate).getMonth() + 1}/${dateObj(item.selection.startDate).getFullYear()}`);
                                            setStoreFilterData((previous) => ({...previous, startDate: `${dateObj(item.selection.startDate).getFullYear()}/${dateObj(item.selection.startDate).getMonth() + 1}/${dateObj(item.selection.startDate).getDate()}`, endDate: `${dateObj(item.selection.endDate).getFullYear()}/${dateObj(item.selection.endDate).getMonth() + 1}/${dateObj(item.selection.endDate).getDate()}`}))
                                        }}
                                        locale={enUS}  // Pass the locale here
                                    />
                            }
                            { headingList[index] !== 'Stage' && headingList[index] !== 'Date' && headingList[index] !== 'Type' && 
                                <>
                                    <label htmlFor="startWith" style={{ color: 'black', textAlign: 'start', fontStyle: 'italic'}}>Start's with</label>
                                    <input id='startWith' type="text" style={ { padding: '3px' }} name={headingList[index]} value={storeFilterData[headingList[index]]} placeholder={storeFilterData[headingList[index]] === '' && `Filter by ${headingList[index]}...`} onChange={handleChangeDataOfFilterOptions}/>
                                </>
                            }
                            <div style={ {  color: 'white', display: 'flex', justifyContent: 'space-between', gap: '2px' }}>
                                <div style={{ width: '98%', textAlign: 'center', backgroundColor: '#AA0B2B', padding: headingList[index] === 'Date'? '8px' : '4px', borderRadius: '2px', cursor: 'pointer'}}
                                    onClick={ () => {
                                        handleResetAllFilter();
                                        const copyFilterClickedStatus = [...filterClickedStatus];
                                        copyFilterClickedStatus[index] = false;
                                        setFilterClickedStatus(copyFilterClickedStatus);
                                    }}
                                >
                                    Reset
                                </div>
                                <div style={{ width: '98%', textAlign: 'center', backgroundColor: '#AA0B2B', padding: headingList[index] === 'Date'? '8px' : '4px', borderRadius: '2px', cursor: 'pointer'}} 
                                    onClick={() => {
                                        setAppliedFilterClicked(true);
                                        const copyFilterClickedStatus = [...filterClickedStatus];
                                        copyFilterClickedStatus[index] = false;
                                        setFilterClickedStatus(copyFilterClickedStatus);
                                    }}
                                >
                                    Apply
                                </div>
                            </div>
                        </div>
                    </div> }
                </th>
            ))}
            {showDeleteButton && <th style={Styles.employeeTableHead}>Delete</th>}
        </thead>
    )
}

export default Index;
