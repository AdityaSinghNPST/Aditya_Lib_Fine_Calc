import { LogOut, Menu, User } from "lucide-react";

import { useAuth } from "../../context/AuthContext";


export default function Navbar({
    onMenuClick,
}) {

    const {
        user,
        logout,
    } = useAuth();


    function handleLogout() {

        logout();

    }


    return (

        <header
            className="
                h-16
                shrink-0
                border-b
                border-[#e5d7c5]
                bg-[#faf4ec]
                px-4
                sm:px-6
                flex
                items-center
                justify-between
            "
        >

            {/* ============================================
                LEFT
            ============================================ */}

            <div className="flex items-center gap-3">

                {/* Mobile menu button */}

                {onMenuClick && (

                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="
                            lg:hidden
                            w-9
                            h-9
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            text-[#6f5848]
                            hover:bg-[#eee3d5]
                            transition
                        "
                    >

                        <Menu className="w-5 h-5" />

                    </button>

                )}


                <div>

                    <p
                        className="
                            text-sm
                            font-semibold
                            text-[#2a1d15]
                        "
                    >
                        Library Management
                    </p>

                    <p
                        className="
                            hidden
                            sm:block
                            text-[11px]
                            text-[#8e7b6d]
                        "
                    >
                        Manage your library efficiently
                    </p>

                </div>

            </div>


            {/* ============================================
                RIGHT
            ============================================ */}

            <div
                className="
                    flex
                    items-center
                    gap-2
                    sm:gap-3
                "
            >

                {/* User information */}

                <div
                    className="
                        hidden
                        sm:flex
                        items-center
                        gap-2
                    "
                >

                    <div
                        className="
                            w-8
                            h-8
                            rounded-full
                            bg-[#ead8c4]
                            text-[#79512f]
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <User className="w-4 h-4" />

                    </div>


                    <div className="leading-tight">

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
                                text-[#8e7b6d]
                                uppercase
                            "
                        >
                            {user?.role || "USER"}
                        </p>

                    </div>

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
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-[#73533b]
                        hover:bg-[#eee3d5]
                        transition
                    "
                >

                    <LogOut className="w-4 h-4" />

                    <span className="hidden sm:inline">
                        Logout
                    </span>

                </button>

            </div>

        </header>
    );
}