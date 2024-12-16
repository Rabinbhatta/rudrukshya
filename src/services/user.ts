import axios from "axios"
import { Payment } from "@/component/User"


export const getAllUser= async()=>{
    try {
        const res = await axios.get(`https://rudruksha-server.onrender.com/get/users`)
        return res.data;
    } catch (err:unknown) {
        if (axios.isAxiosError(err)) {
            throw new Error(err.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
    }
