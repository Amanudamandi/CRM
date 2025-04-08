import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { removeCookie, setCookie } from '../../component/cookieUtils';

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState({
    status: false,
    accessToken: '',
    role: -1,
    employeeId: null,
    designation: '',
  });

  const Navigate = useNavigate(); // To redirect after login


  const crmLoginAPI = async (loginCredentials) => {
    try {
      const sendRequest = await axios.post(`${process.env.REACT_APP_URL}/auth/login`, loginCredentials);
      const response = await sendRequest.data;
      // console.log("login .,.......",response);

      const designation = await response.data.designation;
      console.log("designation response : ", designation);

      const { success } = response;
      if (success) {
        const { msg, accessToken, refreshToken } = response;
        const role = response.data.department.role
        setIsAuthenticated((previousData) => ({ ...previousData, status: true, accessToken, role, employeeId: response.data._id, designation }))
        console.log('Data:', response);
        localStorage.setItem('designation', designation);
        // removeCookie('accessToken')
        // updateAccessToken(accessToken);
        setCookie('accessToken', accessToken, { expires: 7, secure: false, sameSite: 'Strict' });
        // setLoginResponse({role: response.data.department.role, success});
        // console.log(msg, accessToken, refreshToken);
        localStorage.setItem('role', role);
        if (role !== 1) {
          localStorage.setItem('employeeId', response.data._id);
        }
        if (role === 1)
          Navigate('admin/dashboard');
        else if (role === 2) {
          Navigate('coordinator/dashboard');
          setIsAuthenticated((previousData) => ({ ...previousData, employeeId: localStorage.getItem('employeeId') }));
        }
        else if (role === 3) {
          Navigate('employee/dashboard');
          setIsAuthenticated((previousData) => ({ ...previousData, employeeId: localStorage.getItem('employeeId') }));
        }
        else if (role === 5) {
          Navigate('dealerTL/dashboard');
          setIsAuthenticated((previousData) => ({ ...previousData, employeeId: localStorage.getItem('employeeId') }));
        }
        else if (role === 6) {
          Navigate('employeeDL/dashboard');
          setIsAuthenticated((previousData) => ({ ...previousData, employeeId: localStorage.getItem('employeeId') }));
        } else if (role === 8) {
          Navigate('superAdmin/Installer');
          setIsAuthenticated((prev) => ({ ...prev, employeeId: localStorage.getItem('employeeId') }));
        }
        // ✅ Return user data
        return {
          accessToken,
          role,
          designation,
          employeeId: response.data._id,
        };
      }
    } catch (error) {
      const status = error.response.status;
      if (status !== 200) {
        alert(error.response.data.msg);
      }
      else if (status === 400) {
        alert(error.response.data.errors[0].msg);
      }
      else {
        alert("Error Status is ", error.response.status);
        console.error('Error fetching data:', error.response.data, error.response.status);
      }
    }
  }

  // Logout function
  const logout = () => {
    removeCookie('accessToken');
    if (localStorage.getItem('employeeId')) {
      localStorage.removeItem('employeeId');
    }
    localStorage.removeItem('role');
    localStorage.removeItem('designation');
    setIsAuthenticated({
      status: false,
      accessToken: '',
      role: -1,
      employeeId: null,
    });
    Navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, crmLoginAPI, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
