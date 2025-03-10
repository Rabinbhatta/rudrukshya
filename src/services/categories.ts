import axios from "axios";

export const getAllCategories = async () => {
  try {
    const res = await axios.get(`http://localhost:8000/category/get`);
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const createSubCategory = async (id: string, name: string) => {
  try {
    const res = await axios.post(
      `http://localhost:8000/category/create/subCategory/${id}`,
      { name: name }
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

export const deleteSubCategory = async (id: string) => {
  try {
    const res = await axios.patch(
      `http://localhost:8000/category/delete/${id}`
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
