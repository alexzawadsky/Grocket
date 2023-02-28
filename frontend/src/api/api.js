import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useAxios from "../hooks/useAxios";

export const useProducts = (queryParams) => {
    const api = useAxios()
    return useQuery(['products', queryParams], () => api.get(`/api/v1/products`,
        { params: { ...queryParams, limit: 10 } }).then(res => res.data))
}

export const useProcuct = (productId) => {
    const api = useAxios()
    return useQuery(['product', productId],
        () => api.get(`/api/v1/products/${productId}`).then(res => res.data))
}

export const useAddProduct = () => {
    const queryClient = useQueryClient()
    const api = useAxios()
    return useMutation((product) => api.post('/api/v1/products/', product).then(res => res.data),
        { onSuccess: () => queryClient.invalidateQueries('products') })
}

export const useProductsMe = (queryParams) => {
    const api = useAxios()
    return useQuery(['products', 'me', queryParams],
        () => api.get('/api/v1/users/me/products', { params: queryParams }).then(res => res.data))
}

export const useCategories = (parentId) => {
    const api = useAxios()
    return useQuery(['categories', { parent_id: parentId }],
        () => api.get(`/api/v1/categories/`, { params: { parent_id: parentId } }).then(res => res.data))
}

export default axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost' })