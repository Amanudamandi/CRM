import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const ShowMertialDetails = () => {
    const styles = {
        container: {
            maxWidth: "1000px",
            margin: "auto",
            padding: "20px",
            background: "#D0D0D0",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            fontFamily: "Segoe UI, sans-serif",
            overflowY: "auto",
            maxHeight: "90vh",
            scrollbarWidth: "thin",
            msOverflowStyle: "none",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "10px",
            marginBottom: "10px",
        },
        card: {
            background: "#f9f9f9",
            padding: "10px",
            borderRadius: "8px",
            fontWeight: "500"
        },
        box: {
            background: "#f1f1f1",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "20px",
        },
        imageGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",  // 👈 fixed 3 per row
            gap: "20px",
            marginBottom: "20px",
        },
        image: {
            width: "100%",
            height: "100px",
            objectFit: "cover",
            borderRadius: "6px",
            marginTop: "7px"
        },
        backBtn: {
            color: "red",
            border: "none",
            padding: "8px",
            fontSize: "17px",
            borderRadius: "10px",
            margin: "0 auto",
            display: "block",
            marginBottom: "20px",
            fontWeight: "600",
        },
        lable: {
            fontWeight: "600",
            margin: "10px"
        },
        updateBtn: {
            position: "absolute",
            top: "-30px",
            right: "15px",
            fontSize: "1rem",
            marginBottom: "15px",
            padding: "2px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            color: "red"
        }

    };

    const navigate = useNavigate();
    const location = useLocation();
    const clientData = location.state?.item;
    // console.log("Client Data : ",clientData);

    const pannelData = clientData?.AdditionalDetails;
    // console.log("PannelData Info : ", pannelData);

    const [pannelInfo, setPannelInfo] = useState({
        inverterSerialNo: pannelData?.inverterSerialNo,
        panelSerialNo: pannelData?.panelSerialNo,
        photo: pannelData?.Photos

    })

    // console.log("pannelInfo : ",pannelInfo);

    const goBack = (event) => {
        const prevPath = location.state.from;
        // console.log("prev Path : ",prevPath);
        if (prevPath) {
            navigate(prevPath);
        }
    }

    //  useEffect(()=>{
    //     goBack();
    //  },[])
    return (
        <div style={{ marginTop: "20px" }}>
            <div style={styles.container}>
                <h1 style={{ marginBottom: "20px", textAlign: "center" }}>📝 Pannel Summary</h1>

                <h2 style={{ marginTop: "20px", marginBottom: "15px" }}>Panel Serial No</h2>
                <div style={styles.grid}>
                    {
                        pannelInfo?.panelSerialNo.map((pannelNo,index) => (
                            // console.log("pannel : ", pannelNo)
                            <div key={index} style={styles.card}>
                                Panel Serial Number: {pannelNo ?? "Not Assigned"}
                            </div>

                        ))
                    }
                </div>

                <h2 style={{ marginTop: "20px", marginBottom: "15px" }}>Inverter Serial No</h2>
                <div style={styles.grid}>
                    {
                        pannelInfo?.inverterSerialNo.map((inverterNo,index) => (
                            // console.log("pannel : ", inverterNo)
                            <div  key={index} style={styles.card}> Inverter serial Number: {inverterNo ?? "Not Assign"}</div>

                        ))
                    }
                </div>

                <h2 style={{ marginTop: "20px", marginBottom: "15px" }}>Pannel Image And Inverter Image  </h2>
                <div>
                    <div style={{ ...styles.imageGrid, ...styles.box }}>
                        {
                            pannelInfo?.photo.map((pannelPho) => (
                                // {console.log("pannelPho ",pannelInfo)}

                                <a href={pannelPho} download target="_blank">
                                    <img style={{ ...styles.image, cursor: "pointer" }} src={pannelPho} alt='Pannel Image' />
                                </a>

                            ))
                        }
                    </div>
                </div>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <button style={styles.backBtn} onClick={goBack} >
                        Go Back
                    </button>
                </div>

            </div>

        </div>
    )
}

export default ShowMertialDetails