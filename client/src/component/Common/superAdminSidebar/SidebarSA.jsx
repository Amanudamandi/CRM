import React, { useState } from 'react'
import '../../../index.css'
import { Link } from 'react-router-dom'
import { FaHourglassHalf } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoIosArrowDown } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa';
import { FaRupeeSign } from 'react-icons/fa';
import { MdElectricMeter } from 'react-icons/md';
import { FaHandHoldingUsd } from 'react-icons/fa';
import { FaBoxes } from 'react-icons/fa';

const SidebarSA = ({ department, nameLogo, designation }) => {
  const Styles = {
    sideNavHeader: { position: 'fixed', left: '0', top: '0' },
    employeeOptionsContainer: { display: 'flex', flexDirection: 'column', padding: ' 1rem' },
    employeeOption: { width: '100%', padding: '0.4rem 0.2rem', textDecoration: 'none', color: '#fff' }
  }

  const [showInstaller, setShowInstaller] = useState(false);

  const show = (setShowOption) => {
    setShowOption(true);
  }

  const close = (setShowOption) => {
    setShowOption(false);
  }

  return (
    <>

      {/* {console.log("designation :  ",designation)} */}
      {designation === "paymentManager" && (
        <nav className='sideNav-container'>
          <section className='menu-container'>
            <div className='description'>
                <div className='name-logo-container'>
                  <span className="name-logo" style={{ fontWeight: '900', color: '#AA0B2B', borderRadius: "50%" }}>{nameLogo}</span>
                </div>

                <div className="department-name">
                  <span style={{ fontSize: '2rem' }}>{department}</span>
                  <span style={{ fontSize: '1rem' }}>Department</span>
                </div>
            </div>


            <Link to="/superAdmin/Installer" className='menu-option' style={{ width: '100%', position: 'relative', alignItems: 'flex-start' }} onClick={() => { !showInstaller && show(setShowInstaller) }} >
              <FaRegCircleUser color='#fff' />
              <div className='option'>
                Installer Employee
                {
                  showInstaller && <div style={Styles.employeeOptionsContainer}>
                    <Link to='/superAdmin/Installer/add' className="employee-option" style={Styles.employeeOption}>Add</Link>
                  </div>
                }
              </div>
              <IoIosArrowDown color='#fff' onClick={() => close(setShowInstaller)} style={{ position: 'absolute', right: '1.2rem', top: '1.2rem', transform: showInstaller ? 'rotate(180deg)' : '' }} />


            </Link>

            <Link to="/superAdmin/BeforeInstallation" className='menu-option'>
              <FaHourglassHalf color='#fff' />
              <span className='option'>Status Pending Payment </span>
            </Link>

          </section>

        </nav>
      )
      }

      {designation === "Material Dispatch Manager" && (
        <nav className='sideNav-container'>
          <section className='menu-container'>
            <div className='description'>
              <div className='name-logo-container'>
                <span className="name-logo" style={{ fontWeight: '900', color: '#AA0B2B', borderRadius: "50%" }}>{nameLogo}</span>
              </div>
              <div className="department-name">
                <span style={{ fontSize: '2rem' }}>{department}</span>
                <span style={{ fontSize: '1rem' }}>Department</span>
              </div>
            </div>
            <Link to="/superAdmin/MaterialDispatch/ListCompletePayment" className='menu-option'>
              <FaRupeeSign color='#fff' />
              <span className='option'>List Complete Payment  </span>
            </Link>
            <Link to="/superAdmin/MaterialDispatchStatus" className='menu-option'>
              <FaTruck color='#fff' />
              <span className='option'>Meterial Dispatch Status </span>
            </Link>
            <Link to="/superAdmin/MaterialDispatch/assignInstaller" className='menu-option'>
              <FaHourglassHalf color='#fff' />
              <span className='option'>Assign Installer </span>
            </Link>

            <Link to="/superAdmin/MaterialDispatchInfo" className='menu-option'>
              <FaBoxes color='#fff' />
              <span className='option'> Material Information </span>
            </Link>
            <Link to="/superAdmin/verifiedLead" className='menu-option'>
              <FaCheck color='#fff' />
              <span className='option'>Installation Completed</span>
            </Link>
            <Link to="/superAdmin/Netmetering" className='menu-option'>
              <MdElectricMeter color='#fff' />
              <span className='option'>Net-Metering</span>
            </Link>
            <Link to="/superAdmin/Subsidy" className='menu-option'>
              <FaHandHoldingUsd color='#fff' />
              <span className='option'>Subsidy</span>
            </Link>
           
          </section>
        </nav>
      )}

      {designation === "Netmetering Manager" && (
        <nav className='sideNav-container'>
          <section className='menu-container'>
            <div className='description'>
              <div className='name-logo-container'>
                <span className="name-logo" style={{ fontWeight: '900', color: '#AA0B2B', borderRadius: "50%" }}>{nameLogo}</span>
              </div>
              <div className="department-name">
                <span style={{ fontSize: '2rem' }}>{department}</span>
                <span style={{ fontSize: '1rem' }}>Department</span>
              </div>
            </div>
          </section>
        </nav>

      )}
    </>

  )
}

export default SidebarSA;