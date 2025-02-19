import React from 'react';
import { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../../Pages/Login/index';
import AdminDashboard from '../../Pages/Admin/DashBoard/index';
import AdminEmployeeBoard from '../../Pages/Admin/EmployeeBoard/index';
import DownloadReport from '../../Pages/Admin/Report/index';
import EmployeeRegistration from '../../Pages/employeeRegister/index';
import ShowTeamLeader from '../../Pages/ShowTeamLeader/index';
import LeadBoard from '../../Pages/Admin/LeadBoard/index';
import TeamLeaderRegister from '../../Pages/TeamLeaderRegister/index';
import AddClient from '../../Pages/Admin/LeadRegistration/index';
import Layout from '../Layout/index';
import EmployeeLayout from '../EmployeeLayout/index';
import CoordinatorLayout from '../CoordinatorLayout/index';
import EmployeeDashboard from '../../Pages/Employee/Dashboard/index';
import CoordinatorDashboard from '../../Pages/Coordinator/Dashboard/index';
import CoordinatorCanDownloadReport from '../../Pages/Coordinator/Report/index';
import EmployeeLeads from '../../Pages/Employee/LeadBoard/index';
import CoordinatorEmployeeBoard from '../../Pages/Coordinator/EmployeeBoard/index';
import CoordinatorAddEmployee from '../../Pages/Coordinator/EmployeeBoard/EmployeeRegistration/index';
import CoordinatorLeads from '../../Pages/Coordinator/LeadBoard/index';
import { useAuth } from '../../Context/Authentication/AuthContext';
import Update from '../Common/employeeUpdate/Update';
import Up from '../Common/employeeUpdate/Up';
// import { getCookie } from '../cookieUtils';

const Index = () => {
    // removeCookie('accessToken')
    // console.log(getCookie('accessToken'));
    const { setIsAuthenticated  } = useAuth();
    useEffect(() => {
        const _id = localStorage.getItem('employeeId');
        const role = localStorage.getItem('role');
        if(_id !== '' || _id !== null || _id !== undefined){
            setIsAuthenticated((previousData) => ({ ...previousData, employeeId: _id, role }));
        }
    }, [setIsAuthenticated]);

    return (
        <React.Fragment>
            {/* <AuthProvider> */}
                <Routes>
                    <Route path='/' element={<Navigate to='/login' replace />} />
                    <Route path='/login' element={<Login />} />
                    {/* Admin Router */}
                    <Route path='/' element={<Layout />} >
                        <Route path='admin/dashboard' element={<AdminDashboard />} />
                        <Route path='admin/employee-dashboard' element={<AdminEmployeeBoard />} />
                        <Route path='admin/employee-dashboard/add' element={<EmployeeRegistration CoordinatorStartIndexDropDown={2} />} />
                        <Route path='admin/show-leads' element={<LeadBoard />} />
                        <Route path='admin/show-coordinator' element={<ShowTeamLeader />} />
                        <Route path='admin/show-coordinator/add' element={<TeamLeaderRegister />} />
                        <Route path='admin/show-leads/add' element={<AddClient />} />
                        <Route path='admin/download-report' element={<DownloadReport />} />
                    </Route>

                    {/* Coordinator Router */}
                    <Route path='/' element={<CoordinatorLayout />}>
                        <Route path='coordinator/dashboard' element={<CoordinatorDashboard />} />
                        <Route path='coordinator/employee-dashboard' element={<CoordinatorEmployeeBoard />} />
                        <Route path='coordinator/employee-dashboard/add' element={<CoordinatorAddEmployee />} />
                         
                         {/* creating update Route */}
                         <Route path='admin/employee-dashboard/update/:id' element={<Up/>} />


                        <Route path='coordinator/leads' element={<CoordinatorLeads />} />
                        <Route path='coordinator/leads/add' element={<AddClient />} />
                        <Route path='coordinator/download-report' element={<CoordinatorCanDownloadReport />} />
                    </Route>

                    {/* Employee Router */}
                    <Route path='/' element={<EmployeeLayout />}>
                        <Route path='employee/dashboard' element={<EmployeeDashboard />} />
                        <Route path='employee/show-leads' element={<EmployeeLeads />} />
                        <Route path='employee/show-leads/add' element={<AddClient employeeID={localStorage.getItem('employeeId')} />} />
                    </Route>
                </Routes>
            {/* </AuthProvider> */}

        </React.Fragment>
    )
}

export default Index;