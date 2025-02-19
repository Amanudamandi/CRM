import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeSideNav from '../Common/sideNav3/index';

const Index = () => {

    const Styles = {
        webSiteContainer: { display: 'grid', gridTemplateColumns: '16rem 1fr', height: '100vh', overflow: 'hidden'}
    }
    return(
        <React.Fragment>
            <article style={Styles.webSiteContainer}>
                <header>
                    <EmployeeSideNav
                        department='Employee'
                        nameLogo='A'
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