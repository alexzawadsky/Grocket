import { createContext, useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import jwt_decode from 'jwt-decode'
import api from "../api/api";

const AuthContext = createContext();

export default AuthContext

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate()

    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );

    const [user, setUser] = useState(() =>
        localStorage.getItem("authTokens")
            ? jwt_decode(localStorage.getItem("authTokens"))
            : null
    );

    const loginUser = async ({ email, password, redirectFrom }) => {
        try {
            const response = await api.post(
                '/api/v1/auth/jwt/create',
                JSON.stringify({ email, password }),
                {
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            )
            setAuthTokens(response.data);
            localStorage.setItem("authTokens", JSON.stringify(response.data));
            navigate(redirectFrom);
        } catch (err) {
            alert('err')
        }
    };

    const registerUser = ({ first_name, last_name, username, email, password, phone, country, avatar }) => {
        api.post(
            'api/v1/users',
            JSON.stringify({
                first_name,
                last_name,
                username,
                email,
                password,
                country,
                phone,
                avatar
            }),
            {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => console.log(res)).catch(err => alert('err'))
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        redirect("/login");
    };

    const contextData = {
        user,
        setUser,
        loginUser,
        registerUser,
        authTokens,
        setAuthTokens,
        logoutUser
    };

    useEffect(() => {
        if (authTokens) {
            setUser(jwt_decode(authTokens.access));
        }
    }, [authTokens]);

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}