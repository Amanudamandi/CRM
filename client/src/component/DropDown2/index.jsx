import React from 'react';
import './index.css';

const Index = ( { objectList, startIndex = 0, selectedValue, setSelectedValue, isOpen, setIsOpen, height, overflow, key1, key2, key3, key4 }) => {

    const Styles = {
        dropDownContainer: { listStyle: 'none', width: '100%', height: `${height}px` || 'auto', display: 'flex', flexDirection: 'column', position: 'absolute', backgroundColor: '#fff', border: '1px solid #ddd', boxShadow: '0px 8px 16px rgba(0,0,0,0.2)', zIndex: '10', overflowY: `${overflow}` || 'hidden' }
    }

    return(
        <div className="dropdown-container">
            <div className='dropdown-btn' onClick={setIsOpen}>
                {selectedValue}
            </div>
            {isOpen && <ul style={Styles.dropDownContainer}>
                {objectList.map((option, index) => (
                    index >= startIndex && <li key={option._id} className='dropdown-item' onClick={() => setSelectedValue(option[key1], option[key2], option[key3] || '', option[key4] || '')}>{option[key1]}</li>
                ))}
                
            </ul>}
        </div>
    )
}

export default Index;