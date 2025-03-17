import Categories from "@/component/categories";
import { josefin } from "@/utils/font";
import React from "react";

const page = () => {
  return (
    <div>
      <h1 className={`${josefin.className} text-4xl text-primaryColor`}>Categories</h1>
      <hr className="mt-4 w-[70vw]" />
      <div className="mt-10">
        <Categories />
      </div>
    </div>
  );
};

export default page;
