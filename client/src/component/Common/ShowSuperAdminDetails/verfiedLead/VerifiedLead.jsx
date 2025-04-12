import React, { useEffect, useState } from 'react'
import LeadBoardHeader from '../../showLeadsHeader/index';
import FixedRow from '../../ShowEmployeeCard/FixedRow/index';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const VerifiedLead = () => {
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
      'Name', 'Mobile', 'Email', "Lead Status", "Lead Information"
    ];

  const [leadClickedInfo, setLeadClickedInfo] = useState(false);
  const showDropDownList = new Array(headingList.length).fill(true);
  const [storeFilterData, setStoreFilterData] = useState({});
  const [isApplyFilterClicked, setAppliedFilterClicked] = useState(false);
  const [isResetFilterBtnClicked, setIsResetFilterBtnClicked] = useState(false);
  // const [pageCount, setPageCount] = useState(1);
  // const [limit, setLimit] = useState(35);
  const [selectAllLeadsChecked, setSelectAllLeadsChecked] = useState(false);

  const [data, setData] = useState([]);
  const fetchAllData = async () => {
    try {
      const responseData = await axios.get(`${process.env.REACT_APP_URL}/client/getNetmetric`);
      const response = await responseData?.data;
      //  console.log("data ",response);
      setData(response?.data);

    } catch (error) {
      alert("Data is not fetch successfully ,please check console for Error...");
      console.log("Error : ", error);
    }
  }

  useEffect(() => {
    fetchAllData();
  }, [])

  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    if (isApplyFilterClicked) {
      // const { name, mobile, email } = storeFilterData;
      const name = storeFilterData?.Name || '';
      const mobile = storeFilterData?.Mobile || '';
      const email = storeFilterData?.Email || '';

      const filtered = data.filter(item => {
        return (
          (!name || item?.ClientDetails?.name?.toLowerCase().includes(name.toLowerCase())) &&
          (!mobile || item?.ClientDetails?.mobile?.includes(mobile)) &&
          (!email || item?.ClientDetails?.email?.toLowerCase().includes(email.toLowerCase()))
        );
      });

      console.log("filterData", filtered);

      setFilteredData(filtered);
      setAppliedFilterClicked(false);
    }
  }, [isApplyFilterClicked, data, storeFilterData]);
  // console.log("filterData", filteredData);

  useEffect(() => {
    if (isResetFilterBtnClicked) {
      setFilteredData(data);
      setIsResetFilterBtnClicked(false);
    }
  }, [isResetFilterBtnClicked, data]);

  const handleNavigation = (item) => {
    navigate("/superAdmin/showDetails", { state: { item, from: "/superAdmin/verifiedLead" } })
  }

  const handleMaterialInfo = (item) => {
    navigate("/superAdmin/materialInfo", { state: { item, from: "/superAdmin/verifiedLead" } })
  }


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
            title='Information LeadBoard'
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
            (filteredData.length > 0 ? filteredData : data).map((items) => (
              < tr key={items._id} style={{ borderBottom: '2px solid #ddd', cursor: 'pointer' }}>
                <td style={Styles.employeeValue} >{items?.ClientDetails?.name ? items?.ClientDetails?.name : "N/A"}</td>
                <td style={Styles.employeeValue} >{items?.ClientDetails?.mobile ? items?.ClientDetails?.mobile : "N/A"}</td>
                <td style={Styles.employeeValue} >{items?.ClientDetails?.email ? items?.ClientDetails?.email : "N/A"}</td>
                <td style={Styles.employeeValue} >Complete</td>
                <button style={{ marginLeft: "120px", paddingLeft: "15px", paddingRight: "15px", fontSize: "15px" }} onClick={() => { handleNavigation(items) }}  >Lead Information</button> &nbsp;&nbsp;
                <button style={{ paddingLeft: "15px", paddingRight: "15px", fontSize: "15px" }} onClick={() => { handleMaterialInfo(items) }} >Material Information</button>
              </tr>
            ))
          }
        </table>
      </section>
    </section>

  )
}

export default VerifiedLead