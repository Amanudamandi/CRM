import React, { useEffect, useState } from 'react'
import LeadBoardHeader from '../../component/Common/showLeadsHeader/index';
import axios from 'axios';
import { FiArrowRightCircle } from "react-icons/fi";
import { FiArrowLeftCircle } from "react-icons/fi";
import CoordinatorCard from '../../component/Common/Card2/index'
import UpdateDealerLeadForm from '../../component/DLEmployee/DlUpdateForm/FormUpdate'


// import ShowEmployeeProfile from './showEmployeeProfile/index';

import ShowDealerEmployeeProfile from "./ShowDealerEmployeeProfile/DealerEmployeeProfile"
import CooridinatorDLProfile from './ShowCooridinatorDLProfile/CooridinatorDLProfile';

import UpdateCoordinatorProfile from './updateCoordinatorDLProfile/UpdateCooridanate';

const Index = () => {

  const [teamLeaderList, setTeamLeaderList] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [showCoordinatorDealerProfile, setShowCoordinatorDealerProfile] = useState(false);
  const [storeInfoOfCurrentTL, setStoreInfoCurrentTL] = useState(
    {
      coordinatorId: '',
      empID: '',
      name: '',
      stateName: '',
      mobile: ''
    }
  );
  const [updateCoordinatorProfile, setNewCoordinatorProfile] = useState({ clicked: false });
  const [showEmployeeProfile, setShowEmployeeProfile] = useState(false);
  const [individualEmployeeInfo, setIndividualEmplyeeInfo] = useState(null);

  const [leadClickedInfo, setLeadClickedInfo] = useState({ clicked: false });
  const [updateLeadBtnClicked, setUpdateLeadBtnClicked] = useState(false);

  const increasePageCount = () => {
    setPageCount(pageCount + 1);
  }

  const decreasePageCount = () => {
    setPageCount(pageCount - 1);
  }

  //   useEffect(() => {
  //     if (!showLeadList) {
  //         console.log("Closing the form...");
  //     }
  // }, [showLeadList]);


  const showTeamLeaderDLAPI = async (isMounted) => {
    try {
      const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/dealerTL/fetchall`);
      // console.log("leader dl ", sendRequest?.data?.data);
      if (isMounted) {
        const response = sendRequest?.data.data;
        console.log("team leader ", response);
        setTeamLeaderList(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let isMounted = true;
    showTeamLeaderDLAPI(isMounted);
    return (() => {
      isMounted = false;
    })
  }, [])




  const Styles = {
    adminContainer: { position: 'relative', display: 'grid', height: '100vh', gridTemplateColumns: '1fr', gridTemplateRows: '3.5rem 1fr', backgroundColor: '#E8EFF9', overflow: 'hidden' },
    navBar: { gridRow: '1 / span 2' },
    dashboardContainer: { gridColumns: '2', gridRow: '1' },
    headerContainer: { padding: '0.5rem 1rem', position: 'sticky', left: 0, top: 0 },
    employeeContainer: { position: 'relative', gridColumns: '2', gridRow: '2', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', gap: '0.8rem', padding: '1rem', backgroundColor: '#fff', margin: '0.5rem 1rem', borderRadius: '5px', overflow: 'auto' },
    pageCountContainer: { position: 'fixed', right: '1.5rem', bottom: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' },
    coordinatorCardContainer: { height: 'min-content', cursor: 'pointer' }
  }
  return (
    <article style={Styles.adminContainer}>
      <div style={Styles.dashboardContainer}>
        <div style={Styles.headerContainer}>
          <LeadBoardHeader
            title='Coordinator Dealer Board'
          />
        </div>
      </div>

      {/*
      //not working 
       {
        showEmployeeProfile &&
        <ShowDealerEmployeeProfile
        individualEmployeeInfo={individualEmployeeInfo}
        setShowLeadsList={setShowEmployeeProfile}
        showLeadList={showEmployeeProfile}
        setShowLeadUpdateForm={setLeadClickedInfo}
        updateLeadBtnClicked={updateLeadBtnClicked}
        setUpdateLeadBtnClicked={setUpdateLeadBtnClicked}
        />
      } */}

      {/* {
        leadClickedInfo.clicked &&
        <UpdateDealerLeadForm
          showForm={leadClickedInfo.clicked}
          leadInformation={leadClickedInfo}
          closeForm={setLeadClickedInfo}
          pageCount={pageCount}
          BooleanShowAllStages={true}
          setUpdateLeadBtnClicked={setUpdateLeadBtnClicked}
        />
      } */}

      {
        updateCoordinatorProfile.clicked &&
        <UpdateCoordinatorProfile
          coordinatorProfileClickedInfo={updateCoordinatorProfile}
          setCoordinatorProfile={setNewCoordinatorProfile}
        />
      }




      {/* showing all coordinator in card form   */}
      {
        showCoordinatorDealerProfile !== true ? <section style={Styles.employeeContainer}>
          {
            teamLeaderList && teamLeaderList.map(({ _id, empID, name, mobile, stateID }) => (
              <div style={Styles.coordinatorCardContainer} key={_id} onClick={() => {
                const states = [];
                stateID.length !== 0 && stateID.map(({ state }) => (
                  states.push(state)
                ));
                console.log(states);
                setShowCoordinatorDealerProfile(!showCoordinatorDealerProfile);
                setStoreInfoCurrentTL({ ...storeInfoOfCurrentTL, name, empID, stateName: states.length !== 0 ? states : 'N/A', mobile, coordinatorId: _id })
              }}>

                {/* creating cards  */}
                <CoordinatorCard
                  uniqueID={_id}
                  name={name}
                  employeeId={empID}
                  mobile={mobile}
                  state={(stateID !== null || stateID.length !== 0) ?
                    stateID.map(({ state }) => {
                      return state
                    }) : 'N/A'
                  }
                  setCoordinatorProfile={setNewCoordinatorProfile}

                />
              </div>
            ))
          }

          <div style={Styles.pageCountContainer}>
            <FiArrowLeftCircle size={20} onChange={increasePageCount} />
            <span>{pageCount}</span>
            <FiArrowRightCircle size={20} onChange={decreasePageCount} />
          </div>
        </section> : <CooridinatorDLProfile coordinatorInfo={storeInfoOfCurrentTL} setShowEmployeeList={setShowCoordinatorDealerProfile} showEmployeeList={setShowCoordinatorDealerProfile} setIndividualEmplyeeInfo={setIndividualEmplyeeInfo} setShowLeadList={setShowEmployeeProfile} />
      }




    </article>
  )
}

export default Index