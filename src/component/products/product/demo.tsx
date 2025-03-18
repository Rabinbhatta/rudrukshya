"use client";

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
import { toast } from "sonner";
import { getAllCategories } from "@/services/categories";
import { useParams, useRouter } from "next/navigation";
import { josefin } from "@/utils/font";

interface SubCategory {
  name: string;
  _id: string;
}

interface Category {
  name: string;
  subCategories: SubCategory[];
  _id: string;
}

const schema = z.object({
  title: z.string().min(1, "*"),
  description: z.string().min(1, "*"),
  faces: z.string().min(1, "*"),
  weight: z.string().min(1, "*"),
  country: z.string().min(1, "*"),
  size: z.string().min(1, "*"),
  price: z.string({ message: "*" }).min(1, "*"),
  stock: z.string({ message: "*" }).min(1, "*"),
  isSale: z.string().min(1, "*"),
  isSpecial: z.string().min(1, "*"),
  isExclusive: z.string().min(1, "*"),
  isTopSelling: z.string().min(1, "*"),
  category: z.string().min(1, "*"),
  subCategory: z.string().min(1, "*"),
  img: z.array(z.any()).min(1, "At least one image is required"),
});

export type formFields = z.infer<typeof schema>;

const Demo: React.FC = () => {
  const router=useRouter()              
  const [page, setPage] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<formFields>({
    resolver: zodResolver(schema),
  });
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [selectImage, setSelectImage] = useState<string>("");
  const [subCategory, setSubCategory] = useState<Category[]>([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState<SubCategory[]>([]);

  // Watch the image field to handle the selected images
  const watchImages = watch("img", []);
  const selectedCategory = watch("category");

  useEffect(() => {
    // Reset subcategory value when category changes
    setValue("subCategory", "");
    
    const foundCategory = subCategory.find(
      (cat) => cat?.name === selectedCategory
    );
    if (foundCategory) {
      setSubCategoryOptions(foundCategory ? foundCategory.subCategories : []);
    } else {
      setSubCategoryOptions([]);
    }
    
    console.log("Category changed to:", selectedCategory);
    console.log("Found category:", foundCategory);
  }, [selectedCategory, subCategory, setValue]);

  // Handle the image selection
  const handleSelectImage = (index: number): void => {
    setSelectImage(watchImages[index]);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const fileUrls = files.map((file) => URL.createObjectURL(file));

      if (productImages.length + files.length > 4) {
        toast.error("You can only upload a maximum of 4 images.");
        return;
      }

      setUploadedFiles((prev) => [...prev, ...files]);
      setProductImages((prev) => [...prev, ...fileUrls]);
      setValue("img", [...watchImages, ...fileUrls]); // For validation
    }
  };

  const handleRemoveImage = (indexToRemove: number): void => {
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
      if (uploadedFiles.length === 0 && productImages.length === 0) {
        toast.error("Please upload at least one image");
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
        await createProduct(formData);
        toast.success("Product added successfully");
        router.push("/products")
        reset();
        productImages.forEach((url) => URL.revokeObjectURL(url));

        return;
      } else {
        formData.append("removedImages", JSON.stringify(removedImages));
        uploadedFiles.forEach((file) => {
          formData.append("imgFile", file);
        });
        await updateProduct(params.id, formData);
        toast.success("Product updated successfully");
        router.push("/products")
        productImages.forEach((url) => URL.revokeObjectURL(url));
        return;
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to save product");
    }
  };

  const fetchProduct = async (id: string): Promise<void> => {
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
      
      // Set boolean fields
      setValue("isSale", data.product.isSale ? "True" : "False");
      setValue("isExclusive", data.product.isExclusive ? "True" : "False");
      setValue("isSpecial", data.product.isSpecial ? "True" : "False");
      setValue("isTopSelling", data.product.isTopSelling ? "True" : "False");
      setValue("subCategory", data.product.subCategory);                    
      
      console.log(data);
    } catch (error) {
      console.error("Fetch failed:", error);
      toast.error("Failed to fetch product data");
    }
  };

  const fetchSubCategory = async (): Promise<void> => {
    try {
      const data = await getAllCategories();
      setSubCategory(data);
      console.log("Fetched categories:", data);
      
      // If category is already selected, update subcategory options
      if (selectedCategory) {
        const foundCategory = data.find((cat:any) => cat.name === selectedCategory);
        if (foundCategory) {
          setSubCategoryOptions(foundCategory.subCategories);
          console.log("Setting subcategories for", selectedCategory, foundCategory.subCategories);
        }
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  useEffect(() => {
    if (params.id === "new") {
      setPage(false);
    } else {
      console.log(params);
      setPage(true);
      fetchProduct(params.id);
    }
    fetchSubCategory();
  }, [params]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold text-gray-800 ${josefin.className} text-primaryColor` }>
          {page ? "Edit Product" : "Add New Product"}
        </h1>
        <Button 
          className="bg-primaryColor text-white rounded-xl hover:bg-primaryColor/90 transition-colors"
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-2">
            {page ? null : <SiTicktick className="h-4 w-4" />}
            {page ? "Save Changes" : "Add Product"}
          </div>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - General Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">General Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      id="title"
                      placeholder="Enter your product name"
                      className={`bg-[#EEEFEE] w-full h-12 p-3 rounded-xl ${errors.title ? "border-2 border-red-500" : ""}`}
                      {...register("title")}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      placeholder="Enter your product description"
                      className={`h-auto mb-6 md:mb-0 bg-[#EEEFEE] rounded-xl p-3 scrollbar-hide w-full ${
                        errors.description ? "border-2 border-red-500" : ""
                      }`}
                      rows={3}
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="faces" className="block text-sm font-medium text-gray-700 mb-1">
                        Faces
                      </label>
                      <input
                        id="faces"
                        type="number"
                        placeholder="Enter product faces"
                        className={`bg-[#EEEFEE] h-12 p-3 w-full rounded-xl ${
                          errors.faces ? "border-2 border-red-500" : ""
                        }`}
                        {...register("faces")}
                      />
                      {errors.faces && (
                        <p className="text-red-500 text-sm mt-1">{errors.faces.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                        Weight
                      </label>
                      <input
                        id="weight"
                        placeholder="Enter product weight"
                        className={`bg-[#EEEFEE] h-12 p-3 w-full rounded-xl ${
                          errors.weight ? "border-2 border-red-500" : ""
                        }`}
                        {...register("weight")}
                      />
                      {errors.weight && (
                        <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Country</div>
                      <Controller
                        name="country"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                className={`capitalize w-full h-12 bg-primaryColor ${
                                  errors.country ? "border-2 border-red-500" : ""
                                } text-white text-base`}
                                variant="bordered"
                              >
                                {field.value || "Select Country"}
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              disallowEmptySelection
                              aria-label="Country selection"
                              selectedKeys={new Set([field.value])}
                              selectionMode="single"
                              variant="flat"
                              onSelectionChange={(keys) => {
                                const selectedValue = Array.from(keys)[0]; // Get the selected value
                                field.onChange(selectedValue); // Update React Hook Form state
                              }}
                            >
                              <DropdownItem key="nepal">Nepal</DropdownItem>
                              <DropdownItem key="indonesia">Indonesia</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      />
                      {errors.country && (
                        <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Size</div>
                      <Controller
                        name="size"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                className={`capitalize w-full h-12 bg-primaryColor ${
                                  errors.size ? "border-2 border-red-500" : ""
                                } text-white text-base`}
                                variant="bordered"
                              >
                                {field.value || "Select Size"}
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              disallowEmptySelection
                              aria-label="Size selection"
                              selectedKeys={new Set([field.value])}
                              selectionMode="single"
                              variant="flat"
                              onSelectionChange={(keys) => {
                                const selectedValue = Array.from(keys)[0]; 
                                field.onChange(selectedValue);
                              }}
                            >
                              <DropdownItem key="small">Small</DropdownItem>
                              <DropdownItem key="medium">Medium</DropdownItem>
                              <DropdownItem key="big">Big</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      />
                      {errors.size && (
                        <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Pricing and Stock</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          id="price"
                          type="number"
                          placeholder="Enter product price"
                          className={`bg-[#EEEFEE] h-12 p-3 pl-8 w-full rounded-xl ${
                            errors.price ? "border-2 border-red-500" : ""
                          }`}
                          {...register("price")}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                        Stock
                      </label>
                      <input
                        id="stock"
                        type="number"
                        placeholder="Enter product stock"
                        className={`bg-[#EEEFEE] h-12 p-3 w-full rounded-xl ${
                          errors.stock ? "border-2 border-red-500" : ""
                        }`}
                        {...register("stock")}
                      />
                      {errors.stock && (
                        <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Sale</div>
                      <Controller
                        name="isSale"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                className={`capitalize w-full h-12 bg-primaryColor ${
                                  errors.isSale ? "border-2 border-red-500" : ""
                                } text-white text-base`}
                                variant="bordered"
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
                                field.onChange(selectedValue);
                              }}
                            >
                              <DropdownItem key="True">True</DropdownItem>
                              <DropdownItem key="False">False</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      />
                      {errors.isSale && (
                        <p className="text-red-500 text-sm mt-1">{errors.isSale.message}</p>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Exclusive</div>
                      <Controller
                        name="isExclusive"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                className={`capitalize w-full h-12 bg-primaryColor ${
                                  errors.isExclusive ? "border-2 border-red-500" : ""
                                } text-white text-base`}
                                variant="bordered"
                              >
                                {field.value || "Select"}
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              disallowEmptySelection
                              aria-label="Exclusive selection"
                              selectedKeys={new Set([field.value])}
                              selectionMode="single"
                              variant="flat"
                              onSelectionChange={(keys) => {
                                const selectedValue = Array.from(keys)[0];
                                field.onChange(selectedValue);
                              }}
                            >
                              <DropdownItem key="True">True</DropdownItem>
                              <DropdownItem key="False">False</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      />
                      {errors.isExclusive && (
                        <p className="text-red-500 text-sm mt-1">{errors.isExclusive.message}</p>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Special</div>
                      <Controller
                        name="isSpecial"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                className={`capitalize w-full h-12 bg-primaryColor ${
                                  errors.isSpecial ? "border-2 border-red-500" : ""
                                } text-white text-base`}
                                variant="bordered"
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
                                field.onChange(selectedValue);
                              }}
                            >
                              <DropdownItem key="True">True</DropdownItem>
                              <DropdownItem key="False">False</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      />
                      {errors.isSpecial && (
                        <p className="text-red-500 text-sm mt-1">{errors.isSpecial.message}</p>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Top Selling</div>
                      <Controller
                        name="isTopSelling"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                className={`capitalize w-full h-12 bg-primaryColor ${
                                  errors.isTopSelling ? "border-2 border-red-500" : ""
                                } text-white text-base`}
                                variant="bordered"
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
                                field.onChange(selectedValue);
                              }}
                            >
                              <DropdownItem key="True">True</DropdownItem>
                              <DropdownItem key="False">False</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      />
                      {errors.isTopSelling && (
                        <p className="text-red-500 text-sm mt-1">{errors.isTopSelling.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Images and Category */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Product Images</h2>
                <div className="space-y-4">
                  <div className="relative">
                    {selectImage ? (
                      <div className="relative">
                        <Image
                          alt="Product Image"
                          src={selectImage}
                          width={416}
                          height={320}
                          quality={100}
                          className="h-64 w-full rounded-xl object-cover border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2"
                          onClick={() => handleRemoveImage(productImages.indexOf(selectImage))}
                        >
                          <IoCloseCircle size={30} className="text-red-500 bg-white rounded-full" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-64 w-full rounded-xl flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
                        {errors.img ? (
                          <p className="text-red-500">{errors.img.message}</p>
                        ) : (
                          <p className="text-gray-400">No image selected</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 overflow-x-auto py-2">
                    {productImages.map((img, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`relative rounded-lg flex-shrink-0 h-16 w-16 overflow-hidden ${
                          selectImage === img ? "ring-2 ring-primaryColor" : "ring-1 ring-gray-200"
                        }`}
                        onClick={() => handleSelectImage(index)}
                      >
                        <Image
                          alt={`Product thumbnail ${index + 1}`}
                          src={img}
                          width={64}
                          height={64}
                          className="object-cover h-full w-full"
                        />
                      </button>
                    ))}

                    <label 
                      htmlFor="upload-image" 
                      className="flex-shrink-0 h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50"
                    >
                      <CiCirclePlus size={30} className="text-primaryColor" />
                      <input
                        id="upload-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Category</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Product Category</div>
                    <Controller
                      name="category"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              className={`capitalize w-full h-12 bg-primaryColor ${
                                errors.category ? "border-2 border-red-500" : ""
                              } text-white text-base`}
                              variant="bordered"
                            >
                              {field.value || "Select Category"}
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
                              field.onChange(selectedValue);
                            }}
                          >
                            <DropdownItem key="mala">Mala</DropdownItem>
                            <DropdownItem key="Beads">Beads</DropdownItem>
                            <DropdownItem key="bracelet">Bracelet</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    />
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Sub Category</div>
                    <Controller
                      name="subCategory"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Dropdown isDisabled={!selectedCategory}>
                          <DropdownTrigger>
                            <Button
                              className={`capitalize w-full h-12 bg-primaryColor ${
                                errors.subCategory ? "border-2 border-red-500" : ""
                              } text-white text-base ${!selectedCategory ? "opacity-70" : ""}`}
                              variant="bordered"
                            >
                              {field.value || "Select Sub-Category"}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            disallowEmptySelection
                            aria-label="Sub-Category selection"
                            selectedKeys={new Set([field.value])}
                            selectionMode="single"
                            variant="flat"
                            onSelectionChange={(keys) => {
                              const selectedValue = Array.from(keys)[0];
                              field.onChange(selectedValue);
                            }}
                          >
                            {subCategoryOptions.length > 0 ? (
                              subCategoryOptions.map((sub) => (
                                <DropdownItem key={sub.name} value={sub.name}>
                                  {sub.name}
                                </DropdownItem>
                              ))
                            ) : (
                              <DropdownItem key="noSub">
                                No Subcategories
                              </DropdownItem>
                            )}
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    />
                    {errors.subCategory && (
                      <p className="text-red-500 text-sm mt-1">{errors.subCategory.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Demo;