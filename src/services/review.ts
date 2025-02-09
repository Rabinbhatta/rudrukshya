import axios from "axios";

export const getReview = async (page: number, limit: number) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/review/get?page=${page}&limit=${limit}`
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
