import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { MdOutlineDeleteForever } from "react-icons/md";
import axios from 'axios';

const Index = ( { pageCount } ) => {

    const Styles = { 
        tableBody: { height: '100%', overflow: 'scroll'},
        employeeValue: { padding: '0.3rem', fontSize: '1rem', textAlign: 'center', fontWeight: '500', whiteSpace: 'nowrap' }
    }
    
    const convertTimeIntoDate = (dateString) => {
        return new Date(dateString);
    }  

    const [ leadData, setLeadData ] = useState([]);

    const showLeadsAPI = async() => {
        try{
            const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/client/fetchClients/?page=${pageCount}&limit=15`);
            // console.log(sendRequest);
            const response = await sendRequest.data;
            console.log(response.clients)
            // console.log(response.employees);
            setLeadData(response.clients);
        } catch(error){
            console.error(error);
        }
    } 

    useEffect(() => {
        showLeadsAPI();
    }, [pageCount]);


    return (
        <tbody style={Styles.tableBody}>
            {
                leadData.map(({_id, name, stageID, empID, email, source, mobile, stateID, district, kwpInterested, CurrentDate}) => (
                    <tr key={_id} style={{ borderBottom: '2px solid #fff' }} >
                        <td style={Styles.employeeValue}>{stageID ? stageID.stage : 'N/A'}</td>
                        <td style={Styles.employeeValue}>{empID ? empID.name : 'N/A'}</td>
                        <td style={Styles.employeeValue}>{name ? name : 'N/A'}</td>
                        {/* <td style={Styles.employeeValue}>{DOB ? `${convertTimeIntoDate(DOB).getDate()}/${convertTimeIntoDate(DOB).getMonth()}/${convertTimeIntoDate(DOB).getFullYear()}` : '-'}</td> */}
                        {/* <td style={Styles.employeeValue}>{DOJ ? `${convertTimeIntoDate(DOJ).getDate()}/${convertTimeIntoDate(DOJ).getMonth()}/${convertTimeIntoDate(DOJ).getFullYear()}` : '-'}</td> */}
                        <td style={Styles.employeeValue}>{kwpInterested ? kwpInterested : 'N/A'}</td>
                        <td style={Styles.employeeValue}>{email ? email : 'N/A'}</td>
                        {/* <td style={Styles.employeeValue}>{email ? email : 'N/A'}</td> */}
                        <td style={Styles.employeeValue}>{mobile ? mobile : 'N/A'}</td>
                        <td style={Styles.employeeValue}>{source ? source : 'N/A'}</td>
                        {/* <td style={Styles.employeeValue}>{workLocation ? workLocation : 'N/A'}</td> */}
                        {/* <td style={Styles.employeeValue}>{license ? license : 'N/A'}</td> */}
                        <td style={Styles.employeeValue}>{stateID ? stateID.state : 'N/A'}</td>
                        <td style={Styles.employeeValue}>{district ? district : 'N/A'}</td>
                        <td style={Styles.employeeValue}>{CurrentDate ? `${convertTimeIntoDate(CurrentDate).getDate()}/${convertTimeIntoDate(CurrentDate).getMonth()}/${convertTimeIntoDate(CurrentDate).getFullYear()}` : 'N/A'}</td>
                        <td style={{...Styles.employeeValue, cursor: 'pointer'}}> <MdOutlineDeleteForever size={20} color='#AA0B2B' /> </td>
                    </tr>
                ))
            }
        </tbody>
    )
}


export default Index;