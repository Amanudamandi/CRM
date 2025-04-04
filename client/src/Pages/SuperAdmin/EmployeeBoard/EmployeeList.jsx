import React, { useEffect, useState } from 'react'
import DashboardHeader from '../../../component/Common/Dashboard_Heading/index';
import FixedRow from '../../../component/Common/ShowEmployeeCard/FixedRow/index';
import axios from 'axios';
import { Data } from '@react-google-maps/api';
import { tr } from 'date-fns/locale';

const EmployeeList = () => {
    const Styles = {
        adminContainer: { position: 'relative', display: 'grid', height: '100vh', gridTemplateColumns: '1fr', gridTemplateRows: '3.5rem 1fr', backgroundColor: '#E8EFF9', overflow: 'hidden' },
        navBar: { gridRow: '1 / span 2' },
        dashboardContainer: { gridColumns: '2', gridRow: '1' },
        headerContainer: { padding: '0.5rem 1rem', position: 'sticky', left: 0, top: 0 },
        employeeContainer: { gridColumns: '2', gridRow: '2', backgroundColor: '#fff', margin: '0.5rem 1rem', borderRadius: '5px', overflow: 'auto' },
        employeeTable: { width: '100%', backgroundColor: '#fff', borderRadius: '5px' },
        employeeValue: { padding: '0.35rem 0rem', paddingRight: '1rem', fontSize: '1rem', textAlign: 'center', fontWeight: '500', whiteSpace: 'nowrap' },

    }


    const headingList =
        [
            'Employee Id', 'Name', 'Email', 'Department',
            'Mobile', 'State',
        ];

    const [limit, setLimit] = useState(35);

    const showDropDownList = new Array(headingList.length).fill(true);
    const [storeFilterData, setStoreFilterData] = useState({});
    const [isApplyFilterClicked, setAppliedFilterClicked] = useState(false);

    const [pageCount, setPageCount] = useState(1);

    const [apiData, setApiData] = useState([]);

    const increasePageCount = () => {
        setPageCount((pre) => pre + 1);
    }

    const decreasePageCount = () => {
        if (pageCount > 1)
            setPageCount((pre) => pre - 1);
    }

    const featchingData = async (event) => {
        let response = await axios.get(`${process.env.REACT_APP_URL}/ins/fetchAllIns`);
        console.log("data : ", response?.data);
        const apiResponse = response?.data;
        setApiData(apiResponse?.data);
    }

    console.log("data : ", apiData);

    useEffect(() => {
        featchingData();
    }, [])
    return (
        <section style={Styles.adminContainer}>
            <style>
                {`
            ::-webkit-scrollbar {
                width: 10px;
                height: 8px
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
                    <DashboardHeader
                        title='OverView'
                    />
                </div>
            </div>
            <section style={Styles.employeeContainer}>
                <table style={Styles.employeeTable}>
                    <FixedRow
                        headingList={headingList}
                        dropDownList={showDropDownList}
                        showDeleteButton={false}
                        storeFilterData={storeFilterData}
                        setStoreFilterData={setStoreFilterData}
                        setAppliedFilterClicked={setAppliedFilterClicked}
                    />

                    {
                        apiData?.map((data) => (
                            <tr key={data?._id}>
                                <td style={Styles.employeeValue}>{data?.InsID?data?.InsID:"N/A"}</td>
                                <td style={Styles.employeeValue}>{data?.name?data?.name:"N/A"}</td>
                                <td style={Styles.employeeValue}>{data?.email?data?.email:"N/A"}</td>
                                <td style={Styles.employeeValue}>{data?.department?.department ? data?.department?.department : "N/A"}</td>
                                <td style={Styles.employeeValue}>{data?.mobile ? data?.mobile : "N/A"}</td>
                                <td style={Styles.employeeValue}>{data?.stateID==="null" ? data?.stateID : "N/A"}</td>


                            </tr>
                        ))
                    }
                </table>
            </section>
        </section>


    )
}

export default EmployeeList