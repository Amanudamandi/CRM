import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5';
import { Remainder } from './remainder/Remainder';
import Offer from './offer/Offer';

const Whatsapp = ({ showWhatsappForm, closeForm, data }) => {
    const Style = {
        updateLeadContainer: { position: 'fixed', width: '70%', height: '98vh', margin: '0rem 1rem 0rem 8.2rem', padding: '3.5rem 1rem', backgroundColor: '#fff', top: '50%', left: '50%', zIndex: '7777', boxShadow: '0px 0px 2px black', borderRadius: '8px', transform: 'translate(-50%, -50%)' },
        closeFormBtn: { position: 'absolute', top: '1rem', right: '1rem', cursor: 'pointer', transition: 'transform 0.4s ease' },
        updateLeadInfoContainer: { margin: 'auto', width: '85%', borderBottom: '3px solid #AA0B2B' },
        showOnlyDetailsContainer: { display: 'flex', backgroundColor: 'rgba(217, 217, 217, 0.35)', gap: '8px', borderRadius: '5px' },
        leadLogoContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#AA0B2B', width: '4.5rem', height: '4rem', borderTopLeftRadius: '5px' },
        leadLogo: { color: '#fff', fontSize: '2.5rem', fontWeight: 800, textAlign: 'center' },
        leadInfoContainer: { width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 4rem', padding: '4px 0px' },
        leadInfo: { display: 'flex', flexDirection: 'column', justifyContent: 'space-around' },
        leadInfoText: { letterSpacing: '0.75px' },
        leadType: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        formContainer: { margin: 'auto', width: '85%', display: 'grid', gridTemplateColumns: '2fr 15rem', gap: '12px' },
        updateForm: { display: 'grid', gridTemplateColumns: '1fr 0.2rem 1fr', gap: '16px', padding: '1.5rem 0rem' },
        updateBtn: { width: '75%', padding: '0.5rem 1rem', backgroundColor: '#AA0B2B', border: 'none', margin: "15px", borderRadius: '5px', color: '#fff', cursor: 'pointer' },
        leftFormFieldContainer: {},
        inputFieldContainer: { marginBottom: '1rem' },
        inputLabel: { display: 'block', width: 'fit-content', marginBottom: '0.2rem', fontWeight: 600 },
        inputField: { width: '100%', borderColor: '#000', padding: '0.5rem', borderRadius: '5px' },
        stagesMainContainer: { backgroundColor: 'rgba(217, 217, 217, 35%)', padding: '2.5rem 1.8rem' },
        stagesContainer: { height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', borderLeft: '2px solid #AA0B2B' },
        eachStageContainer: { display: 'flex', alignItems: 'center', gap: '8px' },
        eachStageCircle: { width: '0.75rem', border: '2px solid #AA0B2B' },
        whatsappBtn: { fontSize: "15px", padding: "7px", borderRadius: "10px", backgroundColor: '#AA0B2B', border: "none", color: "white", cursor: "pointer", margin: "5px" },
        employeeValue: { padding: '0.3rem', fontSize: '1rem', textAlign: 'center', fontWeight: '500', whiteSpace: 'nowrap' }

    };
    // console.log("data of whatsapp : ", data)



    const [isHoveredOnClose, setIsHoveredOnClose] = useState(false);
    const [remainder, setRemainder] = useState(false);
    const [offer, setOffer] = useState(false);
    const [quotation, setQuotation] = useState(false);


    const handleRemember = () => {
        setRemainder(true);
        setOffer(false);
        setQuotation(false)
    }

    const handleOffer = () => {
        setRemainder(false);
        setOffer(true);
        setQuotation(false)
    }
    
    const handleQuotation = () => {
        setRemainder(false);
        setOffer(false);
        setQuotation(true)
    }





    return (
        <section style={showWhatsappForm ? { ...Style.updateLeadContainer, animation: 'slideUp 0.5s ease forwards' } : Style.updateLeadContainer}>
            <IoClose size={35} color='#AA0B2B' style={{ ...Style.closeFormBtn, transform: isHoveredOnClose ? 'rotate(90deg)' : 'rotate(0deg)' }} onMouseOver={() => setIsHoveredOnClose(true)} onMouseOut={() => setIsHoveredOnClose(false)} onClick={() => closeForm(false)} />



            <div>
                <div>
                    <button style={Style.updateBtn} onClick={handleRemember}>Send Remainder</button>
                </div>
                {remainder && (
                    <Remainder
                        showRemainder={remainder}
                        data={data}
                        closeForm={setRemainder}
                    />
                )}

                <div>
                    <button style={Style.updateBtn} onClick={handleOffer}>Send Special Offer </button>
                </div>

                {
                    offer && (
                        <Offer
                            data={data}
                            closeForm={setOffer}
                            showOffer={offer}
                        />
                    )
                }

                <div>
                    <button style={Style.updateBtn} onClick={handleQuotation}>Send Quotation </button>
                </div>
            </div>



        </section>


    )
}

export default Whatsapp