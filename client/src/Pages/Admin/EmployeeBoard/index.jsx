import React from 'react';
import { useState } from 'react';
import DashboardHeader from '../../../component/Common/Dashboard_Heading/index';
import FixedRow from '../../../component/Common/ShowEmployeeCard/FixedRow/index';
import VaribaleRow from '../../../component/Common/ShowEmployeeCard/VariableRow/index';
import { FiArrowRightCircle } from "react-icons/fi";
import { FiArrowLeftCircle } from "react-icons/fi";
import './index.css';

const Index = () => {

    const Styles = {
        adminContainer: { position: 'relative', display: 'grid', height: '100vh', gridTemplateColumns: '1fr', gridTemplateRows: '3.5rem 1fr', backgroundColor: '#E8EFF9', overflow: 'hidden' },
        navBar: { gridRow: '1 / span 2' },
        dashboardContainer: { gridColumns: '2', gridRow: '1' },
        headerContainer: { padding: '0.5rem 1rem', position: 'sticky', left: 0, top: 0 },
        employeeContainer: { gridColumns: '2', gridRow: '2', backgroundColor: '#fff', margin: '0.5rem 1rem', borderRadius: '5px', overflow: 'auto' },
        employeeTable: { width: '100%', backgroundColor: '#fff', borderRadius: '5px' },
    }

    const headingList = 
    [ 
        'Employee Id', 'Name', 'Department', 'Team_Leader', 
        'Mobile', 'State', 'District',
    ];

    const [ limit, setLimit ] = useState(35);

    const showDropDownList = new Array(headingList.length).fill(true);
    const [ storeFilterData, setStoreFilterData ] = useState({});
    const [ isApplyFilterClicked, setAppliedFilterClicked ] = useState(false);

    const [pageCount, setPageCount] = useState(1);

    const increasePageCount = () => {
        setPageCount((pre) => pre + 1);
    }

    const decreasePageCount = () => {
        if (pageCount > 1)
            setPageCount((pre) => pre - 1);
    }

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
                    <VaribaleRow 
                        pageCount={pageCount} 
                        departmentID=''
                        coordinatorID=''
                    />
                    {/* <tr>
                        <td colSpan={12} style={{ position: 'fixed', right: '2.2rem', bottom: '1.5rem' }} >
                            <FiArrowLeftCircle size={20} onClick={decreasePageCount} /> &nbsp;
                            <span>{pageCount}</span>  &nbsp;
                            <FiArrowRightCircle size={20} onClick={increasePageCount} />
                        </td>
                    </tr> */}
                </table>
            </section>

            <div style={{ width: 'fit-content', margin: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: '8px',  gap: '4px' }} >
                    <FiArrowLeftCircle size={20} onClick={decreasePageCount} />
                    <select
                        style={{ borderRadius: '5px', padding: '2px', textAlign: 'center' }} 
                        onChange={(event) => {
                            setLimit(event.target.value);                                    
                        }}
                    >
                        <option value={35} selected>35/Page</option>
                        <option value={50}>50/Page</option>
                        <option value={75}>75/Page</option>
                        <option value={100}>100/Page</option>
                    </select>
                    <FiArrowRightCircle size={20} onClick={increasePageCount} />
                </div>
            </div>
        </section>
    )
}

export default Index;