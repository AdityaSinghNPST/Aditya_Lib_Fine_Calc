import {
    BookOpen,
    LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


// =========================================================
// NAVBAR
// =========================================================

export default function Navbar() {

    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();


    // =====================================================
    // LOGOUT
    // =====================================================

    function handleLogout() {

        logout();

        navigate(
            "/login",
            {
                replace: true,
            }
        );
    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    function goToDashboard() {

        const role =
            String(
                user?.role || ""
            ).toUpperCase();


        if (role === "ADMIN") {

            navigate("/admin");

            return;
        }


        if (
            role === "USER" ||
            role === "MEMBER"
        ) {

            navigate("/member");

            return;
        }


        navigate("/login");
    }


    // =====================================================
    // USER INFORMATION
    // =====================================================

    const displayName =
        user?.name ||
        user?.email ||
        "User";


    const displayRole =
        String(
            user?.role || "USER"
        ).toUpperCase();


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <header
            className="
                sticky
                top-0
                z-40
                w-full
                border-b
                border-[#fed7aa]
                bg-[#fff8f0]/95
                backdrop-blur-md
                transition-all
                duration-300
            "
        >

            <div
                className="
                    flex
                    h-16
                    w-full
                    items-center
                    justify-between
                    px-4
                    sm:px-6
                    lg:px-8
                    xl:px-10
                "
            >

                {/* =================================================
                    BRAND
                ================================================= */}

                <button
                    type="button"
                    onClick={goToDashboard}
                    className="
                        group
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        text-left
                        outline-none
                    "
                >

                    {/* LOGO */}

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#ea580c]
                            text-white
                            shadow-sm
                            transition-all
                            duration-300
                            group-hover:scale-105
                            group-hover:shadow-md
                        "
                    >

                        <BookOpen
                            className="
                                h-5
                                w-5
                                transition-transform
                                duration-300
                                group-hover:rotate-[-5deg]
                            "
                        />

                    </div>


                    {/* BRAND TEXT */}

                    <div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-[#292524]
                                transition-colors
                                duration-300
                                group-hover:text-[#ea580c]
                            "
                        >
                            Library Fine Calculator
                        </p>


                        <p
                            className="
                                text-[11px]
                                text-[#a8a29e]
                            "
                        >
                            Fine & Borrowing Management
                        </p>

                    </div>

                </button>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        gap-4
                    "
                >

                    {/* =================================================
                        USER DETAILS
                        NO USER ICON
                    ================================================= */}

                    <div
                        className="
                            hidden
                            text-right
                            sm:block
                        "
                    >

                        <p
                            className="
                                max-w-[180px]
                                truncate
                                text-sm
                                font-medium
                                text-[#292524]
                            "
                        >
                            {displayName}
                        </p>


                        <p
                            className="
                                text-[11px]
                                font-medium
                                text-[#a8a29e]
                            "
                        >
                            {displayRole}
                        </p>

                    </div>


                    {/* =================================================
                        LOGOUT
                    ================================================= */}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="
                            group
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-[#fdba74]
                            bg-white
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-[#78716c]
                            shadow-sm
                            transition-all
                            duration-300
                            hover:-translate-y-0.5
                            hover:border-[#fbbf24]
                            hover:bg-[#ffedd5]
                            hover:text-[#292524]
                            hover:shadow-md
                            active:translate-y-0
                        "
                    >

                        <LogOut
                            className="
                                h-4
                                w-4
                                transition-transform
                                duration-300
                                group-hover:translate-x-0.5
                            "
                        />


                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </div>

        </header>
    );
}