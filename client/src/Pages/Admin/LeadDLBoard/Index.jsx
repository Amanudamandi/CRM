import React, { useEffect } from 'react';
import { useState } from 'react';
import LeadBoardHeader from '../../../component/Common/showLeadsHeader/index';
import FixedRow from '../../../component/Common/ShowEmployeeCard/FixedRow/index';
// import ShowLeads from '../../../component/Common/showLeads/index';
import ShowClickableLeads from '../../../component/Common/ClickableTable/index';
import UpdateLead from '../../../component/Employee/UpdateEmployeeForm/index';
import Loader from '../../../component/Common/Loader/index';
import { FiArrowRightCircle } from "react-icons/fi";
import { FiArrowLeftCircle } from "react-icons/fi";
import axios from 'axios';


import DLUpdateLead from '../../../component/DLEmployee/DlUpdateForm/FormUpdate';

import { useNavigate } from 'react-router-dom';
import { tr } from 'date-fns/locale';

const Index = ({data}) => {
   

    const [leadClickedInfo, setLeadClickedInfo] = useState({ clicked: false });
    const [limit, setLimit] = useState(35);
    const [selectAllLeadsChecked, setSelectAllLeadsChecked] = useState(false);

    const Styles = {
        adminContainer: { position: 'relative', display: 'grid', height: '100vh', gridTemplateColumns: '1fr', gridTemplateRows: '3.5rem 1fr', backgroundColor: '#E8EFF9', overflow: 'hidden' },
        navBar: { gridRow: '1 / span 2' },
        dashboardContainer: { gridColumns: '2', gridRow: '1' },
        headerContainer: { display: 'flex', padding: '0.5rem 1rem', position: 'sticky', left: 0, top: 0 },
        employeeContainer: { gridColumns: '2', gridRow: '2', backgroundColor: '#fff', margin: '0.5rem 1rem', borderRadius: '5px', overflow: 'auto' },
        employeeTable: { width: '100%', borderRadius: '5px', borderColor: '#ddd', },
        loaderMainContainer: {
            width: '79%',
            height: '91vh',
        },
        loaderContainer: {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-40%, -50%)',
            zIndex: 999,
        },
        tableBody: { height: '100%', overflow: 'scroll' },
        employeeValue: { padding: '0.35rem 0rem', paddingRight: '1rem', fontSize: '1rem', textAlign: 'center', fontWeight: '500', whiteSpace: 'nowrap' },
        reAssignBtnContainer: { position: 'absolute', bottom: 50, right: 25, backgroundColor: 'rgba(170, 11, 43, 0.85)', padding: '8px', borderRadius: '5px', cursor: 'pointer' },
    }

    const Navigate = useNavigate();



    const headingList =
        [
            'Stage', 'Coordinator', 'Lead Handler', 'Name', 'Mobile', 'Email', 'Type', 'State', 'District', 'Source', 'Date',
        ];


    const showDropDownList = new Array(headingList.length).fill(true);
    const [storeFilterData, setStoreFilterData] = useState({});
    const [isApplyFilterClicked, setAppliedFilterClicked] = useState(false);
    const [isResetFilterBtnClicked, setIsResetFilterBtnClicked] = useState(false);

    const [pageCount, setPageCount] = useState(1);


    const increasePageCount = () => {
        setPageCount((pre) => pre + 1);
    }

    const decreasePageCount = () => {
        if (pageCount > 1)
            setPageCount((pre) => pre - 1);
    }

    const [loading, isLoading] = useState(false);
    const [updateLeadBtnClicked, setUpdateLeadBtnClicked] = useState(false);

    const [leadStatusList, setLeadStatusList] = useState(new Array(limit).fill(false));
    const convertTimeIntoDate = (dateString) => {
        return new Date(dateString);
    }
    // const [ hasMore, setHasMore ] = useState(true); 

    // const loadMoreLeads = () => {
    //     if( !loading && hasMore ){
    //         increasePageCount();
    //     }
    // }

    // const onScrollToEndLoadMore = (event) => {
    //     console.log(event.currentTarget);
    //     const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    //     console.log(scrollTop, clientHeight, scrollHeight);
    //     if((scrollTop+clientHeight) >= (scrollHeight - 5)){
    //         console.log("Hello Load More Content");
    //         loadMoreLeads();
    //     }
    // }

    const [dealerData, setDealerData] = useState([]);

    const fetchDealer = async () => {
        try {
            const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/clientDL/fetchAllLeads`);
            const response = await sendRequest.data;
            //  console.log("dealer data : ",response);
            setDealerData(response.clients);
        } catch (error) {
            console.log(error)
        }
    }
    // console.log("dealer data : ", dealerData);


    useEffect(() => {
        fetchDealer();
    }, []);


    
    const [selectedLead, setSelectedLead] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    const updateDLLead = (leadData) => {
        setSelectedLead(leadData);
        setShowUpdateForm(true);
        // console.log(leadData);
    }

    console.log("data clicked : ", selectedLead )




    return (
        <section style={Styles.adminContainer}>
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
            <div style={Styles.dashboardContainer}>
                <div style={Styles.headerContainer}>
                    <LeadBoardHeader
                        title='LeadBoard'
                    />
                </div>
            </div>

            <section style={{ ...Styles.employeeContainer, display: (leadClickedInfo.clicked) ? 'none' : 'block' }}>
                <table style={Styles.employeeTable} rules='rows' onScroll={(event) => {
                    console.log(event.currentTarget);
                    const { scrollTop } = event.currentTarget;
                    console.log(scrollTop);
                }}>
                    <FixedRow
                        headingList={headingList}
                        dropDownList={showDropDownList}
                        showDeleteButton={false}
                        showSelectBox={true}
                        storeFilterData={storeFilterData}
                        setStoreFilterData={setStoreFilterData}
                        setAppliedFilterClicked={setAppliedFilterClicked}
                        setIsResetFilterBtnClicked={setIsResetFilterBtnClicked}
                        setSelectAllLeadsChecked={setSelectAllLeadsChecked}
                    />

                    {/* <ShowLeads pageCount={pageCount} /> */}
                    {/* <ShowClickableLeads
                        pageCount={pageCount}
                        setIsLoading={isLoading}
                        employeeAutoGeneratedID=''
                        coordinatorAutoGeneratedID=''
                        setClicked={setLeadClickedInfo}
                        boolShowTeamLead={true}
                        showCheckBoxes={true}
                        limit={limit}
                        storeFilterData={storeFilterData}
                        isFilterAppliedClicked={isApplyFilterClicked}
                        setIsFilterAppliedClicked={setAppliedFilterClicked}
                        isResetFilterBtnClicked={isResetFilterBtnClicked}
                        setIsResetFilterBtnClicked={setIsResetFilterBtnClicked}
                        updateLeadBtnClicked={updateLeadBtnClicked}
                        setUpdateLeadBtnClicked={setUpdateLeadBtnClicked}
                        selectAllLeadsChecked={selectAllLeadsChecked}
                    /> */}
                    {/* <tr>
                            <td colSpan={12} style={{ position: 'fixed', right: '2.2rem', bottom: '1.5rem' }} >
                                <FiArrowLeftCircle size={20} onClick={decreasePageCount} /> &nbsp;
                                <select onChange={(event) => {
                                    setLimit(event.target.value);                                    
                                } }>
                                    <option value={35} selected>35</option>
                                    <option value={50}>50</option>
                                    <option value={75}>75</option>
                                    <option value={100}>100</option>
                                </select>  &nbsp;
                                <FiArrowRightCircle size={20} onClick={increasePageCount} />
                            </td>
                        </tr> */}

                    
                      {/* {console.log("data",dealerData)} */}

                    { dealerData.length !== 0 && dealerData?.map((lead, index) => (
                        
                        <tr key={lead._id} onClick={() => updateDLLead(lead)}>
                            <td style={{ ...Styles.employeeValue }}>
                                <input type="checkbox" name={lead?._id + index} id={lead?._id + index} />
                            </td>
                            <td style={Styles.employeeValue}>{lead?.stageID ? lead?.stageID?.stage : 'N/A'}</td>
                            <td style={Styles.employeeValue}>{lead?.TLID ? lead?.TLID?.name : 'N/A'}</td>
                            <td style={Styles.employeeValue}>{lead?.empID ? lead?.empID?.name : 'N/A'}</td>
                            <td style={Styles.employeeValue}>{lead?.name ? lead?.name : 'N/A'}</td>
                            <td style={Styles.employeeValue}>{lead?.mobile ? lead?.mobile : 'N/A'}</td>
                            <td style={Styles.employeeValue}>{lead?.email ? lead?.email : 'N/A'}</td>
                            <td style={Styles.employeeValue}>{lead?.type ? (lead?.type === 1 ? 'Hot' : lead.type === 2 ? 'Warm' : 'Cold') : 'N/A'}</td>
                            <td style={Styles.employeeValue}>{lead?.stateID ? lead?.stateID.state : 'N/A'}</td>
                            <td style={Styles.employeeValue}>{lead?.district ? lead?.district : 'N/A'}</td>
                            <td style={Styles.employeeValue}>{lead?.source ? lead?.source : 'N/A'}</td>
                            <td style={Styles.employeeValue}>
                                {lead.CurrentDate ?
                                    `${convertTimeIntoDate(lead?.CurrentDate).getDate()}/${convertTimeIntoDate(lead?.CurrentDate).getMonth() + 1}/${convertTimeIntoDate(lead?.CurrentDate).getFullYear()}`
                                    : '-'}
                            </td>
                        </tr>
                    ))}
                </table>
            </section>

           
            {
                showUpdateForm && selectedLead && (
                    <DLUpdateLead
                        leadData={selectedLead}
                        onClose={() => setShowUpdateForm(false)}
                    />
                    // <DLUpdateLead/>
                )
            }


            {loading &&
                <div style={{ ...Styles.loaderContainer, ...Styles.loaderMainContainer }}>
                    <div style={Styles.loaderContainer}>
                        <Loader />
                    </div>
                </div>
            }
            {/* } */}
            <div style={{ width: 'fit-content', margin: 'auto', display: (leadClickedInfo.clicked) ? 'none' : 'block', }}>
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
    )
}

export default Index;