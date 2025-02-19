import React from 'react';
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useAuth } from '../../../Context/Authentication/AuthContext';

const Index = ({ title }) => {
    const { logout } = useAuth();

    const Styles = {
        headingContainer: { flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between',  letterSpacing: '1px', backgroundColor: '#fff', padding: '0.8rem 1.5rem', boxShadow: '0px 0px 10px #ddd', borderRadius: '8px' },
        heading: {color: '#AA0B2B'},
    }
    return(
        <div style={Styles.headingContainer}>
            <h3 style={Styles.heading}>{title}</h3>
            <RiLogoutBoxRLine title='logout' size={22} style={{ cursor: 'pointer'}} color='#AA0B2B' onClick={logout} />
        </div>
    )
}

export default Index;