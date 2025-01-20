import Review from '@/component/review'
import React from 'react'

const page = () => {
  return (
     <div className='ml-28' >
                <h1 className='text-4xl'>Reviews and Rating</h1>
                <hr className='mt-8 w-[70vw]'/>
                <div className='mt-10'><Review/></div>
                </div>
  )
}

export default page