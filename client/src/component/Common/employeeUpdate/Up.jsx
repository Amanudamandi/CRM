import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from "axios"
import Update from "../employeeUpdate/Update"


const Up = ({params}) => {
const {id}= useParams();
console.log(id);

const[data2,setdata]=useState("");

const[loading,setloading]=useState();
console.log("data2",data2)



async function fetch(){
  setloading(true);
    try{
      const response=await axios.get(`http://localhost:8080/emp/Employee/?id=${id}`);
      // console.log("abcd",response.data.data);
      setdata(response.data.data);
    }catch(error){
        console.log(error);
    }finally{
      setloading(false)
    }
}
useEffect(()=>{
fetch();

},[]);


  return (
   
    <>
   
      {loading?(<div>Fetching Details</div>):(<Update data2={data2} setdata={setdata}></Update>)}
      {/* HELLO WELCOME TO THE PAGE */}
    </>
   
  )
}
export default Up;