import React from 'react';
import { useState } from 'react';
import FixedRow from '../../../component/Common/ShowEmployeeCard/FixedRow/index';
import CoordinatorEmployeeList from '../showEmployeeListOfTL/index';
import { FaUserTie } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import './index.css';

const Index = ({ coordinatorInfo, setShowEmployeeList, showEmployeeList, setIndividualEmplyeeInfo, setShowLeadList }) => {

    console.log(showEmployeeList);
    const Styles = {
        coordinatorProfileContainer: { margin: '0rem 1rem 0rem 8.2rem', padding: '1.5rem 1rem', width: '75%', height: '92vh', backgroundColor: 'rgb(234, 238, 245)', position: 'fixed', top: '50%', left: '50%', zIndex: '9995', boxShadow: '0px 0px 2px black', borderRadius: '8px', overflow: 'hidden', transform: 'translate(-50%, -50%)' },
        employeeTable: { width: '100%', backgroundColor: '#fff', borderRadius: '5px', borderColor: '#ddd', overflow: 'auto' },
        coordinatorInfoHolder: { padding: '0rem 1rem', display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '16px' },
        coordinatorlogoContainer: { backgroundColor: '#ddd', padding: '2rem', borderRadius: '5px' },
        closeIconButton: { cursor: 'pointer', position: 'absolute', top: '0.7rem', right: '0.8rem', transition: 'transform 0.4s ease', transformOrigin: 'center' }
    }

    const headingList = ['Name', 'Department', 'Mobile', 'Districts'];

    const showDropDownList = new Array(headingList.length).fill(true);
    const [storeFilterData, setStoreFilterData] = useState({});
    const [isApplyFilterClicked, setAppliedFilterClicked] = useState(false);

    const [pageCount, setPageCount] = useState(1);

    const increasePageCount = () => {
        setPageCount(pageCount + 1);
    }

    const decreasePageCount = () => {
        if (pageCount > 1)
            setPageCount(pageCount - 1);
    }

    // const [pageCount, setPageCount] = useState(1);

    // const increasePageCount = () => {
    //     setPageCount(pageCount + 1);
    // }

    // const decreasePageCount = () => {
    //     if (pageCount > 1)
    //         setPageCount(pageCount - 1);
    // }

    return (
        <>
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
            <section style={showEmployeeList ? { ...Styles.coordinatorProfileContainer, animation: 'slideUp 0.5s ease forwards' } : Styles.coordinatorProfileContainer}>
                <IoClose size={40} color='#AA0B2B' className='close-btn' style={Styles.closeIconButton}
                    onClick={() => {
                        setShowEmployeeList(false);
                        setIndividualEmplyeeInfo({});
                    }
                    } />
                <div style={Styles.coordinatorInfoHolder}>
                    <div style={Styles.coordinatorlogoContainer}>
                        <FaUserTie size={30} color='#AA0B2B' />
                    </div>
                    <div>
                        <div>
                            <span style={{ fontWeight: '600' }}>{coordinatorInfo.empID || 'Coordinator Id'}</span>
                        </div>
                        <div>
                            <span>{coordinatorInfo.name || 'Name'}</span>
                        </div>
                        <div>
                            <span>{coordinatorInfo.mobile || 'Mobile'}</span>
                        </div>
                        <div>
                            <span>{(coordinatorInfo.stateName.join(', ')) || 'State'}</span>
                        </div>
                    </div>
                </div>
                <section style={{ overflow: 'auto', height: '70vh', margin: '1rem 0rem', backgroundColor: '#fff'}}>
                    <table style={Styles.employeeTable} rules='row'>
                        <FixedRow
                            headingList={headingList}
                            dropDownList={showDropDownList}
                            showDeleteButton={false}
                            storeFilterData={storeFilterData}
                            setStoreFilterData={setStoreFilterData}
                            setAppliedFilterClicked={setAppliedFilterClicked}
                        />
                        <CoordinatorEmployeeList
                            // data={coordinatorInfo} 
                            coordinatorId={coordinatorInfo.coordinatorId}
                            setEmployeeInfo={setIndividualEmplyeeInfo}
                            setShowLeadList={setShowLeadList}
                        />
                    </table>
                </section>
            </section>
        </>
    )
}

export default Index;