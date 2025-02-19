import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNav from '../Common/SideNav/index';

const Index = () => {

    const Styles = {
        webSiteContainer: { display: 'grid', gridTemplateColumns: '16rem calc(100% - 16rem)', height: '100vh', overflow: 'hidden'}
    }
    return(
        <React.Fragment>
            <article style={Styles.webSiteContainer}>
                <header>
                    <SideNav 
                        department='Admin' 
                        nameLogo='S'    
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