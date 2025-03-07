import React from 'react';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import CoordinatorSideNav from '../Common/SideNav2/index';
import { useAuth } from '../../Context/Authentication/AuthContext';

const Index = () => {
    // const { setIsAuthenticated } = useAuth();
    // useEffect(() => {
    //     const _id = localStorage.getItem('employeeId');
    //     const role = localStorage.getItem('role');
    //     if(_id !== '' || _id !== null || _id !== undefined){
    //         setIsAuthenticated((previousData) => ({ ...previousData, employeeId: _id, role }));
    //     }
    // }, [setIsAuthenticated]);

    const Styles = {
        webSiteContainer: { display: 'grid', gridTemplateColumns: '16rem 1fr', height: '100vh', overflow: 'hidden' }
    }
    return(
        <React.Fragment>
            <article style={Styles.webSiteContainer}>
                <header>
                    <CoordinatorSideNav
                        department='Coordinator'
                        nameLogo='C'
                    />
                </header>
                <main>
                    <Outlet />
                </main>
            </article>
        </React.Fragment>
    )
}

export default Index;