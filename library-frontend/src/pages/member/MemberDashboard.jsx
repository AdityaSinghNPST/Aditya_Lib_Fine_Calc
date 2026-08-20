import { useEffect, useState } from "react";

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

import api from "../../services/api";

import { normalizeList } from "../../utils/lookups";


// =========================================================
// MEMBER DASHBOARD
// =========================================================

export default function MemberDashboard() {

    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();

    const [stats, setStats] = useState({
        availableBooks: 0,
        activeBorrowings: 0,
        totalFines: 0,
    });

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        async function loadStats() {

            if (!user?.id) {

                return;
            }

            try {

                setLoading(true);

                const [
                    booksData,
                    borrowingsData,
                    finesData,
                ] = await Promise.all([
                    api.books.getAll({ page: 0, size: 1000 }),
                    api.borrowings.getAll(),
                    api.fines.getByUserId(user.id),
                ]);

                const books =
                    normalizeList(booksData);

                const borrowings =
                    normalizeList(borrowingsData);

                const fines =
                    normalizeList(finesData);

                setStats({
                    availableBooks: books.filter(
                        (book) => book.available
                    ).length,
                    activeBorrowings: borrowings.filter(
                        (borrowing) =>
                            borrowing.status !== "RETURNED" &&
                            !borrowing.returnDate
                    ).length,
                    totalFines: fines.reduce(
                        (total, fine) =>
                            total + (Number(fine.amount) || 0),
                        0
                    ),
                });

            } catch (err) {

                console.error(
                    "Failed to load member stats:",
                    err
                );

            } finally {

                setLoading(false);
            }
        }

        loadStats();

    }, [user?.id]);


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
                bg-[#fff8f0]
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
                                text-[#ea580c]
                            "
                        >
                            Member Area
                        </p>


                        <h1
                            className="
                                text-3xl
                                font-semibold
                                text-[#292524]
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
                                text-[#78716c]
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
                            border-[#fdba74]
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-[#78716c]
                            transition
                            hover:bg-[#ffedd5]
                            hover:text-[#292524]
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
                    STATS
                ================================================= */}

                <div className="mb-8 grid gap-4 sm:grid-cols-3">

                    <div className="rounded-xl border border-[#fed7aa] bg-white p-5 shadow-sm">
                        <p className="text-sm text-[#78716c]">Available Books</p>
                        <p className="mt-2 text-2xl font-semibold text-[#292524]">
                            {loading ? "…" : stats.availableBooks}
                        </p>
                    </div>

                    <div className="rounded-xl border border-[#fed7aa] bg-white p-5 shadow-sm">
                        <p className="text-sm text-[#78716c]">Active Borrowings</p>
                        <p className="mt-2 text-2xl font-semibold text-[#292524]">
                            {loading ? "…" : stats.activeBorrowings}
                        </p>
                    </div>

                    <div className="rounded-xl border border-[#fed7aa] bg-white p-5 shadow-sm">
                        <p className="text-sm text-[#78716c]">Total Fines</p>
                        <p className="mt-2 text-2xl font-semibold text-[#292524]">
                            {loading
                                ? "…"
                                : new Intl.NumberFormat(
                                    "en-IN",
                                    {
                                        style: "currency",
                                        currency: "INR",
                                        maximumFractionDigits: 0,
                                    }
                                ).format(stats.totalFines)}
                        </p>
                    </div>

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
                            border-[#fed7aa]
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
                                    bg-[#ffedd5]
                                    text-[#ea580c]
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
                                    text-[#a8a29e]
                                    transition
                                    group-hover:translate-x-1
                                    group-hover:text-[#ea580c]
                                "
                            />

                        </div>


                        <h2
                            className="
                                mt-6
                                text-lg
                                font-semibold
                                text-[#292524]
                            "
                        >
                            Browse Books
                        </h2>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-[#78716c]
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
                            border-[#fed7aa]
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
                                    bg-[#ffedd5]
                                    text-[#ea580c]
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
                                    text-[#a8a29e]
                                    transition
                                    group-hover:translate-x-1
                                    group-hover:text-[#ea580c]
                                "
                            />

                        </div>


                        <h2
                            className="
                                mt-6
                                text-lg
                                font-semibold
                                text-[#292524]
                            "
                        >
                            My Borrowings
                        </h2>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-[#78716c]
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
                            border-[#fed7aa]
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
                                    bg-[#ffedd5]
                                    text-[#ea580c]
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
                                    text-[#a8a29e]
                                    transition
                                    group-hover:translate-x-1
                                    group-hover:text-[#ea580c]
                                "
                            />

                        </div>


                        <h2
                            className="
                                mt-6
                                text-lg
                                font-semibold
                                text-[#292524]
                            "
                        >
                            My Fines
                        </h2>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-[#78716c]
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
                        border-[#fed7aa]
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
                                    text-[#292524]
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
                                    text-[#78716c]
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
                                bg-[#ea580c]
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-[#c2410c]
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