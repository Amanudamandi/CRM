import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import { LuDot } from "react-icons/lu";
import { FaChartPie } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { BsPersonFillGear } from "react-icons/bs";
import { BsFileBarGraphFill } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import { GiPathDistance } from "react-icons/gi";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { handleOnFileChange } from '../../../Utils/excelUpload';
import Loader from '../Loader/index';
import { getCookie } from '../../cookieUtils';
import './index.css';


const Index = ({ department, nameLogo }) => {

    const Navigate = useNavigate();
    const Styles = {
        sideNavHeader: { position: 'fixed', left: '0', top: '0' },
        employeeOptionsContainer: { display: 'flex', flexDirection: 'column', padding: ' 1rem' },
        employeeOption: { width: '100%', padding: '0.4rem 0.2rem', textDecoration: 'none', color: '#fff' },
        loaderMainContainer: {
            width: '79%',
            height: '91vh',
        },
        loaderContainer: {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-40%, -50%)',
            zIndex: 999,
        }
    }

    const [showEmployeeOptions, setShowEmployeeOptions] = useState(false);
    const [showCoordinatorOptions, setShowCoordinatorOptions] = useState(false);
    const [showLeadsOptions, setShowLeadsOptions] = useState(false);
    const [isExcelLoading, setIsExcelLoading] = useState(false);
    // const [ selectedLeadFile, setSelectedLeadFile ] = useState(null);
    const fileInputRef = useRef(null);

    const [showEmployeeDLOptions,setShowEmployeeDLOptions]=useState(false)
    const [showCoordinatorDLOptions, setShowCoordinatorDLOptions] = useState(false);
    const [showLeadsDLOptions, setShowLeadsDLOptions] = useState(false);


    const showOptions = (setShowOption) => {
        setShowOption(true);
    }


    const closeOptions = (setShowOptions) => {
        setShowOptions(false);
    }

    const handleOnExcelUpload = (e) => {
        const event = e;
        console.log(event);
        handleOnFileChange(event, setIsExcelLoading);
    }

    // const handleOnFileChange = (event) => {
    //     const file = event.target.files[0];
    //     console.log("Selected File", file);
    // }

    const handleLeadUploadBtnClicked = (event) => {
        event.stopPropagation();
        if (fileInputRef.current) {
            fileInputRef.current.click();
            console.log("Btn Clicked");
        }
    }

    return (
        <nav className='sideNav-container' >
            <section className='menu-container' onClick={(event) => {
                if (!getCookie('accessToken')) {
                    Navigate('/Login');
                    event.stopPropagation();
                }
            }}>
                <div className='description'>
                    <div className='name-logo-container'>
                        <span className="name-logo" style={{ fontWeight: '900', color: '#AA0B2B' }}>{nameLogo}</span>
                    </div>
                    <div className="department-name">
                        <span style={{ fontSize: '2rem' }}>{department}</span>
                        <span style={{ fontSize: '0.825rem' }}>Department</span>
                    </div>
                </div>
                <Link to='/admin/dashboard' className='menu-option'>
                    <FaChartPie color='#fff' />
                    <span className='option'>Dashboard</span>
                </Link>



                <Link to='/admin/employee-dashboard' className='menu-option' style={{ position: 'relative', alignItems: 'flex-start' }} onClick={() => {
                    !showEmployeeOptions && showOptions(setShowEmployeeOptions);
                    setShowCoordinatorOptions(false);
                    setShowLeadsOptions(false);
                }}>
                    <BsFillPeopleFill style={{ marginTop: '0.1rem' }} color='#fff' />
                    <div className='option'>
                        Employee

                        {
                            showEmployeeOptions && <div style={Styles.employeeOptionsContainer}>
                                <Link to='admin/employee-dashboard/add' className="employee-option" style={Styles.employeeOption}>Add</Link>
                                <Link to='admin/employee-dashboard/update' className="employee-option" style={Styles.employeeOption}>Update</Link>
                                <Link to='admin/employee-dashboard/delete' className="employee-option" style={Styles.employeeOption}>Remove</Link>
                            </div>
                        }
                    </div>
                    <IoIosArrowDown color='#fff' onClick={() => closeOptions(setShowEmployeeOptions)} style={{ position: 'absolute', right: '1.2rem', top: '1.2rem', transform: showEmployeeOptions ? 'rotate(180deg)' : '' }} />
                </Link>


                


                <Link to='/admin/show-coordinator' className='menu-option' style={{ position: 'relative', alignItems: 'flex-start' }} onClick={() => {
                    !showCoordinatorOptions && showOptions(setShowCoordinatorOptions);
                    setShowEmployeeOptions(false);
                    setShowLeadsOptions(false);
                }}>
                    <BsPersonFillGear color='#fff' style={{ marginTop: '0.1rem' }} />
                    <div className='option'>
                        Coordinator
                        {
                            showCoordinatorOptions && <div style={Styles.employeeOptionsContainer}>
                                <Link to='/admin/show-coordinator/add' className="employee-option" style={Styles.employeeOption}>Add</Link>
                                <Link to='/admin/show-coordinator/update' className="employee-option" style={Styles.employeeOption}>Update</Link>
                                <Link to='/admin/show-coordinator/delete' className="employee-option" style={Styles.employeeOption}>Remove</Link>
                            </div>
                        }
                    </div>
                    <IoIosArrowDown color='#fff' onClick={() => closeOptions(setShowCoordinatorOptions)} style={{ position: 'absolute', right: '1.2rem', top: '1.2rem', transform: showCoordinatorOptions ? 'rotate(180deg)' : '' }} />
                    {/* <span className='option'>Coordinator</span> */}
                </Link>

                <Link to='/admin/show-leads' className='menu-option' style={{ position: 'relative', alignItems: 'flex-start' }} onClick={() => {
                    !showLeadsOptions && showOptions(setShowLeadsOptions);
                    setShowCoordinatorOptions(false);
                    setShowEmployeeOptions(false);
                }}>
                    <FaAddressCard color='#fff' style={{ marginTop: '0.1rem' }} />
                    <div className='option' style={{ position: 'relative' }}>
                        Lead
                        {
                            showLeadsOptions && <div style={Styles.employeeOptionsContainer}>
                                <div className="employee-option" style={{ ...Styles.employeeOption }} onClick={handleLeadUploadBtnClicked}>
                                    <input type="file" name="leadexcelsheet" id="leadexcelsheet"
                                        onChange={handleOnExcelUpload}
                                        ref={fileInputRef}
                                        style={{ opacity: 0, position: 'absolute', appearance: 'auto' }}
                                        accept=".xlsx, .xls, .csv"
                                    />
                                    <div onClick={(event) => event.stopPropagation()}>Lead Bulk Upload</div>
                                </div>
                                <Link to='/admin/show-leads/add' className="employee-option" style={Styles.employeeOption}>Add</Link>
                                <Link to='/admin/show-leads/update' className="employee-option" style={Styles.employeeOption}>Update</Link>
                                <Link to='/admin/show-leads/delete' className="employee-option" style={Styles.employeeOption}>Remove</Link>
                            </div>
                        }
                        {
                            isExcelLoading &&
                            <div style={{ ...Styles.loaderContainer, ...Styles.loaderMainContainer }}>
                                <div style={Styles.loaderContainer}>
                                    <Loader />
                                </div>
                            </div>
                        }
                    </div>
                    <IoIosArrowDown color='#fff' onClick={() => closeOptions(setShowLeadsOptions)} style={{ position: 'absolute', right: '1.2rem', top: '1.2rem', transform: showLeadsOptions ? 'rotate(180deg)' : '' }} />
                    {/* <span className='option'>Lead</span> */}
                </Link>


                {/* Dealer  */}


                <Link to='/admin/employeeDL-dashboard' className='menu-option' style={{ position: 'relative', alignItems: 'flex-start' }}
                    onClick={() => {
                        !showEmployeeDLOptions && showOptions(setShowEmployeeDLOptions);
                        setShowCoordinatorDLOptions(false);
                        setShowLeadsDLOptions(false);
                    }}
                >
                    <BsFillPeopleFill style={{ marginTop: '0.1rem' }} color='#fff' />
                    <div className='option'>
                        Employee DL

                        {
                            showEmployeeDLOptions && <div style={Styles.employeeOptionsContainer}>
                                <Link to='admin/employeeDL-dashboard/add' className="employee-option" style={Styles.employeeOption}>Add</Link>
                                <Link to='admin/employeeDL-dashboard/update' className="employee-option" style={Styles.employeeOption}>Update</Link>
                                <Link to='admin/employeeDL-dashboard/delete' className="employee-option" style={Styles.employeeOption}>Remove</Link>
                            </div>
                        }
                    </div>
                    <IoIosArrowDown color='#fff' onClick={() => closeOptions(setShowEmployeeDLOptions)} style={{ position: 'absolute', right: '1.2rem', top: '1.2rem', transform: showEmployeeDLOptions ? 'rotate(180deg)' : '' }} />
                </Link> 



                <Link to='/admin/showDL-coordinator' className='menu-option' style={{ position: 'relative', alignItems: 'flex-start' }} onClick={() => {
                    !showCoordinatorDLOptions && showOptions(setShowCoordinatorDLOptions);
                    setShowEmployeeDLOptions(false);
                    setShowLeadsDLOptions(false);
                }}>
                    <BsPersonFillGear color='#fff' style={{ marginTop: '0.1rem' }} />
                    <div className='option'>
                        Coordinator DL
                        {
                            showCoordinatorDLOptions && <div style={Styles.employeeOptionsContainer}>
                                <Link to='/admin/showDL-coordinator/add' className="employee-option" style={Styles.employeeOption}>Add</Link>
                                <Link to='/admin/showDL-coordinator/update' className="employee-option" style={Styles.employeeOption}>Update</Link>
                                <Link to='/admin/showDL-coordinator/delete' className="employee-option" style={Styles.employeeOption}>Remove</Link>
                            </div>
                        }
                    </div>
                    <IoIosArrowDown color='#fff' onClick={() => closeOptions(setShowCoordinatorDLOptions)} style={{ position: 'absolute', right: '1.2rem', top: '1.2rem', transform: showCoordinatorDLOptions ? 'rotate(180deg)' : '' }} />
                    {/* <span className='option'>Coordinator</span> */}
                </Link>



                <Link to='/admin/showDL-leads' className='menu-option' style={{ position: 'relative', alignItems: 'flex-start' }} onClick={() => {
                    !showLeadsDLOptions && showOptions(setShowLeadsDLOptions);
                    setShowCoordinatorDLOptions(false);
                    setShowEmployeeDLOptions(false);
                }}>
                    <FaAddressCard color='#fff' style={{ marginTop: '0.1rem' }} />
                    <div className='option' style={{ position: 'relative' }}>
                        Lead DL
                        {
                            showLeadsDLOptions && <div style={Styles.employeeOptionsContainer}>
                                <div className="employee-option" style={{ ...Styles.employeeOption }} onClick={handleLeadUploadBtnClicked}>
                                    <input type="file" name="leadexcelsheet" id="leadexcelsheet"
                                        onChange={handleOnExcelUpload}
                                        ref={fileInputRef}
                                        style={{ opacity: 0, position: 'absolute', appearance: 'auto' }}
                                        accept=".xlsx, .xls, .csv"
                                    />
                                    <div onClick={(event) => event.stopPropagation()}>Lead Bulk Upload</div>
                                </div>
                                <Link to='/admin/showDL-leads/add' className="employee-option" style={Styles.employeeOption}>Add</Link>
                                <Link to='/admin/showDL-leads/update' className="employee-option" style={Styles.employeeOption}>Update</Link>
                                <Link to='/admin/showDL-leads/delete' className="employee-option" style={Styles.employeeOption}>Remove</Link>
                            </div>
                        }
                        {
                            isExcelLoading &&
                            <div style={{ ...Styles.loaderContainer, ...Styles.loaderMainContainer }}>
                                <div style={Styles.loaderContainer}>
                                    <Loader />
                                </div>
                            </div>
                        }
                    </div>
                    <IoIosArrowDown color='#fff' onClick={() => closeOptions(setShowLeadsDLOptions)} style={{ position: 'absolute', right: '1.2rem', top: '1.2rem', transform: showLeadsDLOptions ? 'rotate(180deg)' : '' }} />
                    {/* <span className='option'>Lead</span> */}
                </Link>


                <Link to='admin/download-report' className='menu-option'>
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

export default Index;