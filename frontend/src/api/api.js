import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useAxios from "../hooks/useAxios";
import { notification } from "../utils";

const limit = 12;

export const useProducts = (queryParams) => {
    const api = useAxios()
    return useQuery(['products', queryParams],
        () => api.get(`/api/v1/products`,
            { params: { ...queryParams, limit: limit } }).then(res => res.data),
        { keepPreviousData: true })
}

export const useProduct = (productId) => {
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

export const useUpdateProduct = () => {
    const api = useAxios()
    const queryClient = useQueryClient()
    return useMutation((data) => api.patch(`/api/v1/products/${data.id}/`, data.body).then(res => res.data),
        {
            onSuccess: () => {
                notification('Changes saved')
                queryClient.invalidateQueries('product')
                queryClient.invalidateQueries('products')
            }
        })
}

export const useUserProducts = (userId, queryParams) => {
    const api = useAxios()
    return useQuery(['products', userId, queryParams],
        () => api.get(`/api/v1/users/${userId}/products`,
            { params: { ...queryParams, limit: limit } }).then(res => res.data),
        { keepPreviousData: true })
}

export const useCategories = (parentId) => {
    const api = useAxios()
    return useQuery(['categories', { parent_id: parentId }],
        () => api.get(`/api/v1/categories`, { params: { parent_id: parentId } }).then(res => res.data))
}

export const useProfile = (userId) => {
    const api = useAxios()
    return useQuery(['users', userId],
        () => api.get(`/api/v1/users/${userId}`).then(res => res.data))
}

export const useSellProduct = () => {
    const api = useAxios()
    const queryClient = useQueryClient()
    return useMutation((data) => api({
        url: `/api/v1/products/${data.id}/sell/`,
        method: data.state ? 'delete' : 'post'
    }), {
        onSuccess: () => {
            notification()
            queryClient.invalidateQueries('products')
            queryClient.invalidateQueries('product')
        }
    })
}

export const useArchiveProduct = () => {
    const api = useAxios()
    const queryClient = useQueryClient()
    return useMutation((data) => api({
        url: `/api/v1/products/${data.id}/archive/`,
        method: data.state ? 'delete' : 'post'
    }), {
        onSuccess: () => {
            notification()
            queryClient.invalidateQueries('products')
            queryClient.invalidateQueries('product')
        }
    })
}

export const useDeleteProduct = () => {
    const api = useAxios()
    const queryClient = useQueryClient()
    return useMutation((productId) => api.delete(`/api/v1/products/${productId}/`),
        {
            onSuccess: () => {
                notification()
                queryClient.invalidateQueries('products')
                queryClient.invalidateQueries('product')
            }
        })
}

export const useUpdateProfile = () => {
    const api = useAxios()
    const queryClient = useQueryClient()
    return useMutation((data) => api.patch('/api/v1/users/me/', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['users', 'me'])
                notification('Your profile has been updated')
            }
        })
}

export const useUpdatePassword = () => {
    const api = useAxios()
    return useMutation((data) => api.post('/api/v1/users/set_password/', data),
        { onSuccess: () => notification('Your password has been updated') })
}

export const useFavouriteProduct = () => {
    const api = useAxios()
    const queryClient = useQueryClient()
    return useMutation((data) => api({
        url: `/api/v1/products/${data.id}/favourite/`,
        method: data.state ? 'DELETE' : 'POST'
    }).then(res => res.data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('products')
                queryClient.invalidateQueries('product')
            }
        })
}

export const usePromotions = () => {
    const api = useAxios()
    return useQuery(['promotions'],
        () => api.get('/api/v1/promotions').then(res => res.data))
}

export const useUserComments = (userId) => {
    const api = useAxios()
    return useQuery(['comments', userId],
        () => api.get(`/api/v1/users/${userId}/comments`).then(res => res.data))
}

export default axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost' })