import React from 'react';
// import { useRef } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { LuDot } from "react-icons/lu";
import { FaChartPie } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { BsFileBarGraphFill } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import { GiPathDistance } from "react-icons/gi";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
// import { handleOnFileChange } from '../../../Utils/excelUpload';
import './index.css';

const Index = ( { department, nameLogo }) => {

    const Styles = {
        sideNavHeader: {position: 'fixed', left: '0', top: '0' },
        employeeOptionsContainer: {display: 'flex', flexDirection: 'column', padding: ' 1rem'}, 
        employeeOption: { width: '100%', padding: '0.4rem 0.2rem', textDecoration: 'none', color: '#fff'}
    }
    
    const [ showEmployeeOptions, setShowEmployeeOptions ] = useState(false);
    // const [ showCoordinatorOptions, setShowCoordinatorOptions ] = useState(false);
    const [ showLeadsOptions, setShowLeadsOptions ] = useState(false);
    // const [ selectedLeadFile, setSelectedLeadFile ] = useState(null);
    // const fileInputRef = useRef(null);

    const showOptions = ( setShowOption ) => {
        setShowOption(true);
    }

    const closeOptions = ( setShowOptions ) => {
        setShowOptions(false);
    }

    // const handleOnFileChange = (event) => {
    //     const file = event.target.files[0];
    //     console.log("Selected File", file);
    // }

    // const handleLeadUploadBtnClicked = () => {
    //     console.log(fileInputRef.current);
    //     if(fileInputRef.current){
    //         fileInputRef.current.click();
    //     }
    // }
 
    return(
            <nav className='sideNav-container' >
                <section className='menu-container'>
                    <div className='description'>
                        <div className='name-logo-container'>
                            <span className="name-logo" style={{fontWeight: '900', color: '#AA0B2B'}}>{nameLogo}</span>
                        </div>
                        <div className="department-name">
                            <span style={{fontSize: '1.79rem'}}>{department}</span>
                            <span style={{fontSize: '0.825rem'}}>Department</span>
                        </div>
                    </div>
                    <Link to='coordinator/dashboard' className='menu-option'>
                        <FaChartPie color='#fff'/>
                        <span className='option'>Dashboard</span>
                    </Link>

                    <Link to='/coordinator/employee-dashboard' className='menu-option' style={{ width: '100%', position: 'relative', alignItems: 'flex-start'}} onClick={() => {
                        !showEmployeeOptions && showOptions(setShowEmployeeOptions);
                        setShowLeadsOptions(false);
                    }}>
                        <BsFillPeopleFill style={{marginTop: '0.1rem'}} color='#fff'/>
                        <div className='option'>
                            Employee
                            {
                                showEmployeeOptions && <div style={Styles.employeeOptionsContainer}>
                                    <Link to='coordinator/employee-dashboard/add' className="employee-option" style={Styles.employeeOption}>Add</Link>
                                    <Link to='coordinator/employee-dashboard/update' className="employee-option" style={Styles.employeeOption}>Update</Link>
                                    <Link to='coordinator/employee-dashboard/delete' className="employee-option" style={Styles.employeeOption}>Remove</Link>
                                </div>
                            }
                        </div>
                        <IoIosArrowDown color='#fff' onClick={() => closeOptions(setShowEmployeeOptions)} style={{position: 'absolute', right: '1.2rem', top: '1.2rem', transform: showEmployeeOptions ? 'rotate(180deg)' : '' }}  />
                    </Link>

                    <Link to='coordinator/leads' className='menu-option' style={{ width: '100%', position: 'relative', alignItems: 'flex-start'}} onClick={() => {
                        !showLeadsOptions && showOptions(setShowLeadsOptions);
                        setShowEmployeeOptions(false);
                    }}>
                        <FaAddressCard color='#fff'/>
                        <div className='option'>
                            Lead 
                            {
                                showLeadsOptions && <div style={Styles.employeeOptionsContainer}>
                                    <Link to='coordinator/leads/add' className="employee-option" style={Styles.employeeOption}>Add</Link>
                                    <Link to='coordinator/leads/update' className="employee-option" style={Styles.employeeOption}>Update</Link>
                                    <Link to='coordinator/leads/delete' className="employee-option" style={Styles.employeeOption}>Remove</Link>
                                </div>
                            }
                        </div>
                        <IoIosArrowDown color='#fff' onClick={() => closeOptions(setShowLeadsOptions)} style={{position: 'absolute', right: '1.2rem', top: '1.2rem', transform: showLeadsOptions ? 'rotate(180deg)' : '' }}  />
                    </Link>

                    <Link to='coordinator/download-report' className='menu-option'>
                        <BsFileBarGraphFill color='#fff'/>
                        <span className='option'>Report</span>
                    </Link>

                    <Link className='menu-option'>
                        <MdLocationOn color='#fff'/>
                        <span className='option'>Location Analytics</span>
                    </Link>

                    <Link className='menu-option'>
                        <GiPathDistance size={22} color='#fff' />
                        <span className='option'>Travel Statistics</span>
                    </Link>

                    {/* <Link to='/employee-dashboard' className='menu-option' style={{position: 'relative', alignItems: 'flex-start'}} onClick={() => {
                        toggleOptions(setShowEmployeeOptions, showEmployeeOptions);
                        setShowCoordinatorOptions(false);
                        setShowLeadsOptions(false);
                    }}>
                        <BsFillPeopleFill style={{marginTop: '0.1rem'}} color='#fff'/>
                        <div className='option' onClick={(event) => {
                            event.stopPropagation();
                        }}>
                            Employee
                            
                            {
                                showEmployeeOptions && <div style={Styles.employeeOptionsContainer}>
                                    <Link to='/employee-dashboard/add' className="employee-option" style={Styles.employeeOption}>Add</Link>
                                    <Link to='/employee-dashboard/update' className="employee-option" style={Styles.employeeOption}>Update</Link>
                                    <Link to='/employee-dashboard/delete' className="employee-option" style={Styles.employeeOption}>Remove</Link>
                                </div>
                            }
                        </div>
                            <IoIosArrowDown color='#fff' style={{position: 'absolute', right: '1.2rem', top: '1.2rem', transform: showEmployeeOptions ? 'rotate(180deg)' : ''}}  />
                    </Link> */}
                    
                    {/* <Link to='/show-coordinator' className='menu-option' style={{position: 'relative', alignItems: 'flex-start'}} onClick={() => {
                        toggleOptions(setShowCoordinatorOptions, showCoordinatorOptions);
                        setShowEmployeeOptions(false);
                        setShowLeadsOptions(false);
                    }}>
                        <FaAddressCard color='#fff' style={{marginTop: '0.1rem'}} />
                        <div className='option' onClick={(event) => {
                            event.stopPropagation();
                        }}>
                            Coordinator
                            
                            {
                                showCoordinatorOptions && <div style={Styles.employeeOptionsContainer}>
                                    <Link to='/show-coordinator/add' className="employee-option" style={Styles.employeeOption}>Add</Link>
                                    <Link to='/show-coordinator/update' className="employee-option" style={Styles.employeeOption}>Update</Link>
                                    <Link to='/show-coordinator/delete' className="employee-option" style={Styles.employeeOption}>Remove</Link>
                                </div>
                            }
                        </div>
                        <IoIosArrowDown color='#fff' style={{position: 'absolute', right: '1.2rem', top: '1.2rem', transform: showCoordinatorOptions ? 'rotate(180deg)' : ''}}  />
                        
                    </Link> */}

                    {/* <Link to='/show-leads' className='menu-option' style={{position: 'relative', alignItems: 'flex-start'}} onClick={() => {
                        toggleOptions(setShowLeadsOptions, showLeadsOptions);
                        setShowCoordinatorOptions(false);
                        setShowEmployeeOptions(false);
                    }}>
                        <FaAddressCard color='#fff' />
                        <div className='option' style={{ position: 'relative'}} onClick={(event) => {
                            event.stopPropagation();
                        }}>
                            Lead
                            
                            {
                                showLeadsOptions && <div style={Styles.employeeOptionsContainer}>
                                    <div className="employee-option" style={Styles.employeeOption} onClick={handleLeadUploadBtnClicked}>
                                        <input type="file" name="leadexcelsheet" id="leadexcelsheet" onChange={handleOnFileChange} useRef={fileInputRef} style={{ opacity: 0,  position: 'absolute' }} accept=".xlsx, .xls, .csv" />
                                        <div>Lead Bulk Upload</div>
                                    </div>
                                    <Link to='/show-leads/add' className="employee-option" style={Styles.employeeOption}>Add</Link>
                                    <Link to='/show-leads/update' className="employee-option" style={Styles.employeeOption}>Update</Link>
                                    <Link to='/show-leads/delete' className="employee-option" style={Styles.employeeOption}>Remove</Link>
                                </div>
                            }
                        </div>
                        <IoIosArrowDown color='#fff' style={{position: 'absolute', right: '1.2rem', top: '1.2rem', transform: showLeadsOptions ? 'rotate(180deg)' : ''}}  />
                        <span className='option'>Lead</span>
                    </Link> */}
                </section>
            </nav>
    )
}

export default Index;