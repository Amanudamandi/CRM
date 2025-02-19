import React from 'react';
import UpdateCoordinatorProfileForm from '../../TeamLeaderRegister/index';
import { IoClose } from "react-icons/io5";
// import './index.css';

const Index = ({ coordinatorProfileClickedInfo, setCoordinatorProfile }) => {

    console.log(coordinatorProfileClickedInfo);
    const Styles = {
        coordinatorProfileContainer: { margin: '0rem 1rem 0rem 8.2rem', padding: '1.5rem 1rem', width: '75%', height: '92vh', backgroundColor: 'rgb(234, 238, 245)', position: 'fixed', top: '50%', left: '50%', zIndex: '9999', boxShadow: '0px 0px 2px black', borderRadius: '8px', overflow: 'auto', transform: 'translate(-50%, -50%)' },
        closeIconButton: { cursor: 'pointer', position: 'absolute', top: '0.7rem', right: '0.8rem', transition: 'transform 0.4s ease', transformOrigin: 'center' },
    }

    return (
        <>
            <section style={coordinatorProfileClickedInfo.clicked ? { ...Styles.coordinatorProfileContainer, animation: 'slideUp 0.5s ease forwards' } : Styles.coordinatorProfileContainer}>
                <IoClose size={40} color='#AA0B2B' className='close-btn' style={Styles.closeIconButton}
                    onClick={() => {
                        setCoordinatorProfile({ clicked: false })
                    }}
                />
                <UpdateCoordinatorProfileForm
                    updateCoordinatorProfile={coordinatorProfileClickedInfo}
                    setCoordinatorProfile={setCoordinatorProfile}
                />
            </section>
        </>
    )
}

export default Index;