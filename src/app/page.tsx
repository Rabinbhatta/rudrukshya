"use client";
import Login from "@/component/login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>
    </div>
  );
}
