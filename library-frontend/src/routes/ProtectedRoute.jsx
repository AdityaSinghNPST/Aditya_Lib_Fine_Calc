import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


export default function ProtectedRoute({
    children,
    allowedRole,
}) {

    const {
        user,
        isAuthenticated,
    } = useAuth();

    const location = useLocation();


    // =====================================================
    // USER NOT LOGGED IN
    // =====================================================

    if (!isAuthenticated || !user) {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );
    }


    // =====================================================
    // WRONG ROLE
    // =====================================================

    if (
        allowedRole &&
        user.role !== allowedRole
    ) {

        /*
         * Admin should stay inside Admin pages.
         */
        if (user.role === "ADMIN") {

            return (
                <Navigate
                    to="/admin"
                    replace
                />
            );
        }


        /*
         * Normal member should stay inside
         * Member pages.
         */
        return (
            <Navigate
                to="/member"
                replace
            />
        );
    }


    // =====================================================
    // AUTHORIZED
    // =====================================================

    return children;
}