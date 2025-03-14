import React from 'react'
import User from '@/component/User'
import { josefin } from '@/utils/font'

const user= () => {
  return (
      <div>
        <h1 className={`text-4xl ${josefin.className} text-primaryColor`}>User list</h1>
        <div><User/></div>
        </div>
    
  )
}

export default user