import React from 'react';
import { Outlet } from 'react-router-dom';
import DLEmpSideBar from "../Common/DLEmpSidebar/Index";

const Index = () => {

    const Styles = {
        webSiteContainer: { display: 'grid', gridTemplateColumns: '16rem 1fr', height: '100vh', overflow: 'hidden'}
    }
    return(
        <React.Fragment>
            <article style={Styles.webSiteContainer}>
                <header>
                    <DLEmpSideBar
                        department='DLEmployee'
                        nameLogo='E'
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