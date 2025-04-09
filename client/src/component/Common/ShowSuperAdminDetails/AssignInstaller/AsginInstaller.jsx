import React, { useEffect, useState } from 'react'
import LeadBoardHeader from '../../showLeadsHeader/index';
import FixedRow from '../../ShowEmployeeCard/FixedRow/index';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormInstaller from './FormInstaller/FormInstaller';

const AsginInstaller = () => {
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

    const navigate = useNavigate();
    const headingList =
        [
            'Name', 'Mobile', 'Email', "Asgin Installer", "Installer Info"
        ];

    const [leadClickedInfo, setLeadClickedInfo] = useState(false);
    const showDropDownList = new Array(headingList.length).fill(true);
    const [storeFilterData, setStoreFilterData] = useState({});
    const [isApplyFilterClicked, setAppliedFilterClicked] = useState(false);
    const [isResetFilterBtnClicked, setIsResetFilterBtnClicked] = useState(false);
    const [pageCount, setPageCount] = useState(1);
    const [limit, setLimit] = useState(35);
    const [selectAllLeadsChecked, setSelectAllLeadsChecked] = useState(false);


    const [data, setData] = useState([]);
    const fetchAllData = async () => {
        const response = await axios.get(`${process.env.REACT_APP_URL}/client/InstallerManager`);
        const responseData = await response?.data;

        console.log("response Data : ", responseData);
        const finalData = responseData?.data;
        setData(finalData);
    }

    useEffect(() => {
        fetchAllData();
    }, [])

    // console.log("data : ",data);

    const handleAllData = (item) => {
        navigate("/superAdmin/showDetails", { state: { item, from: "/superAdmin/MaterialDispatch/assignInstaller" } });
    }

    const [assignEmp,setAssignEmp]=useState(false);

    const [clientId, setClientId] = useState(null);

    const handleClick=(event)=>{
        let id=event.target.value
        // console.log("id",id);
        setClientId(id) ;
        setAssignEmp(true);
    }

    // console.log("clickedId: ",clientId);

    

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
                        title='Installer LeadBoard'
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

                    {
                        data.map((items) => (
                            < tr key={items._id} style={{ borderBottom: '2px solid #ddd', cursor: 'pointer' }}>
                                <td style={Styles.employeeValue} >{items?.ClientDetails?.name ? items?.ClientDetails?.name : "N/A"}</td>
                                <td style={Styles.employeeValue} >{items?.ClientDetails?.mobile ? items?.ClientDetails?.mobile : "N/A"}</td>
                                <td style={Styles.employeeValue} >{items?.ClientDetails?.email ? items?.ClientDetails?.email : "N/A"}</td>
                                <td style={Styles.employeeValue} >Pending...</td>
                                <button style={{ paddingLeft: "15px", paddingRight: "15px", fontSize: "15px" }} onClick={() => { handleAllData(items) }} >More</button> &nbsp;&nbsp;
                                <button value={items?.ClientDetails?._id} style={{ paddingLeft: "15px", paddingRight: "15px", fontSize: "15px" }}  onClick={handleClick}  >Assign Installer</button>
                            </tr>
                        )
                        )
                    }

                    {
                        assignEmp &&(
                            <FormInstaller  
                            info={clientId}                         
                            showForm={assignEmp}
                            closeForm={setAssignEmp}
                            />
                        )
                    }
                </table>
            </section>
        </section>
    )
}

export default AsginInstaller