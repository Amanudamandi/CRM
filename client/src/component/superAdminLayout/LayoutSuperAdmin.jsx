import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarSA from '../Common/superAdminSidebar/SidebarSA';

const LayoutSuperAdmin = () => {
    const Styles = {
        webSiteContainer: { display: 'grid', gridTemplateColumns: '16rem 1fr', height: '100vh', overflow: 'hidden' }
    }
    return (
        <React.Fragment>
            <article style={Styles.webSiteContainer}>
                <header>
                    <SidebarSA
                        department='SuperAdmin'
                        nameLogo='SA'
                    />
                </header>
                <main>
                    <Outlet />
                </main>
            </article>
        </React.Fragment>
    )
}


export default LayoutSuperAdmin