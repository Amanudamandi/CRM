import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import UpdateSurvey from './UpdateSurveyInfo/UpdateSurvey';
import UpdatePayment from './UpdatePayment/UpdatePayment';

const ShowDetails = () => {

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


  const location = useLocation();
  const data = location.state?.item;
  // console.log("data: ", data);

  const ClientDetails = data?.ClientDetails;
  const state = data?.State;
  const addtionalDetails = data?.AdditionalDetails;
  const fieldEmployee = data?.FieldemployeeDetails;

  console.log("client details : ", ClientDetails);
  // console.log("fieldEmployee details : ", fieldEmployee);
  // console.log("addtionalDetails details : ", addtionalDetails);

  const navigate = useNavigate();


  const [info, setInfo] = useState({
    surveyID: addtionalDetails?._id,
    floor: addtionalDetails?.No_of_Floor,
    earthingWire: addtionalDetails?.Earthing_Wire_Length,
    typeRoof: addtionalDetails?.Type_Of_Roof,
    acWire: addtionalDetails?.Ac_wire_Length,
    dcWire: addtionalDetails?.Dc_Wire_Length,
    sanctionedLoad: addtionalDetails?.Sanctioned_Load,
    capacity: addtionalDetails?.Proposed_Capacity_Kw,
    meter: addtionalDetails?.Type_of_Meter
  });

  // console.log("information : ",info);

  const [paymentInfo, setPaymentInfo] = useState({
    paymentID: ClientDetails?._id,
    totalAmount: ClientDetails?.Totalamount,
    receivedamount: ClientDetails?.Receivedamount,
    pendingAmount: ClientDetails?.Totalamount - ClientDetails?.Receivedamount
  })

  // console.log("payment info : ",paymentInfo)

  const [sendData, setSendData] = useState(false);
  const sendSurveyInfo = () => {
    setSendData(true);
  }
  const [sendPaymentData, setSendPaymentData] = useState(false);
  const sendPaymentInfo = () => {
    setSendPaymentData(true);
  }





  // const goBack = () => {
  //   if (paymentInfo.pendingAmount === 0) {
  //     navigate("/superAdmin/MaterialDispatch/ListCompletePayment")
  //   } else {
  //     navigate("/superAdmin/BeforeInstallation");
  //   }
  // }

  const goBack = () => {
    const previousPath = location.state?.from;
    if (previousPath) {
      navigate(previousPath);
    } else {
      // fallback if state.from isn't present
      if (paymentInfo.pendingAmount === 0) {
        navigate("/superAdmin/MaterialDispatch/ListCompletePayment");
      } else {
        navigate("/superAdmin/BeforeInstallation");
      }
    }
  };





  return (

    <div style={{ marginTop: "20px" }}>
      <div style={styles.container}>
        <h1 style={{ marginBottom: "20px", textAlign: "center" }}>📝 Lead Summary</h1>

        <h2 style={{ marginTop: "20px", marginBottom: "15px" }}>📌 Basic Info</h2>
        <div style={styles.grid}>
          <div style={styles.card}> Name: {ClientDetails?.name}</div>
          <div style={styles.card}> Email: {ClientDetails?.email}</div>
          <div style={styles.card}> Phone: {ClientDetails?.mobile}</div>
          <div style={styles.card}> Installation: {ClientDetails?.isInstalled ? ClientDetails?.isInstalled : "Pending"}</div>
          <div style={styles.card}> State : {state?.state} </div>
          <div style={styles.card}> Field Employee : {fieldEmployee[0]?.name ? fieldEmployee[0]?.name : "N/A"} </div>
          <div style={styles.card}> Emploee No: {fieldEmployee[0]?.mobile ? fieldEmployee[0]?.mobile : "N/A"} </div>
          <div style={styles.card}> Payment Status : {ClientDetails?.PaymentStatus} </div>
        </div>

        <h2 style={{ marginTop: "20px", marginBottom: "15px" }}>📝 Survey Information</h2>
        <div style={{ position: "relative" }}>
          <button style={styles.updateBtn} onClick={sendSurveyInfo}> Update</button>
        </div>

        {
          sendData && (
            <UpdateSurvey
              data={info}
              formClose={setSendData}
              showForm={sendData}
            />
          )
        }

        <div style={{ ...styles.box, ...styles.grid }}>
          <div style={styles.card}> No of Floor: {addtionalDetails?.No_of_Floor}</div>
          <div style={styles.card}> Address : {ClientDetails?.address}</div>
          <div style={styles.card}> Earthing wire length : {addtionalDetails?.Earthing_Wire_Length}</div>
          <div style={styles.card}> Type Of roof: {addtionalDetails?.Type_Of_Roof}</div>
          <div style={styles.card}> Ac wire length: {addtionalDetails?.Ac_wire_Length}</div>
          <div style={styles.card}> Dc wire length: {addtionalDetails?.Dc_Wire_Length}</div>
          <div style={styles.card}> Sanctioned Load: {addtionalDetails?.Sanctioned_Load}</div>
          <div style={styles.card}> Capacity in KW: {addtionalDetails?.Proposed_Capacity_Kw}</div>
          <div style={styles.card}> Type of Meter: {addtionalDetails?.Type_of_Meter}</div>

        </div>

        <h2 style={{ marginTop: "20px", marginBottom: "15px" }}>💳 Bank Details</h2>
        <div style={styles.box}>
          <p style={{ margin: "7px" }}><strong>IFSC Code :</strong>{addtionalDetails?.IFSC} </p>
          <p style={{ margin: "7px" }}><strong>Account Number:</strong> {addtionalDetails?.AccountNo}</p>
          <p style={{ margin: "7px" }}><strong>Bank Address:</strong> {addtionalDetails?.BankAddress}</p>
        </div>

        <h2 style={{ marginTop: "20px", marginBottom: "15px" }}>💰 Amount Summary</h2>

        {console.log("padingAmount : ", paymentInfo.pendingAmount)}
        {
          (paymentInfo.pendingAmount === 0) ? (
            <div style={{ position: "relative" }}>
              <button style={{ ...styles.updateBtn, display: "none" }} onClick={sendPaymentInfo} disabled> Update</button>
            </div>

          ) : (
            <div style={{ position: "relative" }}>
              <button style={styles.updateBtn} onClick={sendPaymentInfo} > Update</button>
            </div>
          )
        }

        {
          sendPaymentData && (
            <UpdatePayment
              data={paymentInfo}
              showForm={sendPaymentData}
              closeForm={setSendPaymentData}
            />
          )
        }
        <div style={styles.box}>
          <p style={{ margin: "7px" }}><strong>Total Amount:</strong> ₹{ClientDetails?.Totalamount}</p>
          <p style={{ margin: "7px" }}><strong>Received Amount:</strong> ₹{ClientDetails?.Receivedamount}</p>
          <p style={{
            color: (ClientDetails?.Totalamount - ClientDetails?.Receivedamount) === 0 ? 'green' : 'red',
            margin: '7px'
          }}>
            <strong>Pending Amount:</strong> ₹{ClientDetails?.Totalamount - ClientDetails?.Receivedamount}
          </p>
        </div>

        <h2 style={{ marginTop: "20px", marginBottom: "15px" }}>📦 Addtional Details</h2>
        <div style={{ ...styles.imageGrid, ...styles.box }}>
          <div>
            <label style={styles.lable} htmlFor="">Aadhar Card</label>
            <a href={addtionalDetails?.AadharCard} download target="_blank">
              <img style={{ ...styles.image, cursor: "pointer" }} src={addtionalDetails?.AadharCard} alt='AadharCard' />
            </a>
          </div>
          <div>
            <label style={styles.lable} htmlFor="">Pan Card</label>
            <a href={addtionalDetails?.PanCard} download target="_blank">
              <img style={{ ...styles.image, cursor: "pointer" }} src={addtionalDetails?.PanCard} alt='PanCard' />
            </a>
          </div>
          <div>
            <label style={styles.lable} htmlFor="">Cancle Cheack</label>
            <a href={addtionalDetails?.CancelCheack} download="cancelCheck.jpg" target="_blank">
              <img style={{ ...styles.image, cursor: "pointer" }} src={addtionalDetails?.CancelCheack} alt='CancelCheack' />
            </a>

          </div>

          <div>
            <label style={styles.lable} htmlFor="">Earthing Cable</label><br />
            <a href={addtionalDetails?.ELCB} download target="_blank">
              <img style={{ ...styles.image, cursor: "pointer" }} src={addtionalDetails?.ELCB} alt='ELCB' />
            </a>
          </div>

          <div>
            <label style={styles.lable} htmlFor="">Dimension</label>
            <a href={addtionalDetails?.Dimension} download target="_blank">
              <img style={{ ...styles.image, cursor: "pointer" }} src={addtionalDetails?.Dimension} alt='Dimension' />
            </a>
          </div>

          <div>
            <label style={styles.lable} >Electricity Bill</label>
            <a href={addtionalDetails?.ElectrcityBill} download target="_blank">
              <img style={{ ...styles.image, cursor: "pointer" }} src={addtionalDetails?.ElectrcityBill} alt='ElectrcityBill' />
            </a>

          </div>

          <div>
            <label style={styles.lable} htmlFor="">Roof Picture</label>
            <a href={addtionalDetails?.Roof_Picture} download target="_blank">
              <img style={{ ...styles.image, cursor: "pointer" }} src={addtionalDetails?.Roof_Picture} alt='Roof_Picture' />
            </a>
          </div>
        </div>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <button style={styles.backBtn} onClick={goBack}>
            Go Back
          </button>
        </div>
      </div>

    </div>

  )
}

export default ShowDetails