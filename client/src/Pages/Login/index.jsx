import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import panel_Image from '../../Assest/Images/panel_Image.png';
// import white_logo from '../../Assest/Images/logo_udamandi_rotated.png';
// import logo_color_changed from '../../Assest/Images/logo_udamandi_original_2.png';
import galo_solar from '../../Assest/Images/galo_solar_img.png';
import galo_solar_logo from '../../Assest/Images/galo_solar_logo.png';
import DropDown2 from '../../component/DropDown2/index';
import { FcGoogle } from "react-icons/fc";
import { AiFillMessage } from "react-icons/ai";
import { FiEye } from "react-icons/fi";
import { GoEyeClosed } from "react-icons/go";
import { useAuth } from '../../Context/Authentication/AuthContext';
import axios from 'axios';
import { getCookie } from '../../component/cookieUtils';
import './index.css';


const Index = () => {
    const Navigate = useNavigate(); // To redirect after login
    const { crmLoginAPI, isAuthenticated } = useAuth();
    const designation = localStorage.getItem('designation');

    // console.log("designation : ",designation);

    useEffect(() => {
        const store = window.location;
        console.log("store ", store);
        if (store.pathname === '/login' && getCookie('accessToken') !== undefined) {
            if (localStorage.getItem('role') === '1') {
                Navigate('/admin/dashboard');
            }
            else if (localStorage.getItem('role') === '2') {
                Navigate('/coordinator/dashboard');
            }
            else if (localStorage.getItem('role') === '3') {
                Navigate('/employee/dashboard');
            }
            else if (localStorage.getItem('role') === '5') {
                Navigate('/dealerTL/dashboard');
            }
            else if (localStorage.getItem('role') === '6') {
                Navigate('/employeeDL/dashboard');
            }
            else if (localStorage.getItem('role') === '8') {

                if (designation === 'paymentManager') {
                    Navigate('superAdmin/Installer');
                } else if (designation === 'MaterialDispatchManager') {
                    Navigate('/superAdmin/MaterialDispatch/ListCompletePayment');
                } else {
                    Navigate('/superAdmin/NetmeteringManager');
                }
                
            }
        }
    }, []);

    const styles = {
        rememForContainer: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0rem', fontSize: '0.9rem' }
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    // showDepartment API
    const [departmentRole, setDepartmentRole] = useState('1');
    const [departmentList, setDepartmentList] = useState(null);
    const [selectedDepart, setSelectedDepart] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const setDefaultDepartment = (departmentName, departmentRole) => {
        setSelectedDepart(departmentName);
        setDepartmentRole(departmentRole);
    }

    const toggleDepartment = (departmentName, departmentRole) => {
        setSelectedDepart(departmentName);
        setDepartmentRole(departmentRole);
        setIsOpen(!isOpen);
    }

    const toggleDepartmentOption = () => {
        setIsOpen(!isOpen);
    }

    const getShowDepartment = async (isMounted) => {
        try {
            const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/field/showDepartment`);
            if (isMounted) {
                const response = await sendRequest.data.departments;
                console.log(response);
                setDepartmentList(response);
                setDefaultDepartment(response[0].department, response[0].role);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        let isMounted = true
        getShowDepartment(isMounted);
        return () => {
            isMounted = false;
        }
    }, []);

    // const handleLoginSubmit = (event) => {
    //     event.preventDefault();
    //     const loginCredentials = { email: username, password, department: departmentRole };
    //     console.log("login details : ",loginCredentials);
    //     crmLoginAPI(loginCredentials);
    // }

    // const handleLoginSubmit = async (event) => {
    //     event.preventDefault();
    //     console.log(selectedDepart, username, password);
    //     try {
    //         const sendRequest = await axios.post(`http://localhost:8080/auth/login`,
    //             {
    //                 department: departmentRole,
    //                 email: username,
    //                 password: password
    //             });

    //         const response = sendRequest.data;
    //         const { success, msg, accessToken, refreshToken } = response;
    //         console.log(success, msg, accessToken, refreshToken);
    //         console.log('Data:', response);
    //         updateAccessToken(accessToken);
    //         setCookie('accessToken', accessToken, { expires: 7, secure: true, sameSite: 'Strict' });
    //         // window.location.href = 'http://localhost:3000/employee-dashboard';
    //     } catch (error) {
    //         const status = error.response.status;
    //         if (status !== 200) {
    //             alert(error.response.data.msg);
    //         }
    //         else if(status === 400){
    //             alert(error.response.data.errors[0].msg);
    //         }
    //         else{
    //             alert("Error Status is ", error.response.status);
    //             console.error('Error fetching data:', error.response.data, error.response.status);
    //         }
    //     }
    // } 
    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        const loginCredentials = { email: username, password, department: departmentRole };

        const user = await crmLoginAPI(loginCredentials); // make sure it returns user info
        console.log("User info: ", user);
        

        // Assuming `user.designation` exists
        localStorage.setItem('designation', user.designation);
        // localStorage.setItem('designation', user.data.designation);
    };
    return (
        <div className="login-container">
            <div className="left">
                {/* <img src={panel_Image} alt="panel_Image" className='solar_panel_image' /> */}
                <img src={galo_solar} alt="galo_solar_Image" width='500px' />
                {/* <div className="white_logo_container">
                    <img src={white_logo} alt="logo" className='white_logo_image' />
                </div> */}
            </div>
            <div className="right">
                <div className="form-container">
                    <div className="crm-info">
                        <div className="logo-container">
                            {/* <img src={logo_color_changed} alt="logo" width='180px' height='95px' /> */}
                            <img src={galo_solar_logo} alt="logo" width='80px' height='80px' />
                        </div>
                        <div className='crm'>
                            <span style={{ fontSize: '2.5rem', fontFamily: 'Cambo' }}>CRM</span>
                        </div>
                        <div className="one-liner">
                            <span style={{ color: '#ffd525', fontSize: '1.5rem' }}>Login</span> in. To see it in action.
                        </div>
                    </div>
                    <form action="#" onSubmit={handleLoginSubmit} >
                        <div>
                            <span>Department</span>
                            <DropDown2
                                objectList={departmentList}
                                selectedValue={selectedDepart}
                                setSelectedValue={toggleDepartment}
                                isOpen={isOpen}
                                setIsOpen={toggleDepartmentOption}
                                key1='department'
                                key2='role'
                            />
                        </div>
                        <div>
                            <label htmlFor="username">Username</label><br />
                            <input type="text" name="username" id="username" placeholder="Employee_Id / Email" onChange={(e) => {
                                setUsername(e.target.value);
                            }} autoComplete='off' required />
                        </div>
                        <div>
                            <label htmlFor="pass">Password</label> <br />
                            <div style={{ position: 'relative', width: '100%', border: '1px solid rgb(180, 180, 180)', borderRadius: '5px', alignItems: 'center', marginTop: '0px' }}>
                                <input style={{ border: 'none' }} type={showPassword ? 'text' : 'password'} name="pass" id="pass" placeholder="Password" onChange={(event) => {
                                    setPassword(event.target.value);
                                }} autoComplete='off' required />
                                <span style={{ position: 'absolute', right: '10px', cursor: 'pointer', padding: '0.3rem 0rem' }} onClick={toggleShowPassword}>
                                    {
                                        showPassword ? <GoEyeClosed /> : <FiEye />
                                    }
                                </span>
                            </div>
                        </div>
                        <button className="login-btn" type="submit">Login</button>
                        <div style={styles.rememForContainer} className='forget-container'>
                            <span style={{ display: 'flex', alignItems: 'center', fontSize: 'inherit' }}>
                                <input type="checkbox" name="remember" id="remember" style={{ width: 'min-content' }} />
                                &nbsp; <label htmlFor="remember"> Remember me</label>
                            </span>
                            <a href="#" className="forget-pass">Forget password ?</a>
                        </div>
                    </form>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0rem 2rem' }}>
                        <hr className='line' style={{ flex: 1, borderTop: '1px solid black' }} />
                        <div className="content" style={{ padding: '0px 10px' }}>
                            Or Login With
                        </div>
                        <hr className='line' style={{ flex: 1, borderTop: '1px solid black' }} />
                    </div>
                    <div className="others-container">
                        <a href="#"><FcGoogle className='g-container altOp-container' size={25} /></a>
                        <a href="#"><AiFillMessage className='opt-container altOp-container' size={25} color='#ffd525' /></a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index;