import axios from "axios"



export const getAllProduct= async(page:number,limit:number)=>{
    try {
        const res = await axios.get(`http://localhost:8000/get/products?page=${page}&limit=${limit}`)
        return res.data;
    } catch (err:unknown) {
        if (axios.isAxiosError(err)) {
            throw new Error(err.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
    }

    export const deleteProduct= async(id:string)=>{
        try {
            const res = await axios.delete(`http://localhost:8000/product/delete/${id}`)
            return res.data;
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.message);
            } else {
                throw new Error("An unexpected error occurred");
            }
        }
        }

        export const createProduct= async(data:FormData)=>{
            try {
                const res = await axios.post(`http://localhost:8000/product/create`,data)
                return res.data;
            } catch (err:unknown) {
                if (axios.isAxiosError(err)) {
                    throw new Error(err.message);
                } else {
                    throw new Error("An unexpected error occurred");
                }
            }
            }
    
