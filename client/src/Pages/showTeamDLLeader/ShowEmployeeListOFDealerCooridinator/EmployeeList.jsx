import React from 'react';
import { useState, useEffect } from 'react';
import { dealerCoordinatorEmpAPI } from '../../../Utils/dealerCoordinatorEmpAPI';


const EmployeeList = ({ coordinatorId, setEmployeeInfo, setShowLeadList }) => {

    const [coordinatorProfileList, setCoordinatorProfileList] = useState([]);

    useEffect(() => {
        console.log("id", coordinatorId);
        let isMounted = true;
        dealerCoordinatorEmpAPI(coordinatorId, isMounted, setCoordinatorProfileList);
        return () => {
            isMounted = false;
        }
    }, []);

    // console.log("coordinatorProfileList data ", coordinatorProfileList);

    const Styles = {
        tableBody: { height: '100%', overflow: 'scroll' },
        employeeValue: { padding: '0.3rem', fontSize: '1rem', textAlign: 'center', fontWeight: '500', whiteSpace: 'nowrap' }
    }
    const getStateName = (stateID) => {
        const state = stateID.map(state => state?.state);
        // console.log("GF", state)
        return state ? state.join(" , ") : 'N/A';
    };
    return (
        <tbody style={Styles.tableBody}>
            {
                coordinatorProfileList?.length === 0 ? <tr style={Styles.employeeValue}> <td colSpan={12} rowSpan={12}>No Data Found</td></tr> :
                    // coordinatorProfileList?.map(({ _id, empID, name, department, mobile, stateID}) => (
                    //     <tr key={_id} style={{ borderBottom: '2px solid #ddd', cursor: 'pointer' }}
                    //         onClick={() => {
                    //             setShowLeadList(true);
                    //             setEmployeeInfo({ _id, empID, name, mobile, stateID });
                    //         }}
                    //         >
                    //         {console.log("stateId of store statecss : ",stateID)}
                    //         <td style={Styles.employeeValue}>{name ? name : 'N/A'}</td>
                    //         <td style={Styles.employeeValue}>{department ? department.department : 'N/A'}</td>
                    //         <td style={Styles.employeeValue}>{mobile ? mobile : 'N/A'}</td>
                    //         <td style={{ ...Styles.employeeValue, textAlign: 'start' }}></td>

                    //     </tr>
                    // ))
                    coordinatorProfileList?.map(({ _id, empID, name, department, mobile, stateID }) => (
                        <tr key={_id} style={{ borderBottom: '2px solid #ddd', cursor: 'pointer' }}
                            onClick={() => {
                                setShowLeadList(true);
                                setEmployeeInfo({ _id, empID, name, mobile, stateID });
                            }}
                        >
                            {/* {console.log("stateId of store statecss : ", stateID)} */}
                            <td style={Styles.employeeValue}>{name ? name : 'N/A'}</td>
                            <td style={Styles.employeeValue}>{department ? department.department : 'N/A'}</td>
                            <td style={Styles.employeeValue}>{mobile ? mobile : 'N/A'}</td>
                            <td style={{ ...Styles.employeeValue, textAlign: 'start' }}>
                                {getStateName(stateID)}
                            </td>
                        </tr>
                    ))
            }
        </tbody>
    )
}


export default EmployeeList;
