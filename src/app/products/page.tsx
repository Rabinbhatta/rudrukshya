import Products from '@/component/products'
import { josefin } from '@/utils/font'
import React from 'react'

const product = () => {
  return (
    <div>
            <h1 className={`text-4xl text-primaryColor ${josefin.className}`}>Products list</h1>
            <div><Products/></div>
            </div>
  )
}

export default product