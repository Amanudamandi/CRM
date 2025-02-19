import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { MdOutlineDeleteForever } from "react-icons/md";
import { showEmployeeApi } from '../../../../Utils/showEmployeeAPI';
import { useNavigate } from 'react-router-dom';

function New({_id,name,empID,department,teamLeader,mobile, stateID,district , showDeleteButton = false }) {
    const Styles = { 
        tableBody: { height: '100%', overflow: 'scroll'},
        employeeValue: { padding: '0.3rem', fontSize: '1rem', textAlign: 'center', fontWeight: '500', whiteSpace: 'nowrap' }
    }

        const navigate=useNavigate();
        const updateData=()=>{
           try{
            navigate(`/admin/employee-dashboard/update/${empID}`)
           }catch(err){
            console.log(err);
           }
        }
    
    return (
        <>
            <tr key={_id} style={{ borderBottom: '2px solid black' }}  onClick={updateData} >
                <td style={Styles.employeeValue}>{empID ? empID : 'N/A'}</td>
                <td style={Styles.employeeValue}>{name ? name : 'N/A'}</td>
                <td style={Styles.employeeValue}>{department ? department.department : 'N/A'}</td>
                <td style={Styles.employeeValue}>{teamLeader ? teamLeader.name : 'N/A'}</td>
                <td style={Styles.employeeValue}>{mobile ? mobile : 'N/A'}</td>
                <td style={Styles.employeeValue}>{stateID.length !== 0 ? stateID.map(eachState => (
                    <span>{`${eachState.state},`}</span>
                )) : 'N/A'}</td>
                <td style={{ ...Styles.employeeValue, textAlign: 'start' }}>{district.length ? district.map(dis => (
                    <span>{dis}, </span>
                )) : 'N/A'}</td>
                {showDeleteButton && <td style={{ ...Styles.employeeValue, cursor: 'pointer' }}> <MdOutlineDeleteForever size={20} color='#AA0B2B' /> </td>}
            </tr>
        </>
    )
}

export default New
