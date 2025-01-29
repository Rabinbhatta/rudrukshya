"use client";
import Product from "@/component/products/product";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Demo from "@/component/products/product/demo";
const queryClient = new QueryClient();

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Demo id={params.id} />
      </QueryClientProvider>
    </div>
  );
};

export default page;
