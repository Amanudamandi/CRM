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
import DeleteLead from '../../Pages/Admin/LeadDelete/DeleteLead'

import AdminEmployeeDLBoard from '../../Pages/Admin/EmployeeDLBoard/index';
import EmployeeDLRegister from '../../Pages/employeeDLRegister/index';
import LeadDLBoard from "../../Pages/Admin/LeadDLBoard/Index"
import TeamLeaderDLRegister from '../../Pages/TeamLeaderDLRegister/Index'
import ShowTeamDLLLeader from '../../Pages/showTeamDLLeader/Index'
import AddDLClient from '../../Pages/Admin/LeadDLRegister/Index'

import DealerLayout from '../DealerLayout/Index'
import DealerDashBoard from '../../Pages/DealerTL/Dashboard/Index'
import CoordinateDealerBoard from '../../Pages/DealerTL/EmployeeBoard/Index'

import coordinateDealerAdd from '../../Pages/DealerTL/EmployeeBoard/DealerRegister/index'

import DLEmpLead from '../../Pages/Admin/LeadDLBoard/Index';
import DLEmpDashboard from '../../Pages/DLEmployee/DLDashboard/EmpDashboard';
import DLLeadAddEmp from '../../Pages/DLEmployee/DLEmpLead/AddLeadDL'
import DealerLeadShow from "../../Pages/DLEmployee/leadBoardDL/LeadBoardDl"
import DeleteDealerLead from '../../Pages/Admin/LeadDelete/DeleteDlLead';

import BothDashBoard from '../../Pages/Admin/PPDLDashBoard/BothDashBoard';

import UpdateDealer from '../Common/UpdateDealerForm/UpdateDealer';


// DealerEmp 
import DlEmplayout from "../DealerEmpLayout/Index";

import SuperAdmin from '../superAdminLayout/LayoutSuperAdmin';

import Lead from '../../Pages/SuperAdmin/LeadBoardPending/lead'
import EmployeeList from '../../Pages/SuperAdmin/EmployeeBoard/EmployeeList';
import SAEmpRegister from '../../Pages/SuperAdmin/EmpRegister/EmpRegister'
import ShowDetails from '../Common/ShowSuperAdminDetails/ShowDetails';
import ListCompPymt from '../Common/ShowSuperAdminDetails/ListOfCompletePayment/listCompPymt';
import AsginInstaller from '../Common/ShowSuperAdminDetails/AssignInstaller/AsginInstaller';
import MaterialDispatch from '../Common/ShowSuperAdminDetails/MatralDispatchInfomation/MaterialDispatch';
import ShowMertialDetails from '../Common/ShowSuperAdminDetails/ShowMertialDetails';
import VerifiedLead from '../Common/ShowSuperAdminDetails/verfiedLead/VerifiedLead';

const Index = () => {
    // removeCookie('accessToken')
    // console.log(getCookie('accessToken'));
    const { setIsAuthenticated } = useAuth();
    useEffect(() => {
        const _id = localStorage.getItem('employeeId');
        const role = localStorage.getItem('role');
        if (_id !== '' || _id !== null || _id !== undefined) {
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
                    <Route path='admin/dashboard' element={<BothDashBoard />} />
                    <Route path='admin/employee-dashboard' element={<AdminEmployeeBoard />} />
                    <Route path='admin/employee-dashboard/add' element={<EmployeeRegistration CoordinatorStartIndexDropDown={2} />} />
                    <Route path='admin/show-leads' element={<LeadBoard />} />
                    <Route path='admin/show-coordinator' element={<ShowTeamLeader />} />
                    <Route path='admin/show-coordinator/add' element={<TeamLeaderRegister />} />
                    <Route path='admin/show-leads/add' element={<AddClient />} />
                    <Route path='admin/download-report' element={<DownloadReport />} />
                    {/* creating update Route */}
                    <Route path='admin/employee-dashboard/update/:id' element={<Up />} />
                    <Route path='admin/show-leads/delete' element={<DeleteLead />} />

                    {/* Employee Dealer Route */}
                    <Route path='/admin/employeeDL-dashboard' element={<AdminEmployeeDLBoard />} ></Route>
                    <Route path='/admin/employeeDL-dashboard/add' element={<EmployeeDLRegister CoordinatorStartIndexDropDown="2" />}></Route>
                    <Route path='/admin/showDL-coordinator' element={<ShowTeamDLLLeader />}></Route>
                    <Route path='/admin/showDL-coordinator/add' element={<TeamLeaderDLRegister />}></Route>
                    <Route path='/admin/showDL-leads' element={<LeadDLBoard />} ></Route>
                    <Route path='/admin/showDL-leads/add' element={<AddDLClient />} ></Route>
                    <Route path='/admin/showDL-leads/delete' element={<DeleteDealerLead />}></Route>
                    <Route path='/admin/employeeDL/update/:id' element={<UpdateDealer />}></Route>
                </Route>

                {/* Coordinator Router */}
                <Route path='/' element={<CoordinatorLayout />}>
                    <Route path='coordinator/dashboard' element={<CoordinatorDashboard />} />
                    <Route path='coordinator/employee-dashboard' element={<CoordinatorEmployeeBoard />} />
                    <Route path='coordinator/employee-dashboard/add' element={<CoordinatorAddEmployee />} />
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

                {/* dealerTL dashboard not working properly */}
                <Route path='/' element={<DealerLayout />}>
                    <Route path='/dealerTL/dashboard' element={<DealerDashBoard />}></Route>
                    <Route path='/dealerTL/dealer-dashboard' element={<CoordinateDealerBoard />} ></Route>
                    <Route path='/dealerTL/dealer-dashboard/add' element={<coordinateDealerAdd />} ></Route>
                </Route>


                {/* Dealer employee */}

                <Route path='/' element={<DlEmplayout />} >
                    <Route path='employeeDL/dashboard' element={<DLEmpDashboard />} />
                    <Route path='employeeDL/show-leads' element={<DealerLeadShow />} />
                    <Route path='employeeDL/show-leads/add' element={<DLLeadAddEmp employeeID={localStorage.getItem('employeeId')} />} />
                </Route>

                {/* SuperAdmin */}
                <Route path='/' element={<SuperAdmin />}>
                    <Route path='/superAdmin/Installer' element={<EmployeeList />} />
                    <Route path='/superAdmin/Installer/add' element={<SAEmpRegister CoordinatorStartIndexDropDown="2" />} />
                    <Route path='/superAdmin/BeforeInstallation' element={<Lead />} />
                    <Route path='/superAdmin/showDetails' element={<ShowDetails />}></Route>
                    <Route path='/superAdmin/MaterialDispatch/ListCompletePayment' element={<ListCompPymt/>} />
                    <Route path='/superAdmin/MaterialDispatch/assignInstaller' element={<AsginInstaller/>}  />
                    <Route path='/superAdmin/MaterialDispatchInfo' element={<MaterialDispatch/>}  /> 
                    <Route path='/superAdmin/materialInfo' element={<ShowMertialDetails/>} /> 
                    <Route path='/superAdmin/verifiedLead' element={<VerifiedLead/>} /> 
                    <Route path='/superAdmin/MaterialDispatchStatus' /> 
                    <Route path='/superAdmin/Netmetering' /> 
                    <Route path='/superAdmin/Subsidy' /> 
                </Route>


            </Routes>
            {/* </AuthProvider> */}






        </React.Fragment>
    )
}

export default Index;