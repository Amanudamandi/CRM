import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChartPie } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { BsFileBarGraphFill } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import { GiPathDistance } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";

import '../../../index.css';
import { set } from 'date-fns';


function Index({ department, nameLogo }) {

    const Styles = {
        sideNavHeader: { position: 'fixed', left: '0', top: '0' },
        employeeOptionsContainer: { display: 'flex', flexDirection: 'column', padding: ' 1rem' },
        employeeOption: { width: '100%', padding: '0.4rem 0.2rem', textDecoration: 'none', color: '#fff' }
    }

    const [showLeadOption, setShowLeadOption] = useState(false);

    const showOption = (setShowOption) => {
        setShowOption(true);
    }


    const closeOption = (setShowOption) => {
        setShowOption(false);
    }

    return (
        <nav className='sideNav-container'>
            <section className='menu-container'>
                <div className='description'>
                    <div className='name-logo-container'>
                        <span className="name-logo" style={{ fontWeight: '900', color: '#AA0B2B' }}>{nameLogo}</span>
                    </div>
                    <div className="department-name">
                        <span style={{ fontSize: '2rem' }}>{department}</span>
                        <span style={{ fontSize: '0.825rem' }}>Department</span>
                    </div>
                </div>
                <Link to='employeeDL/dashboard' className='menu-option'>
                    <FaChartPie color='#fff' />
                    <span className='option'>Dashboard</span>
                </Link>

                <Link to='employeeDL/show-leads' className='menu-option' style={{ width: '100%', position: 'relative', alignItems: 'flex-start' }} onClick={() => {
                    !showLeadOption && showOption(setShowLeadOption);
                }}>
                    <FaAddressCard color='#fff' />
                    <div className='option'>
                        Lead
                        {
                            showLeadOption && <div style={Styles.employeeOptionsContainer}>
                                <Link to='employeeDL/show-leads/add' className="employee-option" style={Styles.employeeOption}>Add</Link>
                            </div>
                        }
                    </div>
                    <IoIosArrowDown color='#fff' onClick={() => closeOption(setShowLeadOption)} style={{ position: 'absolute', right: '1.2rem', top: '1.2rem', transform: showLeadOption ? 'rotate(180deg)' : '' }} />
                </Link>

                <Link className='menu-option'>
                    <BsFileBarGraphFill color='#fff' />
                    <span className='option'>Report</span>
                </Link>

                <Link className='menu-option'>
                    <MdLocationOn color='#fff' />
                    <span className='option'>Location Analytics</span>
                </Link>

                <Link className='menu-option'>
                    <GiPathDistance size={22} color='#fff' />
                    <span className='option'>Travel Statistics</span>
                </Link>
            </section>

        </nav>
    )
}

export default Index