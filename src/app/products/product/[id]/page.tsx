import Product from '@/component/products/product'
import * as React from 'react'


const page = ({ params }:{params:{id:string}}) => {
  return (
    <div>
    <Product id={params.id}/>
  </div>
  )
}

export default page
