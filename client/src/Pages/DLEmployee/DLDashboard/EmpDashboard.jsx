import React, { useEffect } from 'react';
import { useState } from 'react';
import DashboardHeader from '../../../component/Common/Dashboard_Heading/index';
import Card from '../../../component/Common/Card/index';
import { FaArrowTrendUp } from "react-icons/fa6";
import { showStageApi } from '../../../Utils/showStagesAPI';
// import { useAuth } from '../../../Context/Authentication/AuthContext';
// import { stageCountForDashboardApi } from '../../../Utils/stagesValueCountAPI';

import Loader from '../../../component/Common/Loader';
import { stageCountForDashboardApiDL } from '../../../Utils/stageCountForDashboardApiDL';
// import './index.css';

const Index = () => {
    const isAuthenticated = { employeeId: localStorage.getItem('employeeId') };
    const [showAllStages, setShowAllStages] = useState([]);
    const [currentEmployeeCardInformation, setCurrentEmployeeCardInformation] = useState(
        [
            { heading: '', values: [] },
            { heading: '', values: [] },
            { heading: '', values: [] },
            { heading: '', values: [] },
            { heading: '', values: [] },
            { heading: '', values: [] },
            { heading: '', values: [] }
        ]
    );
    const [isLoading, setIsLoading] = useState(false);
    const Styles = {
        adminContainer: { position: 'relative', display: 'grid', height: '100vh', gridTemplateColumns: '1fr', gridTemplateRows: '3.5rem 1fr', backgroundColor: '#E8EFF9', overflow: 'hidden' },
        navBar: { gridRow: '1 / span 2' },
        dashboardContainer: { gridColumns: '2', gridRow: '1' },
        headerContainer: { padding: '0.5rem 1rem', position: 'sticky', left: 0, top: 0 },
        employeeContainer: { gridColumns: '2', gridRow: '2', backgroundColor: '#fff', margin: '0.5rem 1rem', borderRadius: '5px', overflow: 'auto' },
        employeeStagesFieldsContainer: { width: 'max-content', padding: '1rem' },
        basicInfoContainer: { display: 'flex', width: 'max-content', flexWrap: 'wrap', gap: '2rem' },
        eachInfoContainer: { display: 'flex', width: 'inherit', gap: '1.5rem', padding: '1rem 1.3rem' },
        infoHeadingContainer: { display: 'flex', width: 'inherit', flexDirection: 'column', gap: '4px' },
        infoHeadingContainerValues: { display: 'flex', flexDirection: 'column', gap: '4px' },
        containerText: { fontSize: '0.8rem', color: '#fff', letterSpacing: '1px' }
    }

    const callStageCountNnumberOfTimes = async (count, showAllStages) => {
        const resultArray = [];
        const today = new Date();
        let index = 0
        setIsLoading(true);
        for (; index < count; index++) {
            const employeeId = isAuthenticated.employeeId;
            const stageId = showAllStages[index]._id;
            const lastSevenDays = new Date(today);
            lastSevenDays.setDate(lastSevenDays.getDate() - 7);
            lastSevenDays.toDateString();
            const lastMonth = new Date(today);
            lastMonth.setDate(lastMonth.getDate() - 30);
            lastMonth.toDateString();
            const leadsValue = await stageCountForDashboardApiDL(employeeId, stageId);
            const TODAYS = await stageCountForDashboardApiDL(employeeId, stageId, today.toDateString(), today.toDateString());
            const LAST_WEEK = await stageCountForDashboardApiDL(employeeId, stageId, lastSevenDays, today.toDateString());
            const LAST_MONTH = await stageCountForDashboardApiDL(employeeId, stageId, lastSevenDays, today.toDateString());
            const values = [await leadsValue, await TODAYS, await LAST_WEEK, await LAST_MONTH];
            resultArray.push({ heading: showAllStages[index].stage, values });
        }
        if (index === count) {
            setIsLoading(false);
        }
        console.log(resultArray);
        setCurrentEmployeeCardInformation(resultArray);
    }

    useEffect(() => {
        setIsLoading(true);
        let isMounted = true;
        if (isMounted) {
            showStageApi(isMounted, setShowAllStages)
                .then((res) => {
                    console.log(res);
                    return callStageCountNnumberOfTimes(res.length, res);
                });
        }
        return () => {
            isMounted = false;
        }
    }, []);

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
                        title='Dealer DashBoard'
                    />
                </div>
            </div>
            <section style={Styles.employeeContainer}>
                <div style={Styles.employeeStagesFieldsContainer}>
                    <div style={Styles.basicInfoContainer}>
                        {
                            currentEmployeeCardInformation.map(({ heading, values }, index) => (
                                <Card
                                    display={isLoading ? 'flex' : 'block'}
                                    justifyContent={isLoading ? 'center' : 'flex-start'}
                                    alignItems={isLoading ? 'center' : 'flex-start'}
                                    width={isLoading ? '10rem' : 'auto'}
                                    height={isLoading ? '6.6rem' : 'auto'}
                                    boxShadowColor='#fff'
                                    boxColor={!(index & 1) ? 'rgba(170, 11, 43, 0.9)' : '#fff'}
                                    boxRoundness={5}
                                >
                                    {
                                        !isLoading ? <div style={Styles.eachInfoContainer}>
                                            <div style={Styles.infoHeadingContainer}>
                                                <div style={{ ...Styles.containerText, color: index % 2 === 0 ? '#fff' : 'rgba(170, 11, 43, 0.9)' }}>{heading}</div>
                                                <div style={{ ...Styles.containerText, color: index % 2 === 0 ? '#fff' : 'rgba(170, 11, 43, 0.9)' }}>Today's</div>
                                                <div style={{ ...Styles.containerText, color: index % 2 === 0 ? '#fff' : 'rgba(170, 11, 43, 0.9)' }}>Weekly</div>
                                                <div style={{ ...Styles.containerText, color: index % 2 === 0 ? '#fff' : 'rgba(170, 11, 43, 0.9)' }}>Monthly</div>
                                            </div>
                                            <div style={{ ...Styles.infoHeadingContainerValues, color: index % 2 === 0 ? '#fff' : 'rgba(170, 11, 43, 0.9)' }}>
                                                {
                                                    values.map((value, index) => (
                                                        <div style={{ ...Styles.containerText, color: 'inherit' }}>
                                                            {value}
                                                            {index === 0 ? <FaArrowTrendUp color='#3AD640' /> : null}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div> : <Loader />
                                    }
                                </Card>
                            ))
                        }
                    </div>
                </div>
            </section>
        </section>
    )
}

export default Index;

