import React, { useEffect, useState } from 'react'
import DynamicDropDown from '../../../component/DropDown2/index'

import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const EmpRegister = ({ CoordinatorStartIndexDropDown,CoordinatorEndIndexDropDown}) => {
    const Styles = {
        topText: { borderRadius: '5px', height: '2rem', border: '2px solid #BBB8B8' }
    }

    const [data, setData] = useState({
        InsID: '',
        name: '',
        email: '',
        mobile: ''
    })

    const [departmentList, setDepartmentList] = useState(null);
    const [departmentId, setDepartmentId] = useState(null);
    const [isOpen, setIsOpen] = useState(null);
    const [selectedDepart, setSelectedDepart] = useState("Select Employee Department");

    const navigate = useNavigate();

    const toggleDepartment = (department, id) => {
        setSelectedDepart(department);
        setDepartmentId(id);
        setIsOpen(!isOpen);
    }

    const setToggleDeparementOption = () => {
        setIsOpen(!isOpen);
    }

    const departmentSelected = async () => {
        try {
            const sendRequest = await axios.get(`${process.env.REACT_APP_URL}/field/showDepartment`);
            // console.log("sendRequest department : ", sendRequest?.data?.departments);
            const response = await sendRequest.data;
            setDepartmentList(response.departments)

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        departmentSelected();
    }, [])

    const handleOnChange = (event) => {
        const { name, value } = event.target;

        setData((prev) => ({
            ...prev, [name]: value
        }))
    }

    console.log("data : ", data);

    const handleOnSubmit = async (event) => {
        event.preventDefault();

        const { InsID, name, email, mobile } = data;

        if (!InsID) {
            alert("Enter Employee ID");
            return;
        }
        if (!name) {
            alert("Enter Employee Name ");
            return;
        }
        if (!email) {
            alert("Enter Employee Email")
            return;
        }
        if (!mobile) {
            if (mobile.length !== 10 || mobile.length > 10) {
                alert('Enter the valid mobile number');
                return;
            }
            else alert('Enter the mobile number');
            return;
        }

        if (!departmentId) {
            alert("Select Employee Department ")
        }


        try {
            const response = await axios.post(`${process.env.REACT_APP_URL}/ins/addInstaller`, { ...data, department: departmentId });
            const respData = await response?.data;
            console.log("response is : ", respData);
            const success = response.success;
            if (success) {
                alert("Employee successfully created...");

            }

        } catch (error) {
            console.log("error : ", error);
            alert("Employee is not created successfully...,Check console to showing error...");
        }
        navigate("/superAdmin/Installer");
    }


    return (
        <>
            <style>
                {`
      ::-webkit-scrollbar {
          width: 6px;
          height: 6px
      }
      
      ::-webkit-scrollbar-track {
          background: #f1f1f1;
      }
      
      ::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 8px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
          background-color: #AA0B2B;
      }
      `}
            </style>

            <form method='post' onSubmit={handleOnSubmit} style={{ overflow: 'hidden', height: '100vh', background: "white" }} >
                <div className='outer'>
                    <div className='top'>
                        <h1 align="center">Add Employee</h1>
                        <label htmlFor="empID">Employee Id :</label>
                        <input type="text" id='empID' name='InsID' style={Styles.topText} onChange={handleOnChange} />
                    </div>
                </div>
                <div className='bottom'>
                    <div className='bottomLeft'>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input type="text" id='empName' name='name' onChange={handleOnChange} />
                        </div>
                        <div>
                            <label htmlFor="empEmail">Email</label>
                            <input type="mail" id='empEmail' name='email' onChange={handleOnChange} />
                        </div>
                        <div>
                            <label htmlFor="mobile">Mobile</label>
                            <input type="number" id='mobile' name='mobile' onChange={handleOnChange} />
                        </div>
                        <div>
                            <label htmlFor="deparment">Employee Department :</label>
                            <DynamicDropDown
                                objectList={departmentList}
                                selectedValue={selectedDepart}
                                setSelectedValue={toggleDepartment}
                                isOpen={isOpen}
                                setIsOpen={setToggleDeparementOption}
                                startIndex={CoordinatorStartIndexDropDown}
                                // endIndex={CoordinatorEndIndexDropDown}
                                key1='department'
                                key2='_id'
                            />
                        </div>
                        <div>
                            <button type="submit" className='submitBtn' style={{ marginTop: '1rem' }}>Submit</button>
                        </div>
                    </div>
                </div>
            </form >
        </>

    )
}

export default EmpRegister
