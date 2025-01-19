"use client"
import { singleProduct } from '@/services/product';
import React, { useState, useEffect } from 'react';
import * as z from "zod"
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/dropdown";


const schema = z.object({
    title: z.string().min(1),
    category:z.string(),
    country:z.string(),
    description:z.string(),
    faces:z.string(),
    isSale:z.string(),
    isSpecial:z.string(),
    isTopSelling:z.string(),
    price:z.string(),
    size:z.string(),
    stock:z.string(),
    weight:z.string()

})

type formFields = z.infer<typeof schema>

interface Product{
    title:string,
    category:string,
    country:string,
    description:string,
    faces:string,
    isSale:string,
    isSpecial:string,
    isTopSelling:string,
    price:string,
    size:string,
    stock:string,
    weight:string
}

interface props{
    id:string
}
const Product: React.FC<props> = ({id}) => {
     const [product,setProduct] = useState<Product | null>(null)
     const[page,setpage]= useState(true)
     const {
        register,
        handleSubmit,
        formState:{ errors },
        reset
     }=useForm<formFields>({
        resolver:zodResolver(schema)
     })
     const fetchData = async(id:string)=>{
        try {
            const data = await singleProduct(id)
            setProduct(data.product)
            reset(data.product)
            setSelectedKeys(data.product.country)
        } catch (error) {
            console.log(error)
        }
     }

     const onSubmit:SubmitHandler<formFields> = (data)=>{
        console.log(data)
     }

    useEffect(()=>{
       if(id==="new"){
        setpage(false)
       }else{
        fetchData(id)
       }
       
    },[])
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));

    const selectedValue = React.useMemo(
      () => Array.from(selectedKeys),
      [selectedKeys],
    );  
    return (
        <div className='ml-28' >
            <h1 className='text-4xl'>{page?"Edit Product":"Add new Product"}</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                  <Input {...register("title")}/>
                  <Input {...register("category")}/>
                  <Input {...register("description")}/>
                  <Input {...register("faces")}/>
                  <Input {...register("price")}/>
                  <Input {...register("stock")}/>
                  <Input {...register("weight")}/>
                 
                  <Dropdown>
      <DropdownTrigger>
        <Button className="capitalize" {...register("country")}>
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Single selection example"
        selectedKeys={selectedKeys}
        selectionMode="single"
        variant="flat"
        onSelectionChange={(keys) => {
          // Convert keys to Set<string>
          const stringKeys = new Set(Array.from(keys).map(key => String(key)));
          setSelectedKeys(stringKeys);
      }}
      >
        <DropdownItem key="Nepal">Nepal</DropdownItem>
        <DropdownItem key="Indonesia">Indonesia</DropdownItem>
      </DropdownMenu>
    </Dropdown>
                 
                  
                  <Input {...register("country")}/>
                  
                  
                  <Input {...register("isSale")}/>
                  <Input {...register("isSpecial")}/>
                  <Input {...register("isTopSelling")}/>
                  
                  <Input {...register("size")}/>
                  
                  <Button type='submit'>Submit</Button>
            </form>
        </div>
    );
};

export default Product;
