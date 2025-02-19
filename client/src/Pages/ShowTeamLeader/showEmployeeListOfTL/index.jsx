import React from 'react';
import { useState, useEffect } from 'react';
import { showTlProfile } from '../../../Utils/showCoordinatorProfileAPI';

const Index = ({ coordinatorId, setEmployeeInfo, setShowLeadList }) => {

    const [coordinatorProfileList, setCoordinatorProfileList] = useState([]);
    
    useEffect(() => {
        console.log(coordinatorId);
        let isMounted = true;
        showTlProfile(coordinatorId, isMounted, setCoordinatorProfileList);
        return () => {
            isMounted = false;
        }
    }, []);

    const Styles = {
        tableBody: { height: '100%', overflow: 'scroll'},
        employeeValue: { padding: '0.3rem', fontSize: '1rem', textAlign: 'center', fontWeight: '500', whiteSpace: 'nowrap' }
    }

    return (
        <tbody style={Styles.tableBody}>
            {
                coordinatorProfileList.length === 0 ? <tr style={Styles.employeeValue}> <td colSpan={12} rowSpan={12}>No Data Found</td></tr> : 
                    coordinatorProfileList.map(({ _id, empID, name, department, mobile, district }) => (
                        <tr key={_id} style={{ borderBottom: '2px solid #ddd', cursor: 'pointer' }}
                            onClick={() => {
                                setShowLeadList(true);
                                setEmployeeInfo({ _id, empID, name, mobile, district });
                            }}
                        >
                            <td style={Styles.employeeValue}>{name ? name : 'N/A'}</td>
                            <td style={Styles.employeeValue}>{department ? department.department : 'N/A'}</td>
                            <td style={Styles.employeeValue}>{mobile ? mobile : 'N/A'}</td>
                            <td style={{ ...Styles.employeeValue, textAlign: 'start' }}>{district.length ? district.join(' ') : 'N/A'}</td>
                        </tr>
                    ))
            }
        </tbody>
    )
}


export default Index;