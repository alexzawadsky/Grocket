import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useAxios from "../hooks/useAxios";



export const useProducts = (page) => {
    const api = useAxios()
    return useQuery(['products', page], () => api.get(`/api/v1/products/?limit=4&page=${page + 1}`).then(res => res.data))
}

export const useProcuct = (productId) => {
    const api = useAxios()
    return useQuery(['product', productId], () => api.get(`/api/v1/products/${productId}`).then(res => res.data))
}

export const useAddProduct = (product) => {
    const queryClient = useQueryClient()
    const api = useAxios()
    return useMutation(() => api.post('/api/v1/products/', product).then(res => res.data),
        { onSuccess: () => queryClient.invalidateQueries('products') })
}

export default axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost' })