import {
    createContext,
    useContext,
    useState,
} from "react";

import api, {
    clearAuthSession,
    getStoredToken,
    getStoredUser,
    setAuthSession,
} from "../services/api";


// =========================================================
// AUTH CONTEXT
// =========================================================

const AuthContext = createContext(null);


// =========================================================
// AUTH PROVIDER
// =========================================================

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        getStoredToken()
    );

    const [user, setUser] = useState(
        getStoredUser()
    );


    // =====================================================
    // LOGIN
    // =====================================================

    async function login(email, password) {

        /*
         * Backend:
         *
         * POST /api/auth/login
         *
         * Request:
         * {
         *     email,
         *     password
         * }
         */
        const response =
            await api.auth.login({
                email,
                password,
            });


        /*
         * Backend LoginResponse is:
         *
         * {
         *     token,
         *     userId,
         *     name,
         *     email,
         *     role
         * }
         */

        const receivedToken =
            response.token;


        const receivedUser = {

            id:
                response.userId,

            name:
                response.name,

            email:
                response.email,

            role:
                response.role,

        };


        // Make sure backend returned authentication data.
        if (
            !receivedToken ||
            !receivedUser.role
        ) {

            throw new Error(
                "Invalid login response from server."
            );
        }


        // Save in React state.
        setToken(
            receivedToken
        );

        setUser(
            receivedUser
        );


        // Save so refresh doesn't log the user out.
        setAuthSession(
            receivedToken,
            receivedUser
        );


        // Return user to LoginView.
        return receivedUser;
    }


    // =====================================================
    // LOGOUT
    // =====================================================

    function logout() {

        setToken("");

        setUser(null);

        clearAuthSession();
    }


    // =====================================================
    // AUTHENTICATION STATUS
    // =====================================================

    const isAuthenticated =
        Boolean(
            token &&
            user
        );


    // =====================================================
    // CONTEXT VALUE
    // =====================================================

    const value = {

        token,

        user,

        isAuthenticated,

        login,

        logout,

    };


    return (

        <AuthContext.Provider
            value={value}
        >

            {children}

        </AuthContext.Provider>
    );
}


// =========================================================
// CUSTOM HOOK
// =========================================================

export function useAuth() {

    const context =
        useContext(AuthContext);


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }


    return context;
}