"use client";
import Link from "next/link";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type formfields = z.infer<typeof registerSchema>;

export default function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<formfields>({ resolver: zodResolver(registerSchema) });
  const router = useRouter();

  // const { mutate: mutateLogin } = useMutation({
  //   mutationFn: (data: formfields) =>
  //     signIn("credentials", {
  //       email: data.email,
  //       password: data.password,
  //       redirect: false,
  //     }),
  //   onSuccess: (response: any) => {
  //     if (response?.error) {
  //       console.log(response);
  //       toast.error(response.error?.data?.message || "Invalid credentials");
  //     } else {
  //       // Handle successful login
  //       toast.success("Login successful");
  //       router.push("/");
  //     }
  //   },
  //   onError: (error: any) => {
  //     console.error(error);
  //     toast.error("An unexpected error occurred.");
  //   },
  // });

  const onSubmit: SubmitHandler<formfields> = async (data) => {
    // try {
    //   if (data) {
    //     mutateLogin(data);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
