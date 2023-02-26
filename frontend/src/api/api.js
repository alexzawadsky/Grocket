import axios from "axios";
import { useContext } from "react";
import { useQuery } from "react-query";
import AuthContext from "../contexts/AuthProvider";
import useAxios from "../hooks/useAxios";


export const useProducts = (page) => {
    const api = useAxios()
    return useQuery(['products', page], () => api.get(`/api/v1/products/?limit=4&page=${page + 1}`).then(res => res.data))
}

export default axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost' })