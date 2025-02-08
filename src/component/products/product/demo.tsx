"use client";
// yo ho real code
import {
  createProduct,
  singleProduct,
  updateProduct,
} from "@/services/product";
import React, { useState, useEffect } from "react";
import * as z from "zod";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { IoCloseCircle } from "react-icons/io5";

interface Props {
  id: string;
}

const schema = z.object({
  title: z.string().min(1, "*"),
  description: z.string().min(1, "*"),
  faces: z.string().min(1, "*"),
  weight: z.string().min(1, "*"),
  country: z.string().min(1, "*"),
  size: z.string().min(1, "*"),
  price: z.number({ message: "*" }).min(1, "*"),
  stock: z.number({ message: "*" }).min(1, "*"),
  isSale: z.string().min(1, "*"),
  isSpecial: z.string().min(1, "*"),
  isTopSelling: z.string().min(1, "*"),
  category: z.string().min(1, "*"),
  img: z.array(z.any()).min(1, "At least one image is required"), // Ensure at least one image
});

export type formFields = z.infer<typeof schema>;

const Demo: React.FC<Props> = ({ id }) => {
  const [page, setPage] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<formFields>({
    resolver: zodResolver(schema),
  });
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]); // Manage images with useState
  const [selectImage, setSelectImage] = useState("");

  // Watch the image field to handle the selected images
  const watchImages = watch("img", []);

  // Handle the image selection
  const handleSelectImage = (index: number) => {
    setSelectImage(watchImages[index]);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const fileUrls = files.map((file) => URL.createObjectURL(file));

      if (productImages.length + files.length > 4) {
        alert("You can only upload a maximum of 4 images.");
        return;
      }

      setUploadedFiles((prev) => [...prev, ...files]);
      setProductImages((prev) => [...prev, ...fileUrls]);
      setValue("img", [...watchImages, ...fileUrls]); // For validation
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const imageToRemove = productImages[indexToRemove];

    if (imageToRemove.startsWith("http")) {
      setRemovedImages((prev) => [...prev, imageToRemove]);
    }

    const newImages = productImages.filter((_, i) => i !== indexToRemove);
    const newFiles = uploadedFiles.filter((_, i) => i !== indexToRemove);

    setProductImages(newImages);
    setUploadedFiles(newFiles);
    setValue("img", newImages);
    setSelectImage(newImages[0] || "");
  };

  useEffect(() => {
    if (productImages.length > 0) {
      setSelectImage(productImages[0]); // Set first image as default
    } else {
      setSelectImage(""); // Reset selection if no images
    }
  }, [productImages]);

  const onSubmit: SubmitHandler<formFields> = async (data) => {
    try {
      console.log(data);
      if (uploadedFiles.length === 0) {
        alert("Please upload at least one image");
        return;
      }

      const formData = new FormData();

      // Type-safe way to append form data
      (Object.keys(data) as Array<keyof formFields>).forEach((key) => {
        if (key !== "img") {
          const value = data[key];
          // Convert all values to strings
          formData.append(key, String(value));
        }
      });

      // Append image files

      if (!page) {
        uploadedFiles.forEach((file) => {
          formData.append("img", file);
        });
        const result = await createProduct(formData);
        console.log(result);
        productImages.forEach((url) => URL.revokeObjectURL(url));

        return;
      } else {
        formData.append("removedImages", JSON.stringify(removedImages));
        uploadedFiles.forEach((file) => {
          formData.append("imgFile", file);
        });
        const result = await updateProduct(id, formData);
        console.log(result);
        productImages.forEach((url) => URL.revokeObjectURL(url));
        return;
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const fetchProduct = async (id: string) => {
    try {
      const data = await singleProduct(id);
      setValue("title", data.product.title);
      setValue("category", data.product.category);
      setValue("country", data.product.country);
      setValue("description", data.product.description);
      setValue("faces", data.product.faces);

      setValue("price", data.product.price);
      setValue("size", data.product.size);
      setValue("stock", data.product.stock);
      setValue("weight", data.product.weight);
      setValue("img", data.product.img);
      setProductImages(data.product.img);
      setSelectImage(data.product.img[0]);
      if (data.product.isSale) {
        setValue("isSale", "True");
      } else {
        setValue("isSale", "False");
      }
      if (data.product.isSpecial) {
        setValue("isSpecial", "True");
      } else {
        setValue("isSpecial", "False");
      }
      if (data.product.isTopSelling) {
        setValue("isTopSelling", "True");
      } else {
        setValue("isTopSelling", "False");
      }
      console.log(data);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  useEffect(() => {
    if (id === "new") {
      setPage(false);
    } else {
      setPage(true);
      fetchProduct(id);
    }
  }, []);
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
            <div className="w-[44rem] h-fit bg-[#F8F9F8] rounded-2xl p-4 flex flex-col gap-3">
              <h1 className="text-2xl font-thin">General Information</h1>
              <div className="gap-2 flex flex-col h-fit">
                <h1>Product Name</h1>
                <div className="h-12">
                  <input
                    key="outside"
                    placeholder="Enter your product name"
                    className="bg-[#EEEFEE] w-full h-12 p-3 rounded-xl"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-red-500 relative top-[-5.6rem] left-[6.4rem] text-3xl ">
                      {errors.title.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="gap-2 flex flex-col">
                <h1>Description</h1>
                <div className="h-fit">
                  <textarea
                    key="bordered"
                    className=" h-auto mb-6 md:mb-0 bg-[#EEEFEE] rounded-xl p-3  scrollbar-hide w-full"
                    placeholder="Enter your description"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-red-500 relative top-[-9rem] left-[5rem] text-3xl ">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="gap-2 flex flex-col">
                  <div className="gap-2 flex flex-col">
                    <h1>Faces</h1>
                    <div className="h-12">
                      <input
                        key="outside"
                        placeholder="Enter  product face"
                        type="number"
                        className="bg-[#EEEFEE] h-12 p-3 w-[25rem] rounded-xl"
                        {...register("faces")}
                      />
                      {errors.faces && (
                        <p className="text-red-500 relative top-[-5.7rem] left-[2.6rem] text-3xl ">
                          {errors.faces.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="gap-2 flex flex-col">
                    <h1>Weight</h1>
                    <div className="h-12">
                      <input
                        key="outside"
                        placeholder="Enter  product weight"
                        className="bg-[#EEEFEE] h-12 p-3 rounded-xl  w-full"
                        {...register("weight")}
                      />
                      {errors.weight && (
                        <p className="text-red-500 relative top-[-5.6rem] left-[3.1rem] text-3xl ">
                          {errors.weight.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="gap-7 flex items-center">
                  <div className="gap-3 flex flex-col">
                    <div className="text-center">
                      <h1>Country</h1>
                      <p className="text-[12px]">Pick a country</p>
                    </div>
                    <div>
                      <Controller
                        name="country"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                className={`capitalize w-24 h-16 bg-black ${
                                  errors.country
                                    ? "text-red-500"
                                    : " text-white"
                                }  text-xl`}
                                variant="bordered"
                              >
                                {field.value || "Select"}
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              disallowEmptySelection
                              aria-label="Single selection example"
                              selectedKeys={new Set([field.value])}
                              selectionMode="single"
                              variant="flat"
                              onSelectionChange={(keys) => {
                                const selectedValue = Array.from(keys)[0]; // Get the selected value
                                field.onChange(selectedValue); // Update React Hook Form state
                              }}
                            >
                              <DropdownItem key="nepal">Nepal</DropdownItem>
                              <DropdownItem key="indonesia">
                                Indonesia
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      />
                    </div>
                  </div>
                  <div className="gap-3 flex flex-col">
                    <div className="text-center">
                      <h1>Size</h1>
                      <p className="text-[12px]">Pick a size</p>
                    </div>
                    <div>
                      <Controller
                        name="size"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                className={`capitalize w-24 h-16 bg-black ${
                                  errors.size ? "text-red-500" : " text-white"
                                }  text-xl`}
                                variant="bordered"
                              >
                                {field.value || "Select"}
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              disallowEmptySelection
                              aria-label="Select size"
                              selectedKeys={new Set([field.value])}
                              selectionMode="single"
                              variant="flat"
                              onSelectionChange={(keys) => {
                                const selectedValue = Array.from(keys)[0]; // Extract selected size
                                field.onChange(selectedValue); // Update React Hook Form state
                              }}
                            >
                              <DropdownItem key="small">Small</DropdownItem>
                              <DropdownItem key="medium">Medium</DropdownItem>
                              <DropdownItem key="big">Big</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      />
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
                  <div className="h-12">
                    <input
                      key="outside"
                      placeholder="Enter  product face"
                      className="bg-[#EEEFEE] h-12 p-3 w-[19rem] rounded-xl"
                      {...register("price")}
                    />
                    {errors.price && (
                      <p className="text-red-500 relative top-[-5.6rem] left-[2.4rem] text-3xl ">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="gap-2 flex flex-col">
                  <h1>Stock</h1>
                  <div className="h-12">
                    <input
                      key="outside"
                      placeholder="Enter  product stock"
                      className="bg-[#EEEFEE] h-12 p-3 w-[20rem] rounded-xl"
                      {...register("stock")}
                    />
                    {errors.stock && (
                      <p className="text-red-500 relative top-[-5.8rem] left-[2.4rem] text-3xl ">
                        {errors.stock.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="gap-7 mt-1 justify-center flex ">
                {/* Sale Dropdown */}
                <div className="gap-3 flex items-center ">
                  <div className="text-center ">
                    <h1>Sale</h1>
                  </div>
                  <div>
                    <Controller
                      name="isSale"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              className={`capitalize w-24 h-16 bg-black ${
                                errors.isSale ? "text-red-500" : " text-white"
                              }  text-xl`}
                              variant="bordered"
                              {...field} // Register the field here
                            >
                              {field.value || "Select"}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            disallowEmptySelection
                            aria-label="Sale selection"
                            selectedKeys={new Set([field.value])}
                            selectionMode="single"
                            variant="flat"
                            onSelectionChange={(keys) => {
                              const selectedValue = Array.from(keys)[0];
                              field.onChange(selectedValue); // Update form value
                            }}
                          >
                            <DropdownItem key="true">True</DropdownItem>
                            <DropdownItem key="false">False</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    />
                  </div>
                  <ul className="border" />
                </div>

                {/* Special Dropdown */}
                <div className="gap-3 flex items-center">
                  <div className="text-center">
                    <h1>Special</h1>
                  </div>
                  <div>
                    <Controller
                      name="isSpecial"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              className={`capitalize w-24 h-16 bg-black ${
                                errors.isSpecial
                                  ? "text-red-500"
                                  : " text-white"
                              }  text-xl`}
                              variant="bordered"
                              {...field} // Register the field here
                            >
                              {field.value || "Select"}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            disallowEmptySelection
                            aria-label="Special selection"
                            selectedKeys={new Set([field.value])}
                            selectionMode="single"
                            variant="flat"
                            onSelectionChange={(keys) => {
                              const selectedValue = Array.from(keys)[0];
                              field.onChange(selectedValue); // Update form value
                            }}
                          >
                            <DropdownItem key="true">True</DropdownItem>
                            <DropdownItem key="false">False</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    />
                  </div>
                  <ul className="border" />

                  {/* Top Selling Dropdown */}
                  <div className="gap-3 flex items-center">
                    <div className="text-center">
                      <h1>Top Selling</h1>
                    </div>
                    <div>
                      <Controller
                        name="isTopSelling"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                className={`capitalize w-24 h-16 bg-black ${
                                  errors.isTopSelling
                                    ? "text-red-500"
                                    : " text-white"
                                }  text-xl`}
                                variant="bordered"
                                {...field} // Register the field here
                              >
                                {field.value || "Select"}
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              disallowEmptySelection
                              aria-label="Top Selling selection"
                              selectedKeys={new Set([field.value])}
                              selectionMode="single"
                              variant="flat"
                              onSelectionChange={(keys) => {
                                const selectedValue = Array.from(keys)[0];
                                field.onChange(selectedValue); // Update form value
                              }}
                            >
                              <DropdownItem key="true">True</DropdownItem>
                              <DropdownItem key="false">False</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="w-[28rem] h-fit bg-[#F8F9F8] rounded-2xl p-6 gap-6 flex flex-col">
              <h1 className="text-2xl font-thin">Upload image</h1>
              <div className="rounded-xl w-full h-full">
                {selectImage === "" ? (
                  <div className="rounded-xl w-[25rem] h-[18rem] flex items-center justify-center bg-gray-200">
                    {errors.img && (
                      <p className="text-red-400">{errors.img.message}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <Image
                      alt="HeroUI hero Image"
                      src={selectImage || ""}
                      width={416}
                      height={320}
                      quality={100}
                      className="h-[20rem] w-[26rem] rounded-xl object-cover"
                    />
                    <button
                      className="absolute top-[9rem] right-[3.7rem] "
                      onClick={() =>
                        handleRemoveImage(
                          productImages.indexOf(selectImage || " ")
                        )
                      }
                    >
                      <IoCloseCircle size={38} className="text-red-500" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className="rounded-xl w-1/5 h-24"
                    onClick={() => handleSelectImage(index)}
                  >
                    <Image
                      alt="HeroUI hero Image"
                      src={img || " "}
                      width={300}
                      height={300}
                      quality={100}
                      className={`object-cover h-full w-full rounded-xl ${
                        selectImage === img
                          ? "border-[3.5px] border-gray-400"
                          : ""
                      }`}
                    />
                  </div>
                ))}

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
                      multiple // Allow multiple file selection
                      onChange={handleImageUpload} // Handle image upload
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[28rem] h-[11rem] bg-[#F8F9F8] rounded-2xl p-4 flex flex-col gap-4">
              <h1 className="text-2xl font-thin">Category</h1>
              <p>Product Category</p>

              <Controller
                name="category"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        className={`capitalize w-24 h-16 bg-black ${
                          errors.category ? "text-red-500" : " text-white"
                        }  text-xl w-full`}
                        variant="bordered"
                        {...field} // Register the field here
                      >
                        {field.value || "Select"}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection
                      aria-label="Category selection"
                      selectedKeys={new Set([field.value])}
                      selectionMode="single"
                      variant="flat"
                      onSelectionChange={(keys) => {
                        const selectedValue = Array.from(keys)[0];
                        field.onChange(selectedValue); // Update form value
                      }}
                    >
                      <DropdownItem key="mala">Mala</DropdownItem>
                      <DropdownItem key="Beads">Beads</DropdownItem>
                      <DropdownItem key="bracelet">Bracelet</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Demo;
