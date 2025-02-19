import React from 'react';
import './index.css';

const Index = ( {selectedDepart, setSelectedDepart, isOpen, setIsOpen}) => {

    return(
        <div className="dropdown-container">
            <div className='dropdown-btn' onClick={setIsOpen}>
                {selectedDepart}
            </div>
            {isOpen && <ul className='dropdown-menu'>
                <li className='dropdown-item' onClick={() => setSelectedDepart("Admin")}>Admin</li>
                <li className='dropdown-item' onClick={() => setSelectedDepart("Employee")}>Employee</li>
                <li className='dropdown-item' onClick={() => setSelectedDepart("Team Leader")}>Team Leader</li>
            </ul>}
        </div>
    )
}

export default Index;