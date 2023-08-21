import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import useAxios from '../hooks/useAxios'
import { notification, getLastRoute } from '../utils'
import { useContext } from 'react'
import AuthContext from '../contexts/AuthProvider'
import localization from '../assets/json/localization.json'

const limit = 12

export const useProducts = (queryParams) => {
    const api = useAxios()
    const queryParamsObject = Object.fromEntries(queryParams)
    return useQuery(
        ['products', queryParamsObject],
        () =>
            api
                .get(`/api/v1/products`, {
                    params: Object.assign({}, queryParamsObject, { limit }),
                })
                .then((res) => res.data),
        { keepPreviousData: false }
    )
}

export const useProduct = (productId) => {
    const api = useAxios()
    return useQuery(['product', productId], () =>
        api.get(`/api/v1/products/${productId}`).then((res) => res.data)
    )
}

export const useAddProduct = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const api = useAxios()
    return useMutation((product) => api.post('/api/v1/products/', product), {
        onSuccess: (res) => {
            navigate(`/products/${res?.data?.slug}/promote`)
            window.scrollTo(0, 0)
            notification(res?.data?.message, 5000)
            queryClient.invalidateQueries('products')
        },
    })
}

export const useUpdateProduct = () => {
    const api = useAxios()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { t } = useTranslation()
    return useMutation(
        (data) => api.patch(`/api/v1/products/${data.id}/`, data.body),
        {
            onSuccess: (res) => {
                notification(res?.data?.message)
                navigate(`/products/${res?.data?.slug}`)
                queryClient.invalidateQueries('product')
                queryClient.invalidateQueries('products')
            },
        }
    )
}

export const useUserProducts = (userId, queryParams) => {
    const api = useAxios()
    return useQuery(['products', userId, queryParams], () =>
        api
            .get(`/api/v1/users/${userId}/products`, {
                params: { ...queryParams, limit: limit },
            })
            .then((res) => res.data)
    )
}

export const useCategories = (queryParams) => {
    const api = useAxios()
    return useQuery(['categories', queryParams], () =>
        api
            .get(`/api/v1/categories`, { params: { ...queryParams } })
            .then((res) => res.data)
    )
}

export const useProfile = (userId) => {
    if (!userId) return {}
    const api = useAxios()
    return useQuery(['users', userId], () =>
        api.get(`/api/v1/users/${userId}`).then((res) => res.data)
    )
}

export const useSellProduct = () => {
    const api = useAxios()
    const queryClient = useQueryClient()
    return useMutation(
        (data) =>
            api({
                url: `/api/v1/products/${data.id}/sell/`,
                method: data.state ? 'delete' : 'post',
            }),
        {
            onSuccess: (res) => {
                notification(res.data?.message)
                queryClient.invalidateQueries('products')
                queryClient.invalidateQueries('product')
            },
        }
    )
}

export const useArchiveProduct = () => {
    const api = useAxios()
    const queryClient = useQueryClient()
    return useMutation(
        (data) =>
            api({
                url: `/api/v1/products/${data.id}/archive/`,
                method: data.state ? 'delete' : 'post',
            }),
        {
            onSuccess: (res) => {
                notification(res.data?.message)
                queryClient.invalidateQueries('products')
                queryClient.invalidateQueries('product')
            },
        }
    )
}

export const useDeleteProduct = () => {
    const api = useAxios()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation(
        (productId) => api.delete(`/api/v1/products/${productId}/`),
        {
            onSuccess: (res) => {
                notification(res?.data?.message)
                if (window.location.pathname.split('/')[1] === 'products') {
                    window.scrollTo(0, 0)
                    navigate('/users/me')
                }
                queryClient.invalidateQueries('products')
                queryClient.invalidateQueries('product')
            },
        }
    )
}

export const useUpdateProfile = () => {
    const api = useAxios()
    const queryClient = useQueryClient()
    return useMutation((data) => api.patch('/api/v1/users/me/', data), {
        onSuccess: (res) => {
            queryClient.invalidateQueries(['users', 'me'])
            notification(res?.data?.message)
        },
    })
}

export const useUpdatePassword = () => {
    const api = useAxios()
    return useMutation(
        (data) => api.post('/api/v1/users/set_password/', data),
        {
            onSuccess: (res) => notification(res?.data?.message),
        }
    )
}

export const useDeleteProfile = () => {
    const api = useAxios()
    const { logoutUser } = useContext(AuthContext)
    return useMutation((data) => api.delete('/api/v1/users/me', data), {
        onSuccess: (res) => {
            logoutUser()
            notification(res?.data?.message)
        },
    })
}

export const useFavouriteProduct = () => {
    const api = useAxios()
    const queryClient = useQueryClient()
    return useMutation(
        (data) =>
            api({
                url: `/api/v1/products/${data.id}/favourite/`,
                method: data.state ? 'DELETE' : 'POST',
            }).then((res) => res.data),
        {
            onSuccess: (res) => {
                notification(res?.message)
                queryClient.invalidateQueries('products')
                queryClient.invalidateQueries('product')
            },
        }
    )
}

export const usePromotions = () => {
    const api = useAxios()
    return useQuery(['promotions'], () =>
        api.get('/api/v1/promotions').then((res) => res.data)
    )
}

export const usePromoteProduct = () => {
    const api = useAxios()
    const navigate = useNavigate()
    return useMutation(
        (data) =>
            api
                .post(`/api/v1/stripe/${data.id}/`, {
                    promotions: data.promotions,
                })
                .then((res) => res.data),
        { onSuccess: (res) => (window.location.href = res) }
    )
}

export const useUserComments = (userId, page) => {
    const api = useAxios()
    return useQuery(
        ['comments', userId, page],
        () =>
            api
                .get(`/api/v1/users/${userId}/comments`, { params: { page } })
                .then((res) => res.data),
        { keepPreviousData: true }
    )
}

export const useCommentStatuses = () => {
    const api = useAxios()
    return useQuery(['comment_statuses'], () =>
        api.get('/api/v1/comments/statuses').then((res) => res.data)
    )
}

export const useUploadComment = () => {
    const api = useAxios()
    const queryClient = useQueryClient()
    const { t } = useTranslation()
    const navigate = useNavigate()
    return useMutation((data) => api.post('/api/v1/comments/', data), {
        onSuccess: (res) => {
            queryClient.invalidateQueries('comments')
            notification(res.data?.message)
            navigate(getLastRoute())
        },
    })
}

export const useAddReply = () => {
    const api = useAxios()
    const queryClient = useQueryClient()
    const { t } = useTranslation()
    return useMutation(
        (data) =>
            api.post(`/api/v1/comments/${data.commentId}/reply/`, {
                text: data?.text,
            }),
        {
            onSuccess: (res) => {
                queryClient.invalidateQueries('comments')
                notification(res.data?.message)
            },
        }
    )
}

export const useDeleteComment = () => {
    const api = useAxios()
    const queryClient = useQueryClient()
    const { t } = useTranslation()
    return useMutation(
        (commentId) => api.delete(`/api/v1/comments/${commentId}/`),
        {
            onSuccess: (res) => {
                queryClient.invalidateQueries('comments')
                notification(res.data?.message)
            },
        }
    )
}

export const useDeleteCommentReply = () => {
    const api = useAxios()
    const queryClient = useQueryClient()
    const { t } = useTranslation()
    return useMutation(
        (replyId) => api.delete(`/api/v1/comments/replies/${replyId}/`),
        {
            onSuccess: (res) => {
                queryClient.invalidateQueries('comments')
                notification(res.data?.message)
            },
        }
    )
}

export const useExchangeRates = () => {
    const api = useAxios()
    return useQuery(['exchangeRages'], () =>
        api.get('/api/v1/exchange').then((res) => res.data)
    )
}

export const useTranslateText = (text, translated) => {
    const { i18n } = useTranslation()
    const targetLang =
        localization[i18n.resolvedLanguage.toUpperCase()].codeForTimeStamp
    const api = useAxios()
    return useQuery(
        ['translate', text, translated, targetLang],
        translated
            ? () =>
                api
                    .post('https://translate.terraprint.co/translate', {
                        q: text,
                        source: 'auto',
                        target: targetLang,
                        format: 'html',
                    })
                    .then((res) => res.data?.translatedText)
            : () => text
    )
}

export const useGetChatMutation = () => {
    const api = useAxios()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    return useMutation(
        (productId) => api.get(`/api/v1/messenger/products/${productId}/chat/`),
        {
            onSuccess: (res) => {
                queryClient.invalidateQueries('messenger')
                navigate(`/messenger/${res.data?.id}`)
            }
        }
    )
}

export default axios.create({ baseURL: import.meta.env.VITE_API_URL || '' })
