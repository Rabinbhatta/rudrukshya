import axios from "axios";

export const getConsultation = async (page: number, limit: number) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/consultation/get?page=${page}&limit=${limit}`
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

export const deleteConsultation = async (id: string) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/consultation/delete/${id}`
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
