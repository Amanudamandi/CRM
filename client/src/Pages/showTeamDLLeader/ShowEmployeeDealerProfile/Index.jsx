import React from 'react';
import FixedRow from '../../../component/Common/ShowEmployeeCard/FixedRow/index';
import Loader from '../../../component/Common/Loader/index';
import { useState } from 'react';
import EmployeeLeads from '../../../Pages/ShowTeamLeader/showEmployeeProfile/showEmployeeLeads/index';
import { FiArrowRightCircle } from "react-icons/fi";
import { FiArrowLeftCircle } from "react-icons/fi";
import { FaUserTie } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
// import './index.css';

const Index = ({ individualEmployeeInfo, setShowLeadsList, showLeadList, setShowLeadUpdateForm, updateLeadBtnClicked, setUpdateLeadBtnClicked }) => {

    console.log(showLeadList);
    const Styles = {
        coordinatorProfileContainer: { margin: '0rem 1rem 0rem 8.2rem', padding: '1.5rem 1rem', width: '75%', height: '92vh', backgroundColor: 'rgb(234, 238, 245)', position: 'fixed', top: '50%', left: '50%', zIndex: '9999', boxShadow: '0px 0px 2px black', borderRadius: '8px', transform: 'translate(-50%, -50%)' },
        employeeTable: { width: '100%', borderRadius: '5px', borderColor: '#ddd', overflow: 'auto' },
        coordinatorInfoHolder: { padding: '0rem 1rem', display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '16px' },
        coordinatorlogoContainer: { backgroundColor: '#ddd', padding: '2rem', borderRadius: '5px' },
        closeIconButton: { cursor: 'pointer', position: 'absolute', top: '0.7rem', right: '0.8rem', transition: 'transform 0.4s ease', transformOrigin: 'center' },
        loaderMainContainer: {
            width: '79%',
            height: '65vh',
        },
        loaderContainer: {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 999,
        }
    }

    const headingList = ['Stage', 'Name', 'Mobile', 'Email', 'KWP Interested', 'Type', 'District', 'Date'];

    const showDropDownList = new Array(headingList.length).fill(true);
    const [storeFilterData, setStoreFilterData] = useState({});
    const [isApplyFilterClicked, setAppliedFilterClicked] = useState(false);
    const [isResetFilterBtnClicked, setIsResetFilterBtnClicked] = useState(false);

    const [pageCount, setPageCount] = useState(1);
    const [limit, setLimit] = useState(35);

    const increasePageCount = () => {
        setPageCount((pre) => pre + 1);
    }

    const decreasePageCount = () => {
        if (pageCount > 1)
            setPageCount((pre) => pre - 1);
    }

    const [loading, isLoading] = useState(false);

    return (
        <>
            <section style={showLeadList ? { ...Styles.coordinatorProfileContainer, animation: 'slideUp 0.5s ease forwards' } : Styles.coordinatorProfileContainer}>
                <IoClose size={40} color='#AA0B2B' className='close-btn' style={Styles.closeIconButton}
                    onClick={() => {
                        setShowLeadsList(false);
                    }}
                />
                <div style={Styles.coordinatorInfoHolder}>
                    <div style={Styles.coordinatorlogoContainer}>
                        <FaUserTie size={30} color='#AA0B2B' />
                    </div>
                    <div>
                        <div>
                            <span style={{ fontWeight: '600' }}>{individualEmployeeInfo.empID || 'Employee Id'}</span>
                        </div>
                        <div>
                            <span>{individualEmployeeInfo.name || 'Name'}</span>
                        </div>
                        <div>
                            <span>{individualEmployeeInfo.mobile || 'Mobile'}</span>
                        </div>
                        <div>
                            <span>{(individualEmployeeInfo.district).join(', ') || 'State'}</span>
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
                            setIsResetFilterBtnClicked={setIsResetFilterBtnClicked}
                        />
                        <EmployeeLeads
                            employeeId={individualEmployeeInfo._id}
                            setIsLoading={isLoading}
                            setShowLeadUpdateForm={setShowLeadUpdateForm}
                            pageCount={pageCount}
                            limit={limit}
                            updateLeadBtnClicked={updateLeadBtnClicked}
                            setUpdateLeadBtnClicked={setUpdateLeadBtnClicked}
                            storeFilterData={storeFilterData}
                            isFilterAppliedClicked={isApplyFilterClicked}
                            setIsFilterAppliedClicked={setAppliedFilterClicked}
                            isResetFilterBtnClicked={isResetFilterBtnClicked}
                            setIsResetFilterBtnClicked={setIsResetFilterBtnClicked}
                        />
                    </table>
                </section>
                {
                    loading &&
                        <div style={{ ...Styles.loaderContainer, ...Styles.loaderMainContainer }}>
                            <div style={Styles.loaderContainer}>
                                <Loader />
                            </div>
                        </div>
                }
                <div style={{ marginBottom: 0, width: 'fit-content', margin: 'auto'  }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: '8px', gap: '4px' }} >
                        <FiArrowLeftCircle size={20} onClick={decreasePageCount} />
                        <select
                            style={{ borderRadius: '5px', padding: '2px', textAlign: 'center' }}
                            onChange={(event) => {
                                setLimit(event.target.value);
                            }}
                        >
                            <option value={35}>35/Page</option>
                            <option value={50}>50/Page</option>
                            <option value={75}>75/Page</option>
                            <option value={100}>100/Page</option>
                        </select>
                        <FiArrowRightCircle size={20} onClick={increasePageCount} />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Index;