import axios from 'axios'
import { useContext } from 'react'
import dayjs from 'dayjs'
import jwt_decode from 'jwt-decode'
import AuthContext from '../contexts/AuthProvider'
import api from '../api/api'

const useAxios = () => {
    const { authTokens, setUser, setAuthTokens } = useContext(AuthContext)

    const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_URL || '',
        headers: {
            Authorization: authTokens ? `Bearer ${authTokens?.access}` : null,
            'Accept-Language': localStorage.getItem('i18nextLng') || 'en',
        },
    })

    axiosInstance.interceptors.request.use(async (req) => {
        if (!authTokens) return req
        const user = jwt_decode(authTokens.access)
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1

        if (!isExpired) return req
        const response = await api.post(`/api/v1/auth/jwt/refresh/`, {
            refresh: authTokens.refresh,
        })

        localStorage.setItem(
            'authTokens',
            JSON.stringify({
                access: response.data.access,
                refresh: authTokens.refresh,
            })
        )

        setAuthTokens({ ...authTokens, access: response.data.access })
        setUser(jwt_decode(response.data.access))

        req.headers.Authorization = `Bearer ${response.data.access}`
        return req
    })

    return axiosInstance
}

export default useAxios
