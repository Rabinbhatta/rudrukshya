"use client";
import { singleProduct } from "@/services/product";
import React, { useState, useEffect } from "react";
import * as z from "zod";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import Image from "next/image";
import { SiTicktick } from "react-icons/si";
import { CiCirclePlus } from "react-icons/ci";
import { profile } from "console";

const schema = z.object({
  title: z.string(),
  category: z.string(),
  country: z.string(),
  description: z.string(),
  faces: z.string(),
  isSale: z.string(),
  isSpecial: z.string(),
  isTopSelling: z.string(),
  price: z.string(),
  size: z.string(),
  stock: z.string(),
  weight: z.string(),
  img: z.array(z.string()),
});

type formFields = z.infer<typeof schema>;

interface Product {
  title: string;
  category: string;
  country: string;
  description: string;
  faces: string;
  isSale: string;
  isSpecial: string;
  isTopSelling: string;
  price: string;
  size: string;
  stock: string;
  weight: string;
  img: string[];
}

interface props {
  id: string;
}
const Product: React.FC<props> = ({ id }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [page, setpage] = useState(true);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<formFields>({
    resolver: zodResolver(schema),
  });
  const fetchData = async (id: string) => {
    try {
      const data = await singleProduct(id);
      setProduct(data.product);
      setValue("title", data.product.title);
      setValue("category", data.product.category);
      setValue("country", data.product.country);
      setValue("description", data.product.description);
      setValue("faces", data.product.faces);
      setValue("isSale", data.product.isSale);
      setValue("isSpecial", data.product.isSpecial);
      setValue("isTopSelling", data.product.isTopSelling);
      setValue("price", data.product.price);
      setValue("size", data.product.size);
      setValue("stock", data.product.stock);
      setValue("weight", data.product.weight);
      setValue("img", data.product.img);
      setSelectedCountry(data.product.country);
      setSelectedSize(data.product.size);
      if (data.product.isSale) {
        setSelectedSale(new Set(["True"]));
      } else {
        setSelectedSale(new Set(["False"]));
      }

      if (data.product.isSpecial) {
        setSelectedSpecial(new Set(["True"]));
      } else {
        setSelectedSpecial(new Set(["False"]));
      }

      if (data.product.isTopSelling) {
        setSelectedTopSelling(new Set(["True"]));
      } else {
        setSelectedTopSelling(new Set(["False"]));
      }
      setSelectImage(data.product.img[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit: SubmitHandler<formFields> = (data) => {
    console.log("click");
  };

  useEffect(() => {
    if (id === "new") {
      setpage(false);
    } else {
      fetchData(id);
    }
  }, []);

  const [selectImage, setSelectImage] = useState<string>(
    product?.img[0] || " "
  );

  const handleSelectImage = (index: number) => {
    setSelectImage(product?.img[index] || "");
  };
  const [selectedSize, setSelectedSize] = React.useState(new Set(["Select"]));

  const selectedSizeValue = React.useMemo(
    () => Array.from(selectedSize),
    [selectedSize]
  );

  const [selectedCountry, setSelectedCountry] = React.useState(
    new Set(["Select"])
  );

  const selectedCountryValue = React.useMemo(
    () => Array.from(selectedCountry),
    [selectedCountry]
  );
  const [selectedSale, setSelectedSale] = React.useState(new Set(["Select"]));

  const selectedSaleValue = React.useMemo(
    () => Array.from(selectedSale),
    [selectedSale]
  );
  const [selectedSpecial, setSelectedSpecial] = React.useState(
    new Set(["Select"])
  );

  const selectedSpecialValue = React.useMemo(
    () => Array.from(selectedSpecial),
    [selectedSpecial]
  );
  const [selectedTopSelling, setSelectedTopSelling] = React.useState(
    new Set(["Select"])
  );

  const selectedTopSellingValue = React.useMemo(
    () => Array.from(selectedTopSelling),
    [selectedTopSelling]
  );
  return (
    <div className="ml-12 w-full">
      <h1 className="text-4xl">{page ? "Edit Product" : "Add new Product"}</h1>
      <form
        className="mt-2 flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-end -mt-10 mr-14">
          <Button className="bg-black text-white" type="submit">
            {page ? (
              "Edit Product"
            ) : (
              <p className="flex gap-1 items-center">
                <SiTicktick />
                Add new Product
              </p>
            )}
          </Button>
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col gap-6">
            <div className="w-[44rem] h-[30rem] bg-[#F8F9F8] rounded-2xl p-4 flex flex-col gap-3">
              <h1 className="text-2xl font-thin">General Information</h1>
              <div className="gap-2 flex flex-col">
                <h1>Product Name</h1>
                <input
                  key="outside"
                  placeholder="Enter your product name"
                  className="bg-[#EEEFEE] h-12 p-3 rounded-xl"
                  {...register("title")}
                />
              </div>

              <div className="gap-2 flex flex-col">
                <h1>Description</h1>
                <textarea
                  key="bordered"
                  className="col-span-9 md:col-span-6 mb-6 md:mb-0 bg-[#EEEFEE] rounded-xl p-3 h-24 overflow-y-scroll resize-none scrollbar-hide"
                  placeholder="Enter your description"
                  {...register("description")}
                />
              </div>
              <div className="flex justify-between">
                <div className="gap-2 flex flex-col">
                  <div className="gap-2 flex flex-col">
                    <h1>Faces</h1>
                    <input
                      key="outside"
                      placeholder="Enter  product face"
                      className="bg-[#EEEFEE] h-12 p-3 w-[25rem] rounded-xl"
                      {...register("faces")}
                    />
                  </div>
                  <div className="gap-2 flex flex-col">
                    <h1>Weight</h1>
                    <input
                      key="outside"
                      placeholder="Enter  product weight"
                      className="bg-[#EEEFEE] h-12 p-3 rounded-xl"
                      {...register("weight")}
                    />
                  </div>
                </div>

                <div className="gap-7 flex items-center">
                  <div className="gap-3 flex flex-col">
                    <div className="text-center">
                      <h1>Country</h1>
                      <p className="text-[12px]">Pick a country</p>
                    </div>
                    <div>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            className="capitalize w-24 h-16 bg-black text-white text-xl"
                            variant="bordered"
                            {...register("country")}
                          >
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
                            const stringKeys = new Set(
                              Array.from(keys).map((key) => String(key))
                            );
                            setSelectedCountry(stringKeys);
                          }}
                        >
                          <DropdownItem key="nepal">Nepal</DropdownItem>
                          <DropdownItem key="indonesia">Indonesia</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="gap-3 flex flex-col">
                    <div className="text-center">
                      <h1>Size</h1>
                      <p className="text-[12px]">Pick a size</p>
                    </div>
                    <div>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            className="capitalize w-24 h-16 bg-black text-white text-xl"
                            variant="bordered"
                            {...register("size")}
                          >
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
                            const stringKeys = new Set(
                              Array.from(keys).map((key) => String(key))
                            );
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
            <div className="w-[44rem] h-[15rem] bg-[#F8F9F8] rounded-2xl p-4 gap-4 flex flex-col">
              <h1 className="text-2xl font-thin">Pricing and Stock</h1>
              <div className=" flex gap-10">
                <div className="gap-2 flex flex-col">
                  <h1>Price</h1>
                  <input
                    key="outside"
                    placeholder="Enter  product face"
                    className="bg-[#EEEFEE] h-12 p-3 w-[19rem] rounded-xl"
                    {...register("price")}
                  />
                </div>
                <div className="gap-2 flex flex-col">
                  <h1>Stock</h1>
                  <input
                    key="outside"
                    placeholder="Enter  product stock"
                    className="bg-[#EEEFEE] h-12 p-3 w-[20rem] rounded-xl"
                    {...register("stock")}
                  />
                </div>
              </div>
              <div className="gap-7 mt-1 justify-center flex ">
                <div className="gap-3 flex items-center ">
                  <div className="text-center ">
                    <h1>Sale</h1>
                  </div>
                  <div>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          className="capitalize w-24 h-16 bg-black text-white text-xl"
                          variant="bordered"
                          {...register("isSale")}
                        >
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
                          const stringKeys = new Set(
                            Array.from(keys).map((key) => String(key))
                          );
                          setSelectedSale(stringKeys);
                        }}
                      >
                        <DropdownItem key="true">True</DropdownItem>
                        <DropdownItem key="false">False</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <ul className="border" />
                </div>
                <div className="gap-3 flex items-center">
                  <div className="text-center">
                    <h1>Special</h1>
                  </div>

                  <div>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          className="capitalize w-24 h-16 bg-black text-white text-xl"
                          variant="bordered"
                        >
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
                          const stringKeys = new Set(
                            Array.from(keys).map((key) => String(key))
                          );
                          setSelectedSpecial(stringKeys);
                        }}
                      >
                        <DropdownItem key="true">True</DropdownItem>
                        <DropdownItem key="false">False</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <ul className="border" />
                  <div className="gap-3 flex items-center">
                    <div className="text-center">
                      <h1>Top Selling</h1>
                    </div>
                    <div>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            className="capitalize w-24 h-16 bg-black text-white text-xl"
                            variant="bordered"
                          >
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
                            const stringKeys = new Set(
                              Array.from(keys).map((key) => String(key))
                            );
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
          <div className="flex flex-col gap-6 ">
            <div className="w-[28rem] h-fit bg-[#F8F9F8] rounded-2xl p-6 gap-6 flex flex-col">
              <h1 className="text-2xl font-thin">Upload image</h1>
              <div className="rounded-xl w-full h-full">
                {selectImage === " " ? (
                  <div className="rounded-xl w-full h-full bg-gray-200"></div>
                ) : (
                  <Image
                    alt="HeroUI hero Image"
                    src={selectImage}
                    width={416} // Approximate width for 26rem
                    height={320} // Approximate height for 20rem
                    quality={100} // Ensure high quality
                    className="h-[20rem] w-[26rem] rounded-xl object-cover"
                  />
                )}
              </div>

              <div className="flex gap-2">
                {product?.img.map((img, index) => {
                  return (
                    <div
                      key={index}
                      className="rounded-xl w-1/5 h-24" // Increased height
                      onClick={() => handleSelectImage(index)}
                    >
                      <Image
                        alt="HeroUI hero Image"
                        src={img}
                        width={300}
                        height={300}
                        quality={100} // Ensure high quality
                        className={`object-cover h-full w-full rounded-xl ${
                          selectImage === img
                            ? "border-[3.5px] border-gray-400"
                            : ""
                        }`}
                      />
                    </div>
                  );
                })}

                <div className="rounded-xl w-1/5 h-24 border-dashed border-[3.5px]">
                  <div className="flex justify-center items-center h-full w-full">
                    <label htmlFor="upload-image" className="cursor-pointer">
                      <CiCirclePlus
                        size={35}
                        className="bg-green-400 text-white rounded-full"
                      />
                    </label>
                    <input
                      id="upload-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          // Handle the uploaded file here
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[28rem] h-[11rem] bg-[#F8F9F8] rounded-2xl p-4 flex flex-col gap-4">
              <h1 className="text-2xl font-thin">Category</h1>
              <p>Product Category</p>

              <input
                key="outside"
                placeholder="Enter your product Category"
                className="bg-[#EEEFEE] h-12 p-3 rounded-xl"
                {...register("category")}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Product;
