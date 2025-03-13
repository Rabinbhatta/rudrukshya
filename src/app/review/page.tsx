import Review from '@/component/review'
import { josefin } from '@/utils/font'
import React from 'react'

const page = () => {
  return (
     <div>
                <h1 className={`${josefin.className} text-primaryColor text-4xl`}>Reviews and Rating</h1>
                <hr className='mt-4 w-[70vw]'/>
                <div className='mt-10'><Review/></div>
                </div>
  )
}

export default page