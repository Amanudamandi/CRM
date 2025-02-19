import React from 'react';
import { useState, useEffect } from 'react';
import { employeeLeads } from '../../../../Utils/employeeLeadsAPI';

const Index = ({ employeeId, setShowLeadUpdateForm, pageCount = 1, updateLeadBtnClicked, setUpdateLeadBtnClicked, limit, storeFilterData, isFilterAppliedClicked, setIsFilterAppliedClicked, isResetFilterBtnClicked, setIsResetFilterBtnClicked, setIsLoading }) => {

    const Styles = {
        tableBody: { height: '100%', overflow: 'scroll' },
        employeeValue: { padding: '0.3rem', fontSize: '1rem', textAlign: 'center', fontWeight: '500', whiteSpace: 'nowrap' }
    }

    const [employeeProfileList, setEmployeeProfileList] = useState(null);

    const convertTimeIntoDate = (dateString) => {
        return new Date(dateString);
    }

    // useEffect(() => {
    //     console.log(employeeId);
    //     employeeLeads(setEmployeeProfileList, employeeId, '', pageCount, limit).then(() => {
    //         setUpdateLeadBtnClicked(false);
    //     });
    // }, [pageCount, updateLeadBtnClicked, limit]);

    useEffect(() => {
        // console.log(updateLeadBtnClicked);
        // console.log(storeFilterData);
        let mobile = storeFilterData.Mobile;
        if(mobile){
            if(mobile[0] === '+'){
                mobile = encodeURIComponent(mobile);
            }
        }
        console.log(mobile);
        employeeLeads(setEmployeeProfileList, employeeId, '', pageCount, limit, storeFilterData.startDate, storeFilterData.endDate, storeFilterData.Name, storeFilterData.Email, mobile, storeFilterData.Source, storeFilterData.Stage, storeFilterData.State, storeFilterData.District, storeFilterData['KWP Interested'], storeFilterData.Type, setIsLoading).then(() => {
            if (isFilterAppliedClicked) {
                setIsFilterAppliedClicked(false);
            }
            if(isResetFilterBtnClicked){
                setIsFilterAppliedClicked(false);
            }
            setUpdateLeadBtnClicked(false);
        });

    }, [pageCount, limit, isFilterAppliedClicked, updateLeadBtnClicked, setIsResetFilterBtnClicked]);

    return (
        <tbody style={Styles.tableBody}>
            {
                employeeProfileList && employeeProfileList.map(({ _id, name, email, type, stageID, stateID, city, district, mobile, kwpInterested, source, CurrentDate }) => (
                    <tr
                        key={_id}
                        style={{ borderBottom: '2px solid #ddd', cursor: 'pointer' }}
                        onClick={() =>
                            setShowLeadUpdateForm((previous) => ({ ...previous, clicked: true, _id, name, email, mobile, type, state: stateID !== null ? stateID.state : null, stageID, district, city, kwpInterested, source, CurrentDate }))
                        }
                    >
                        <td style={Styles.employeeValue}>{stageID ? stageID.stage : 'N/A'}</td>
                        <td style={Styles.employeeValue}>{name ? name : 'N/A'}</td>
                        <td style={Styles.employeeValue}>{mobile ? mobile : 'N/A'}</td>
                        <td style={Styles.employeeValue}>{email ? email : 'N/A'}</td>
                        <td style={Styles.employeeValue}>{kwpInterested ? kwpInterested : 'N/A'}</td>
                        <td style={Styles.employeeValue}>{type ? type === 1 ? 'Hot' : type === 2 ? 'Warm' : 'Cold' : 'N/A'}</td>
                        <td style={Styles.employeeValue}>{district ? district : 'N/A'}</td>
                        <td style={Styles.employeeValue}>{CurrentDate ? `${convertTimeIntoDate(CurrentDate).getDate()}/${convertTimeIntoDate(CurrentDate).getMonth()}/${convertTimeIntoDate(CurrentDate).getFullYear()}` : '-'}</td>
                    </tr>
                ))
            }
        </tbody>
    )
}


export default Index;