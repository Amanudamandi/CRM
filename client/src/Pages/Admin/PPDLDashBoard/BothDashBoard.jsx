import React from 'react'
import PowerPlantDashBoard from '../../Admin/DashBoard/index';
import DealerDashBoard from '../../Admin/DashBoard/DLDashboard';

const BothDashBoard = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', height: '100vh', overflow: 'auto' }}>
            <div style={{ flex: 1 }}>
                <PowerPlantDashBoard />
            </div> 
            <div style={{ flex: 1 }}>
                <DealerDashBoard />
            </div>
        </div>
    )
}

export default BothDashBoard 