"use client";
import React from 'react'
import { MdOutlineEmail } from "react-icons/md";
import { CiPhone } from "react-icons/ci";
import { FaRegMessage } from "react-icons/fa6";
import { useState,useEffect } from 'react';
import { getConsultation } from '@/services/consultation';

interface Consultation{
    fullName:string
    email:string
    phone:string
    message:string
    date:string
}

const Consultation = () => {
  const [consultations,setConsultations] = useState<Array<Consultation>>([])
  const fetchData = async()=>{
          const data = await getConsultation(1,10)
          console.log(data)
          setConsultations(data.consultation)
       }
       useEffect(()=>{
          fetchData()
       },[])
       

  return (
    <div>
         <div className="grid grid-cols-3 gap-x-4 gap-y-9">
      {consultations.map((consultation,index)=>{
        
        
        return <div key={index} className='w-80 h-fit rounded-md bg-[#F2F7FB] p-6 flex flex-col gap-4'>
        <h1 className="font-bold">Request #{index}</h1>
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold  ">{consultation.fullName}</h1>
        <p className='flex items-center gap-2'><MdOutlineEmail />{consultation.email}</p>
        <p className='flex items-center gap-2'><CiPhone />{consultation.phone}</p>
      </div>
      <ul className='border'/>
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold flex items-center gap-2"><FaRegMessage size={13}/>Message</h1>
        <p>{consultation.message}</p>
      </div>
      <ul className='border'/>
      <div>
        <p>{consultation.date}</p>
      </div>
        



      </div>
      },)}
      
    </div>
    </div>
   
  )
}

export default Consultation