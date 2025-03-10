"use client";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Demo from "@/component/products/product/demo";
const queryClient = new QueryClient();

const page = () => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Demo />
      </QueryClientProvider>
    </div>
  );
};

export default page;
