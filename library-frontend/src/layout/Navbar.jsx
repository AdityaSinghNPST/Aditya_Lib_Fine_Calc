import {
    BookOpen,
    LogOut,
    User,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";


export default function Navbar() {

    const {
        user,
        logout,
    } = useAuth();


    // =====================================================
    // LOGOUT
    // =====================================================

    function handleLogout() {

        logout();
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <header
            className="
                w-full
                border-b
                border-[#e5d7c5]
                bg-[#faf4ec]
            "
        >

            <div
                className="
                    mx-auto
                    flex
                    h-16
                    max-w-7xl
                    items-center
                    justify-between
                    px-4
                    sm:px-6
                    lg:px-8
                "
            >

                {/* =================================================
                    BRAND
                ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        gap-2.5
                    "
                >

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#a8652c]
                            text-white
                            shadow-sm
                        "
                    >

                        <BookOpen className="h-5 w-5" />

                    </div>


                    <div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                tracking-tight
                                text-[#2a1d15]
                            "
                        >
                            Aditya Library
                        </p>


                        <p
                            className="
                                hidden
                                text-[10px]
                                text-[#8e7b6d]
                                sm:block
                            "
                        >
                            Fine Calculator
                        </p>

                    </div>

                </div>


                {/* =================================================
                    USER SECTION
                ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    {/* User information */}

                    <div
                        className="
                            hidden
                            items-center
                            gap-2
                            sm:flex
                        "
                    >

                        <div
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-full
                                bg-[#ead8c4]
                                text-[#79512f]
                            "
                        >

                            <User className="h-4 w-4" />

                        </div>


                        <div>

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    text-[#3d2b1f]
                                "
                            >
                                {user?.name || "User"}
                            </p>


                            <p
                                className="
                                    text-[10px]
                                    uppercase
                                    tracking-wide
                                    text-[#8e7b6d]
                                "
                            >
                                {user?.role || "USER"}
                            </p>

                        </div>

                    </div>


                    {/* Mobile user name */}

                    <div
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            bg-[#ead8c4]
                            text-[#79512f]
                            sm:hidden
                        "
                    >

                        <User className="h-4 w-4" />

                    </div>


                    {/* Logout */}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-[#dfd0c0]
                            bg-white
                            px-3
                            py-2
                            text-xs
                            font-medium
                            text-[#6f4e37]
                            transition
                            hover:bg-[#f3e9dd]
                            active:scale-[0.98]
                        "
                    >

                        <LogOut className="h-4 w-4" />

                        <span className="hidden sm:inline">
                            Logout
                        </span>

                    </button>

                </div>

            </div>

        </header>
    );
}