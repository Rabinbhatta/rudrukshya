import Categories from "@/component/categories";
import React from "react";

const page = () => {
  return (
    <div>
      <h1 className="text-4xl">Categories</h1>
      <hr className="mt-8 w-[70vw]" />
      <div className="mt-10">
        <Categories />
      </div>
    </div>
  );
};

export default page;
