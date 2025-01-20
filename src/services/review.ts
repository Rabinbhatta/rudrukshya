import axios from "axios"



export const getReview= async()=>{
    try {
        const res = await axios.get(`http://localhost:8000/review/get?limit=20`)
        return res.data;
    } catch (err:unknown) {
        if (axios.isAxiosError(err)) {
            throw new Error(err.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
    }