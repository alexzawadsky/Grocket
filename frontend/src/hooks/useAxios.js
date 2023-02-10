import axios from "axios";
import { useContext } from "react";
import dayjs from "dayjs";
import jwt_decode from "jwt-decode";
import AuthContext from "../contexts/AuthProvider";

const axiosApiInstance = () => {
    const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

    const axiosInstance = axios.create({
        headers: {
            Authorization: `Bearer ${authTokens?.access}`,
        }
    });

    axiosInstance.interceptors.request.use(async req => {
        const user = jwt_decode(authTokens.access);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

        if (!isExpired) return req;

        const response = await axios.post(`/jwt/api/token/refresh/`, {
            refresh: authTokens.refresh
        });

        localStorage.setItem("authTokens", JSON.stringify(response.data));

        setAuthTokens(response.data);
        setUser(jwt_decode(response.data.access));

        req.headers.Authorization = `Bearer ${response.data.access}`;
        return req;
    });

    return axiosInstance;
};

export default axiosApiInstance;