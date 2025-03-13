import Consultation from '@/component/consultation'
import { josefin } from '@/utils/font'
import React from 'react'

const page = () => {
  return (
    <div>
                <h1 className={`text-4xl ${josefin.className} text-primaryColor`}>Consultation</h1>
                <hr className='mt-4 w-[70vw]'/>
                <div className='mt-10'><Consultation/></div>
                </div>
  )
}

export default page