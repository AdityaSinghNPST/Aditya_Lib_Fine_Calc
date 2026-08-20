import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";


// =========================================================
// AUTH CONTEXT
// =========================================================

const AuthContext = createContext(null);


// =========================================================
// AUTH PROVIDER
// =========================================================

export function AuthProvider({ children }) {

    // =====================================================
    // USER
    // =====================================================

    const [user, setUser] = useState(null);


    // =====================================================
    // LOADING
    // =====================================================

    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD AUTH DATA FROM LOCAL STORAGE
    // =====================================================

    useEffect(() => {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );


            const storedUser =
                localStorage.getItem(
                    "user"
                );


            if (
                token &&
                storedUser
            ) {

                setUser(
                    JSON.parse(
                        storedUser
                    )
                );

            } else {

                /*
                 * If either token or user is missing,
                 * remove both so we don't end up with
                 * inconsistent authentication state.
                 */

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                setUser(null);
            }

        } catch (error) {

            console.error(
                "Failed to restore authentication:",
                error
            );


            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );


            setUser(null);

        } finally {

            setLoading(false);
        }

    }, []);


    // =====================================================
    // LOGIN
    // =====================================================

    function login(
        loginResponse
    ) {

        if (!loginResponse) {

            throw new Error(
                "Invalid login response."
            );
        }


        /*
         * Backend LoginResponse:
         *
         * {
         *     token,
         *     userId,
         *     name,
         *     email,
         *     role
         * }
         */


        const token =
            loginResponse.token;


        if (!token) {

            throw new Error(
                "Login response does not contain a token."
            );
        }


        const loggedInUser = {

            id:
                loginResponse.userId,

            name:
                loginResponse.name,

            email:
                loginResponse.email,

            role:
                String(
                    loginResponse.role || ""
                ).toUpperCase(),

        };


        // =================================================
        // SAVE TOKEN
        // =================================================

        localStorage.setItem(
            "token",
            token
        );


        // =================================================
        // SAVE USER
        // =================================================

        localStorage.setItem(
            "user",
            JSON.stringify(
                loggedInUser
            )
        );


        // =================================================
        // UPDATE REACT STATE
        // =================================================

        setUser(
            loggedInUser
        );


        return loggedInUser;
    }


    // =====================================================
    // LOGOUT
    // =====================================================

    function logout() {

        localStorage.removeItem(
            "token"
        );


        localStorage.removeItem(
            "user"
        );


        setUser(null);
    }


    // =====================================================
    // AUTHENTICATION CHECK
    // =====================================================

    const isAuthenticated =
        Boolean(
            user &&
            localStorage.getItem(
                "token"
            )
        );


    // =====================================================
    // CONTEXT VALUE
    // =====================================================

    const value = {

        user,

        loading,

        isAuthenticated,

        login,

        logout,

    };


    // =====================================================
    // PROVIDER
    // =====================================================

    return (

        <AuthContext.Provider
            value={value}
        >

            {children}

        </AuthContext.Provider>

    );
}


// =========================================================
// USE AUTH
// =========================================================

export function useAuth() {

    const context =
        useContext(
            AuthContext
        );


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider."
        );
    }


    return context;
}