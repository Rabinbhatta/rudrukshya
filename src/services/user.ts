import axios from "axios"



export const getAllUser= async()=>{
    try {
        const res = await axios.get(`http://localhost:8000/get/users`)
        return res.data;
    } catch (err:unknown) {
        if (axios.isAxiosError(err)) {
            throw new Error(err.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
    }

    export const deleteUser= async(id:string)=>{
        try {
            const res = await axios.delete(`http://localhost:8000/auth/deleteUser/${id}`)
            return res.data;
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.message);
            } else {
                throw new Error("An unexpected error occurred");
            }
        }
        }
