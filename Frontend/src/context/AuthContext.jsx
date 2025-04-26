
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL } from "../utils/constants";


const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken') || null);
    const [loading, setLoading] = useState(true); 


    const storeToken = useCallback((newToken) => {
        if (newToken) {
            localStorage.setItem('authToken', newToken);
            setToken(newToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        } else {
            localStorage.removeItem('authToken');
            setToken(null);
            delete axios.defaults.headers.common['Authorization'];
        }
    }, []);


     // Function to fetch user data based on token (optional but good)
     const fetchUser = useCallback(async (currentToken) => {
        if (!currentToken) {
            setUser(null);
            setLoading(false);
            return;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
        try {
            const response = await axios.get(BASE_URL + "/api/auth/me");
            const storedUser = localStorage.getItem('authUser');
             if (storedUser) {
                 setUser(JSON.parse(storedUser));
             } else {
                 console.warn("No stored user found, ideally fetch from backend.");
                 setUser(null);
                 storeToken(null);
             }

        } catch (error) {
            console.error("Error validating token/fetching user:", error);
            storeToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [storeToken]);


    useEffect(() => {
        const initialToken = localStorage.getItem('authToken');
        if (initialToken) {
            fetchUser(initialToken);
        } else {
            setLoading(false);
        }
    }, [fetchUser]);


    // Login Function
    const login = async (email, password) => {
        try {
            const response = await axios.post(BASE_URL + '/api/auth/login', { email, password });
            if (response.data) {
                storeToken(response.data.token);
                setUser(response.data.user);
                localStorage.setItem('authUser', JSON.stringify(response.data.user));
                return { success: true };
            } else {
                return { success: false, message: response.data.message || 'Login failed' };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: error.response?.data?.message || error.message || 'Login failed' };
        }
    };

    // Register Function
    const register = async (name, email, password) => {
        try {
            const response = await axios.post(BASE_URL + '/api/auth/register', { name, email, password });
             if (response.data) {
                storeToken(response.data.token);
                setUser(response.data.user); // Store user data
                localStorage.setItem('authUser', JSON.stringify(response.data.user));
                return { success: true };
            } else {
                return { success: false, message: response.data.message || 'Registration failed' };
            }
        } catch (error) {
             console.error("Registration error:", error);
             return { success: false, message: error.response?.data?.message || error.message || 'Registration failed' };
        }
    };


    // Logout Function
    const logout = () => {
        storeToken(null);
        setUser(null);
        localStorage.removeItem('authUser');
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;
};