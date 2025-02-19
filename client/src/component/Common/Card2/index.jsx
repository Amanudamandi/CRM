import React from 'react';
import { FaUserTie } from "react-icons/fa6";
import { MdSystemUpdateAlt } from "react-icons/md";

const Index = ({ uniqueID, employeeId, name, mobile, state, setCoordinatorProfile }) => {

    const Style = {
        topMostContainer: { display: 'flex', justifyContent: 'space-between', width: 'max-content', border: '1px solid #ddd', boxShadow: '0px 0px 10px #ddd', borderRadius: '5px' },
        cardContainer: { position: 'relative', display: 'flex', padding: '1rem 0.9rem', gap: '0.8rem' },
        imageContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ddd', padding: '1.2rem' },
        coordinatorInfoContainer: {},
        updateIconContainer: { position: 'absolute', right: 8, top: 8 }
    }
    return (
        <div style={Style.topMostContainer}>
            <div style={Style.cardContainer}>
                <div style={Style.imageContainer}>
                    <FaUserTie size={30} color='#AA0B2B' />
                </div>
                <div style={Style.coordinatorInfoContainer} >
                    <p style={Style.updateIconContainer}
                        title='Update'
                        onClick={(event) => {
                            event.stopPropagation();
                            console.log(employeeId, name, mobile, state);
                            setCoordinatorProfile((previous) => ({ ...previous, clicked: true, employeeId, name, mobile, state, uniqueID }));
                        }}
                    >
                        <MdSystemUpdateAlt />
                    </p>
                    <div>
                        <span style={{ ...Style.coordinatorInfo, fontWeight: '600' }}>{employeeId || 'Employee Id'}</span>
                    </div>
                    <p style={{ width: '100px', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden' }}>
                        <span style={Style.coordinatorInfo}>{name || 'Name'}</span>
                    </p>
                    <div>
                        <span style={Style.coordinatorInfo}>{mobile || 'Mobile'}</span>
                    </div>
                    <p style={{ width: '100px', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden' }}>
                        <span style={Style.coordinatorInfo}>{state.join(', ') || 'State'}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Index;