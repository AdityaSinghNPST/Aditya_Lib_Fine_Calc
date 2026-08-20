import {
    BookOpen,
    Clock3,
    IndianRupee,
    ArrowRight,
    LogOut,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

import { useAuth } from "../../context/AuthContext";


// =========================================================
// MEMBER DASHBOARD
// =========================================================

export default function MemberDashboard() {

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
    // RENDER
    // =====================================================

    return (

        <div
            className="
                min-h-screen
                w-full
                bg-[#faf4ec]
            "
        >

            {/* =================================================
                NAVBAR
            ================================================= */}

            <Navbar />


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main
                className="
                    min-h-[calc(100vh-64px)]
                    w-full
                    px-4
                    py-8
                    sm:px-6
                    lg:px-8
                    xl:px-10
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        mb-8
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    "
                >

                    <div>

                        <p
                            className="
                                mb-1
                                text-xs
                                font-medium
                                uppercase
                                tracking-wider
                                text-[#a8652c]
                            "
                        >
                            Member Area
                        </p>


                        <h1
                            className="
                                text-3xl
                                font-semibold
                                text-[#2a1d15]
                            "
                        >
                            Welcome
                            {user?.name
                                ? `, ${user.name}`
                                : ""}
                        </h1>


                        <p
                            className="
                                mt-2
                                text-sm
                                text-[#735e50]
                            "
                        >
                            Manage your books, borrowings and fines.
                        </p>

                    </div>


                    {/* LOGOUT */}

                    <button
                        type="button"
                        onClick={
                            handleLogout
                        }
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            self-start
                            rounded-lg
                            border
                            border-[#ddd0c1]
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-[#735e50]
                            transition
                            hover:bg-[#f1e3d3]
                            hover:text-[#2a1d15]
                            sm:self-auto
                        "
                    >

                        <LogOut
                            className="h-4 w-4"
                        />

                        Logout

                    </button>

                </div>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <div
                    className="
                        grid
                        gap-5
                        sm:grid-cols-2
                        lg:grid-cols-3
                    "
                >

                    {/* =================================================
                        BROWSE BOOKS
                    ================================================= */}

                    <Link
                        to="/member/books"
                        className="
                            group
                            rounded-2xl
                            border
                            border-[#e5d7c5]
                            bg-white
                            p-6
                            shadow-sm
                            transition
                            hover:-translate-y-0.5
                            hover:shadow-md
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[#f1e3d3]
                                    text-[#a8652c]
                                "
                            >

                                <BookOpen
                                    className="h-6 w-6"
                                />

                            </div>


                            <ArrowRight
                                className="
                                    h-5
                                    w-5
                                    text-[#9a8778]
                                    transition
                                    group-hover:translate-x-1
                                    group-hover:text-[#a8652c]
                                "
                            />

                        </div>


                        <h2
                            className="
                                mt-6
                                text-lg
                                font-semibold
                                text-[#2a1d15]
                            "
                        >
                            Browse Books
                        </h2>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-[#735e50]
                            "
                        >
                            View available books and borrow
                            a book from the library.
                        </p>

                    </Link>


                    {/* =================================================
                        BORROWINGS
                    ================================================= */}

                    <Link
                        to="/member/borrowings"
                        className="
                            group
                            rounded-2xl
                            border
                            border-[#e5d7c5]
                            bg-white
                            p-6
                            shadow-sm
                            transition
                            hover:-translate-y-0.5
                            hover:shadow-md
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[#f1e3d3]
                                    text-[#a8652c]
                                "
                            >

                                <Clock3
                                    className="h-6 w-6"
                                />

                            </div>


                            <ArrowRight
                                className="
                                    h-5
                                    w-5
                                    text-[#9a8778]
                                    transition
                                    group-hover:translate-x-1
                                    group-hover:text-[#a8652c]
                                "
                            />

                        </div>


                        <h2
                            className="
                                mt-6
                                text-lg
                                font-semibold
                                text-[#2a1d15]
                            "
                        >
                            My Borrowings
                        </h2>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-[#735e50]
                            "
                        >
                            Check the books you currently
                            have borrowed and their due dates.
                        </p>

                    </Link>


                    {/* =================================================
                        FINES
                    ================================================= */}

                    <Link
                        to="/member/fines"
                        className="
                            group
                            rounded-2xl
                            border
                            border-[#e5d7c5]
                            bg-white
                            p-6
                            shadow-sm
                            transition
                            hover:-translate-y-0.5
                            hover:shadow-md
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[#f1e3d3]
                                    text-[#a8652c]
                                "
                            >

                                <IndianRupee
                                    className="h-6 w-6"
                                />

                            </div>


                            <ArrowRight
                                className="
                                    h-5
                                    w-5
                                    text-[#9a8778]
                                    transition
                                    group-hover:translate-x-1
                                    group-hover:text-[#a8652c]
                                "
                            />

                        </div>


                        <h2
                            className="
                                mt-6
                                text-lg
                                font-semibold
                                text-[#2a1d15]
                            "
                        >
                            My Fines
                        </h2>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-[#735e50]
                            "
                        >
                            View any automatically generated
                            fines for overdue books.
                        </p>

                    </Link>

                </div>


                {/* =================================================
                    INFORMATION SECTION
                ================================================= */}

                <div
                    className="
                        mt-8
                        rounded-2xl
                        border
                        border-[#e5d7c5]
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-5
                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    text-[#2a1d15]
                                "
                            >
                                Library Information
                            </h2>


                            <p
                                className="
                                    mt-2
                                    max-w-2xl
                                    text-sm
                                    leading-6
                                    text-[#735e50]
                                "
                            >
                                Borrow books, keep track of your
                                due dates, and return them on time
                                to avoid late fines.
                            </p>

                        </div>


                        <Link
                            to="/member/books"
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                bg-[#a8652c]
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-[#8f501e]
                            "
                        >

                            Browse Library

                            <ArrowRight
                                className="h-4 w-4"
                            />

                        </Link>

                    </div>

                </div>

            </main>

        </div>
    );
}