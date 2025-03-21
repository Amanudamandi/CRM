import React from 'react';
import { Outlet } from 'react-router-dom';
import DealerSideBar from '../Common/SideNav2/index';

const Index = () => {

    const Styles = {
        webSiteContainer: { display: 'grid', gridTemplateColumns: '16rem 1fr', height: '100vh', overflow: 'hidden'}
    }
    return(
        <React.Fragment>
            <article style={Styles.webSiteContainer}>
                <header>
                    <DealerSideBar
                        department='Dealer'
                        nameLogo='D'
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