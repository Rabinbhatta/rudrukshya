import axios from "axios";

export const getAllProduct = async (page: number, limit: number) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/get/products?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/product/delete/${id}`
    );
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const createProduct = async (data: any) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/product/create`,
      data
    );
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const singleProduct = async (id: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/get/product/${id}`
    );
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const updateProduct = async (id: string, data: any) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/product/update/${id}`,
      data
    );
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
