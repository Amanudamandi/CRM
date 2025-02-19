import React, { useEffect, useState } from 'react';
import New from './New';
import { showEmployeeApi } from '../../../../Utils/showEmployeeAPI';


const Index = ({ pageCount, departmentID, coordinatorID }) => {

    const Styles = {
        tableBody: { height: '100%', overflow: 'scroll' },
        employeeValue: { padding: '0.3rem', fontSize: '1rem', textAlign: 'center', fontWeight: '500', whiteSpace: 'nowrap' }
    }
    const [employeesData, setEmployeesData] = useState([]);

    useEffect(() => {
        console.log(departmentID, coordinatorID);
        setEmployeesData(() => []);

        //fecthing the data from the setEmployeeApi and update it in employeeData
        showEmployeeApi(setEmployeesData, pageCount, departmentID, coordinatorID);

    }, [pageCount]);

   


    return (
        <tbody style={Styles.tableBody}>
            {
                employeesData.length && employeesData.map(({ _id, name, empID, department, teamLeader, mobile, stateID, district }) => (
                    <New id={_id} name={name} empID={empID} department={department} teamLeader={teamLeader} mobile={mobile} stateID={stateID} district={district} />
                ))
            }
        </tbody>
    )
}


export default Index;


