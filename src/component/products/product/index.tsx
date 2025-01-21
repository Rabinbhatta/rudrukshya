"use client"
import { singleProduct } from '@/services/product';
import React, { useState, useEffect } from 'react';
import * as z from "zod"
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@heroui/input';
import {Textarea} from "@heroui/input";
import { Button } from '@heroui/button';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/dropdown";
import Image from "next/image";
import { SiTicktick } from "react-icons/si";


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
    weight:string,
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
        setValue
     }=useForm<formFields>({defaultValues:{
      title:""
     },
        resolver:zodResolver(schema)
     })
     const fetchData = async(id:string)=>{
        try {
            const data = await singleProduct(id)
            setProduct(data.product)
            setSelectedCountry(data.product.country)
            setSelectedSize(data.product.size)
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
    const [selectedSize, setSelectedSize] = React.useState(new Set(["Select"]));

    const selectedSizeValue = React.useMemo(
      () => Array.from(selectedSize),
      [selectedSize],
    );
    
    const [selectedCountry, setSelectedCountry] = React.useState(new Set(["Select"]));

    const selectedCountryValue = React.useMemo(
      () => Array.from(selectedCountry),
      [selectedCountry],
    );
    const [selectedSale, setSelectedSale] = React.useState(new Set(["Select"]));

    const selectedSaleValue = React.useMemo(
      () => Array.from(selectedSale),
      [selectedSale],
    );
    const [selectedSpecial, setSelectedSpecial] = React.useState(new Set(["Select"]));

    const selectedSpecialValue = React.useMemo(
      () => Array.from(selectedSpecial),
      [selectedSpecial],
    );
    const [selectedTopSelling, setSelectedTopSelling] = React.useState(new Set(["Select"]));

    const selectedTopSellingValue = React.useMemo(
      () => Array.from(selectedTopSelling),
      [selectedTopSelling],
    );
    return (
        <div className='ml-12 w-full' >
            <h1 className='text-4xl'>{page?"Edit Product":"Add new Product"}</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='mt-2 flex flex-col gap-6'>
              <div className='flex justify-end -mt-10 mr-14'>
                <Button className='bg-black text-white' type='submit'>{page?"Edit Product":<p className='flex gap-1 items-center'><SiTicktick />Add new Product</p>}</Button>
              </div>
              <div className='flex gap-6'>
              <div className='flex flex-col gap-6'>
              <div className='w-[44rem] h-[30rem] bg-[#F8F9F8] rounded-2xl p-4 flex flex-col gap-3'>
                <h1 className='text-2xl font-thin'>General Information</h1>
                <div className='gap-2 flex flex-col'>
                <h1>Product Name</h1>
                <Input
              key="outside"
              placeholder='Enter your product name'
              labelPlacement="outside"
              size='lg'
              variant='bordered'
              className='bg-[#EEEFEE] rounded-xl'
              {...register("title")}
            />
                </div>
                
            <div className='gap-2 flex flex-col'>
            <h1>Description</h1>
             <Textarea
          key="bordered"
          className="col-span-12 md:col-span-6 mb-6 md:mb-0 bg-[#EEEFEE] rounded-xl"
      
          labelPlacement="outside"
          placeholder="Enter your description"
          variant="bordered"
          color="default"
          size="lg"
          {...register("description")}
        />
            </div>
            <div className='flex justify-between'>
              <div className='gap-2 flex flex-col'>
              <div className='gap-2 flex flex-col'>
                <h1>Faces</h1>
                <Input
              key="outside"
              placeholder='Enter  product face'
              labelPlacement="outside"
              size='lg'
              variant='bordered'
              className='bg-[#EEEFEE] rounded-xl w-[25rem]'
              {...register("faces")}
            />
                </div>
                <div className='gap-2 flex flex-col'>
                <h1>Weight</h1>
                <Input
              key="outside"
              placeholder='Enter  product weight'
              labelPlacement="outside"
              size='lg'
              variant='bordered'
              className='bg-[#EEEFEE] rounded-xl w-[25rem]'
              {...register("weight")}
            />
                </div>
              </div>
              
                
      
            
              <div className='gap-7 flex items-center'>
              <div className='gap-3 flex flex-col' >
              <div className='text-center'>
              <h1>Country</h1>
              <p className='text-[12px]'>Pick a country</p>
        </div>
        <div>
        <Dropdown>
      <DropdownTrigger>
        <Button className="capitalize w-24 h-16 bg-black text-white text-xl" variant="bordered">
          {selectedCountryValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Single selection example"
        selectedKeys={selectedCountry}
        selectionMode="single"
        variant="flat"
        onSelectionChange={(keys) => {
          // Convert keys to Set<string>
          const stringKeys = new Set(Array.from(keys).map(key => String(key)));
          setSelectedCountry(stringKeys);
      }}
      >
        <DropdownItem key="nepal">Nepal</DropdownItem>
        <DropdownItem key="indonesia">Indonesia</DropdownItem>
      </DropdownMenu>
    </Dropdown>
        </div>
              
              </div>
              <div className='gap-3 flex flex-col' >
              <div className='text-center'>
              <h1>Size</h1>
              <p className='text-[12px]'>Pick a size</p>
              
        </div>
        <div>
        <Dropdown>
      <DropdownTrigger>
        <Button className="capitalize w-24 h-16 bg-black text-white text-xl" variant="bordered">
          {selectedSizeValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Single selection example"
        selectedKeys={selectedSize}
        selectionMode="single"
        variant="flat"
        onSelectionChange={(keys) => {
          // Convert keys to Set<string>
          const stringKeys = new Set(Array.from(keys).map(key => String(key)));
          setSelectedSize(stringKeys);
      }}
      >
        <DropdownItem key="small">Small</DropdownItem>
        <DropdownItem key="medium">Medium</DropdownItem>
        <DropdownItem key="big">Big</DropdownItem>
      </DropdownMenu>
    </Dropdown>
        </div>
              
              </div>
              </div>
            
            </div>
              </div>
              <div className='w-[44rem] h-[15rem] bg-[#F8F9F8] rounded-2xl p-4 gap-4 flex flex-col'>
              <h1 className='text-2xl font-thin'>Pricing and Stock</h1>
              <div className=' flex gap-10'>
              <div className='gap-2 flex flex-col'>
                <h1>Price</h1>
                <Input
              key="outside"
              placeholder='Enter  product face'
              labelPlacement="outside"
              size='lg'
              variant='bordered'
              className='bg-[#EEEFEE] rounded-xl w-[20rem]'
              {...register("price")}
            />
                </div>
                <div className='gap-2 flex flex-col'>
                <h1>Stock</h1>
                <Input
              key="outside"
              placeholder='Enter  product stock'
              labelPlacement="outside"
              size='lg'
              variant='bordered'
              className='bg-[#EEEFEE] rounded-xl w-[20rem]'
              {...register("stock")}
            />
                </div>
              </div>
              <div className='gap-7 mt-1 justify-center flex '>
              <div className='gap-3 flex items-center ' >
              <div className='text-center '>
              <h1>Sale</h1>
             
        </div>
        <div>
        <Dropdown>
      <DropdownTrigger>
        <Button className="capitalize w-24 h-16 bg-black text-white text-xl" variant="bordered">
          {selectedSaleValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Single selection example"
        selectedKeys={selectedSale}
        selectionMode="single"
        variant="flat"
        onSelectionChange={(keys) => {
          // Convert keys to Set<string>
          const stringKeys = new Set(Array.from(keys).map(key => String(key)));
          setSelectedSale(stringKeys);
      }}
      >
        <DropdownItem key="true">True</DropdownItem>
        <DropdownItem key="false">False</DropdownItem>
      </DropdownMenu>
    </Dropdown>
        </div>
        <ul className='border'/>
              </div>
              <div className='gap-3 flex items-center' >
              <div className='text-center'>
              <h1>Special</h1>
              
              
        </div>
        
        <div>

        <Dropdown>
      <DropdownTrigger>
        <Button className="capitalize w-24 h-16 bg-black text-white text-xl" variant="bordered">
          {selectedSpecialValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Single selection example"
        selectedKeys={selectedSpecial}
        selectionMode="single"
        variant="flat"
        onSelectionChange={(keys) => {
          // Convert keys to Set<string>
          const stringKeys = new Set(Array.from(keys).map(key => String(key)));
          setSelectedSpecial(stringKeys);
      }}
      >
        <DropdownItem key="true">True</DropdownItem>
        <DropdownItem key="false">False</DropdownItem>
      </DropdownMenu>
    </Dropdown>
        </div>
    <ul className='border'/>
        <div className='gap-3 flex items-center' >
              <div className='text-center'>
              <h1 >Top Selling</h1>
        </div>
        <div>
        <Dropdown>
      <DropdownTrigger>
        <Button className="capitalize w-24 h-16 bg-black text-white text-xl" variant="bordered">
          {selectedTopSellingValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Single selection example"
        selectedKeys={selectedTopSelling}
        selectionMode="single"
        variant="flat"
        onSelectionChange={(keys) => {
          // Convert keys to Set<string>
          const stringKeys = new Set(Array.from(keys).map(key => String(key)));
          setSelectedTopSelling(stringKeys);
      }}
      >
        <DropdownItem key="true">True</DropdownItem>
        <DropdownItem key="false">False</DropdownItem>
      </DropdownMenu>
    </Dropdown>
        </div>
              
              </div>
              
              </div>

              </div>
              

              </div>

              

              </div>
              <div className='flex flex-col gap-6 '>
              <div className='w-[28rem] h-[32rem] bg-[#F8F9F8] rounded-2xl p-6 gap-6 flex flex-col'>
              <h1 className='text-2xl font-thin'>Upload image</h1>
                <div className='rounded-xl w-full h-70'>
                <Image
      alt="HeroUI hero Image"
      src="https://images.unsplash.com/photo-1736580602029-78afd910cbf8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
      width={300}
      height={300}
      className='object-cover h-full w-full rounded-xl'
    />
    
    
                </div>
                <div className='flex gap-2'>
                <div className='rounded-xl w-[6rem] h-20'>
                <Image
      alt="HeroUI hero Image"
      src="https://images.unsplash.com/photo-1736580602029-78afd910cbf8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
      width={300}
      height={300}
      className='object-cover h-full w-full rounded-xl'
    />
    
    
                </div>
                <div className='rounded-xl w-[6rem] h-20'>
                <Image
      alt="HeroUI hero Image"
      src="https://images.unsplash.com/photo-1736580602029-78afd910cbf8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
      width={300}
      height={300}
      className='object-cover h-full w-full rounded-xl'
    />
    
    
                </div>
                <div className='rounded-xl w-[6rem] h-20'>
                <Image
      alt="HeroUI hero Image"
      src="https://images.unsplash.com/photo-1736580602029-78afd910cbf8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
      width={300}
      height={300}
      className='object-cover h-full w-full rounded-xl'
    />
    
    
                </div>
                <div>

                </div>
                </div>

              </div>
              <div className='w-[28rem] h-[11rem] bg-[#F8F9F8] rounded-2xl p-4 flex flex-col gap-4'>
              <h1 className='text-2xl font-thin'>Category</h1>
              <p>Product Category</p>
              <Input
              key="outside"
              placeholder='Enter your product Category'
              labelPlacement="outside"
              size='lg'
              variant='bordered'
              className='bg-[#EEEFEE] rounded-xl'
              {...register("title")}
            />

              </div>

              </div>

              </div>
              
                 
            </form>
        </div>
    );
};

export default Product;
