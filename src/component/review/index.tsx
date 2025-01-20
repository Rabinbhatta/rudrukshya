"use client"
import { getReview } from '@/services/review';
import React, { useEffect, useState } from 'react'
import { FaStar } from "react-icons/fa";
import { Button } from '@/components/ui/button';

interface review{
    userID:{
        fullName:string
        _id:string
    },
    comment:string,
    commentTitle:string,
    createdAt:string,
    updatedAt:string,
    rating:number
}


const Review = () => {
     const [reviews,setReviews] = useState<Array<review>>([])
     

     const fetchData = async()=>{
        const data = await getReview()
        console.log(data)
        setReviews(data.reviews)
     }
     useEffect(()=>{
        fetchData()
     },[])
     
  return (
    <div>
        <div className='grid grid-cols-3 gap-4'>


            {reviews.map((review,index)=>{
                const current_date = new Date(review.createdAt)
                const formattedDate = current_date.toLocaleDateString('en-US',{day:"numeric",month:"short"})
                return <div key={index} className='w-80 h-fit rounded-md bg-[#F2F7FB] p-7 '>
                <div className='flex justify-between text-center items-center'>
                <div className='bg-red-600 rounded-full w-9 h-9 overflow-hidden mr-6 '>
                   <img src={`https://ui-avatars.com/api/?name=${review?.userID.fullName||"NA"}&background=E4C087&color=ffff`} alt="" /> 
           </div>
          
          <div className='flex '>
           
            {[...Array(review.rating)].map((star,index)=>{
                return <div key={index}>
                         <FaStar size={15} className='text-orange-200'/>
                </div>
            })}
            {[...Array(5-review.rating)].map((star,index)=>{
                return <div key={index}>
                         <FaStar size={15} className='text-gray-400'/>
                </div>
            })}
          
          </div>
             <div>
                {formattedDate}
             </div>

                </div>
                <div className='mt-4 font-thin'>
                    <h1 className="font-semibold">{review.userID.fullName}</h1>
                    <p className='mt-2'>{review.comment}</p>

                </div>         
          </div>
            })}
         
            
        </div>
        <div className="flex items-center justify-end space-x-2 py-4 mt-5">
        <Button
          variant="outline"
          size="sm"
          
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          
        >
          Next
        </Button>
      </div>
      
    </div>
  )
}

export default Review