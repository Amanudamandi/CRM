import React, { useState } from 'react'
import '../../../index.css'
import { Link } from 'react-router-dom'
import { FaHourglassHalf } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoIosArrowDown } from 'react-icons/io';

const SidebarSA = ({ department, nameLogo }) => {
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

      
        <Link to="/superAdmin/Installer" className='menu-option' style={{ width: '100%', position: 'relative', alignItems: 'flex-start' }} onClick={() => {!showInstaller && show(setShowInstaller) }} >


        
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
          <span className='option'>Status Before Installation</span>
        </Link>

        <Link to="/superAdmin/AfterInstallation" className='menu-option'>
          <FaTruck color='#fff' />
          <span className='option'>Status After Installation </span>

        </Link>

      </section>

    </nav>
  )
}

export default SidebarSA;