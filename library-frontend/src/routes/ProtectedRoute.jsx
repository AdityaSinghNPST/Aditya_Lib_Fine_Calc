import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


// =========================================================
// PROTECTED ROUTE
// =========================================================

export default function ProtectedRoute({
    children,
    allowedRole,
}) {

    const {
        user,
        loading,
        isAuthenticated,
    } = useAuth();


    const location =
        useLocation();


    // =====================================================
    // WAIT FOR AUTH STATE
    // =====================================================

    if (loading) {

        return (
            <div
                className="
                    flex
                    min-h-screen
                    w-full
                    items-center
                    justify-center
                    bg-[#faf4ec]
                "
            >

                <div
                    className="
                        text-center
                    "
                >

                    <div
                        className="
                            mx-auto
                            mb-3
                            h-8
                            w-8
                            animate-spin
                            rounded-full
                            border-2
                            border-[#e5d7c5]
                            border-t-[#a8652c]
                        "
                    />

                    <p
                        className="
                            text-sm
                            text-[#735e50]
                        "
                    >
                        Checking authentication...
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // NOT LOGGED IN
    // =====================================================

    if (
        !isAuthenticated ||
        !user
    ) {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from:
                        location.pathname,
                }}
            />
        );
    }


    // =====================================================
    // ROLE CHECK
    // =====================================================

    if (
        allowedRole &&
        String(user.role).toUpperCase() !==
            String(allowedRole).toUpperCase()
    ) {

        /*
         * The user is authenticated but does not have
         * permission to access this route.
         *
         * Send them to their own dashboard.
         */

        const role =
            String(
                user.role || ""
            ).toUpperCase();


        if (role === "ADMIN") {

            return (
                <Navigate
                    to="/admin"
                    replace
                />
            );
        }


        if (
            role === "USER" ||
            role === "MEMBER"
        ) {

            return (
                <Navigate
                    to="/member"
                    replace
                />
            );
        }


        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // =====================================================
    // AUTHORIZED
    // =====================================================

    return children;
}