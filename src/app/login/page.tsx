"use client";
import Login from "@/component/login";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Pages = () => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>
    </div>
  );
};

export default Pages;
