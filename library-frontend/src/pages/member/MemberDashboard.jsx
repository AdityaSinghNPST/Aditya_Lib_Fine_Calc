import { useEffect, useState } from "react";

import {
    BookOpen,
    ArrowLeftRight,
    IndianRupee,
    Clock,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";


// =========================================================
// MEMBER DASHBOARD
// =========================================================

export default function MemberDashboard() {

    // =====================================================
    // STATE
    // =====================================================

    const [borrowings, setBorrowings] =
        useState([]);

    const [fines, setFines] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD MEMBER DATA
    // =====================================================

    async function loadDashboard() {

        try {

            setLoading(true);

            setError("");


            /*
             * Load the logged-in member's borrowing records.
             */

            const borrowingData =
                await api.borrowings.getMy();


            /*
             * Load the logged-in member's fines.
             */

            const fineData =
                await api.fines.getMy();


            // ---------------------------------------------
            // Borrowings
            // ---------------------------------------------

            if (Array.isArray(borrowingData)) {

                setBorrowings(
                    borrowingData
                );

            } else if (
                borrowingData &&
                Array.isArray(
                    borrowingData.content
                )
            ) {

                setBorrowings(
                    borrowingData.content
                );

            } else {

                setBorrowings([]);
            }


            // ---------------------------------------------
            // Fines
            // ---------------------------------------------

            if (Array.isArray(fineData)) {

                setFines(
                    fineData
                );

            } else if (
                fineData &&
                Array.isArray(
                    fineData.content
                )
            ) {

                setFines(
                    fineData.content
                );

            } else {

                setFines([]);
            }

        } catch (err) {

            setError(
                err.message ||
                "Unable to load dashboard."
            );

        } finally {

            setLoading(false);
        }
    }


    useEffect(() => {

        loadDashboard();

    }, []);


    // =====================================================
    // CALCULATE DASHBOARD VALUES
    // =====================================================

    const activeBorrowings =
        borrowings.filter(
            (borrowing) => {

                const status =
                    String(
                        borrowing.status ||
                        borrowing.borrowingStatus ||
                        ""
                    ).toUpperCase();


                return (
                    status !== "RETURNED" &&
                    borrowing.returned !== true
                );
            }
        );


    const totalFines =
        fines.reduce(
            (total, fine) => {

                const amount =
                    fine.amount ??
                    fine.fineAmount ??
                    fine.totalFine ??
                    0;


                return (
                    total +
                    Number(amount)
                );
            },
            0
        );


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div
                className="
                    min-h-screen
                    bg-[#faf4ec]
                "
            >

                <Navbar />


                <main
                    className="
                        mx-auto
                        flex
                        min-h-[70vh]
                        max-w-7xl
                        items-center
                        justify-center
                        px-4
                    "
                >

                    <p
                        className="
                            text-sm
                            text-[#735e50]
                        "
                    >
                        Loading your dashboard...
                    </p>

                </main>

            </div>
        );
    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div
            className="
                min-h-screen
                bg-[#faf4ec]
            "
        >

            <Navbar />


            <main
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    py-8
                    sm:px-6
                    lg:px-8
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-8">

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
                            text-2xl
                            font-semibold
                            text-[#2a1d15]
                        "
                    >
                        My Library
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-[#735e50]
                        "
                    >
                        View your books, borrowings and fines.
                    </p>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div
                        className="
                            mb-5
                            rounded-lg
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-700
                        "
                    >
                        {error}
                    </div>

                )}


                {/* =================================================
                    STAT CARDS
                ================================================= */}

                <div
                    className="
                        grid
                        gap-4
                        sm:grid-cols-2
                        lg:grid-cols-4
                    "
                >

                    {/* AVAILABLE BOOKS */}

                    <Link
                        to="/member/books"
                        className="
                            rounded-xl
                            border
                            border-[#e5d7c5]
                            bg-white
                            p-5
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

                            <div>

                                <p
                                    className="
                                        text-sm
                                        font-medium
                                        text-[#735e50]
                                    "
                                >
                                    Browse Books
                                </p>


                                <p
                                    className="
                                        mt-2
                                        text-lg
                                        font-semibold
                                        text-[#2a1d15]
                                    "
                                >
                                    Explore
                                </p>

                            </div>


                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-[#f1e3d3]
                                    text-[#a8652c]
                                "
                            >

                                <BookOpen
                                    className="h-5 w-5"
                                />

                            </div>

                        </div>

                    </Link>


                    {/* ACTIVE BORROWINGS */}

                    <Link
                        to="/member/borrowings"
                        className="
                            rounded-xl
                            border
                            border-[#e5d7c5]
                            bg-white
                            p-5
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

                            <div>

                                <p
                                    className="
                                        text-sm
                                        font-medium
                                        text-[#735e50]
                                    "
                                >
                                    Active Borrowings
                                </p>


                                <p
                                    className="
                                        mt-2
                                        text-3xl
                                        font-semibold
                                        text-[#2a1d15]
                                    "
                                >
                                    {
                                        activeBorrowings.length
                                    }
                                </p>

                            </div>


                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-[#f1e3d3]
                                    text-[#a8652c]
                                "
                            >

                                <ArrowLeftRight
                                    className="h-5 w-5"
                                />

                            </div>

                        </div>

                    </Link>


                    {/* FINES */}

                    <Link
                        to="/member/fines"
                        className="
                            rounded-xl
                            border
                            border-[#e5d7c5]
                            bg-white
                            p-5
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

                            <div>

                                <p
                                    className="
                                        text-sm
                                        font-medium
                                        text-[#735e50]
                                    "
                                >
                                    Total Fines
                                </p>


                                <p
                                    className="
                                        mt-2
                                        text-3xl
                                        font-semibold
                                        text-[#a8652c]
                                    "
                                >
                                    ₹
                                    {totalFines.toFixed(2)}
                                </p>

                            </div>


                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-[#f1e3d3]
                                    text-[#a8652c]
                                "
                            >

                                <IndianRupee
                                    className="h-5 w-5"
                                />

                            </div>

                        </div>

                    </Link>


                    {/* DUE STATUS */}

                    <div
                        className="
                            rounded-xl
                            border
                            border-[#e5d7c5]
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-sm
                                        font-medium
                                        text-[#735e50]
                                    "
                                >
                                    Library Status
                                </p>


                                <p
                                    className="
                                        mt-2
                                        text-lg
                                        font-semibold
                                        text-[#2a1d15]
                                    "
                                >
                                    {activeBorrowings.length > 0
                                        ? "Books borrowed"
                                        : "No active books"}
                                </p>

                            </div>


                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-[#f1e3d3]
                                    text-[#a8652c]
                                "
                            >

                                <Clock
                                    className="h-5 w-5"
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <section className="mt-8">

                    <div className="mb-4">

                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-[#2a1d15]
                            "
                        >
                            Quick actions
                        </h2>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-[#735e50]
                            "
                        >
                            Manage your library activity.
                        </p>

                    </div>


                    <div
                        className="
                            grid
                            gap-4
                            sm:grid-cols-3
                        "
                    >

                        <Link
                            to="/member/books"
                            className="
                                rounded-xl
                                border
                                border-[#e5d7c5]
                                bg-white
                                p-5
                                shadow-sm
                                transition
                                hover:-translate-y-0.5
                                hover:bg-[#fffaf5]
                                hover:shadow-md
                            "
                        >

                            <BookOpen
                                className="
                                    mb-3
                                    h-5
                                    w-5
                                    text-[#a8652c]
                                "
                            />


                            <h3
                                className="
                                    font-medium
                                    text-[#2a1d15]
                                "
                            >
                                Browse Books
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-[#735e50]
                                "
                            >
                                Find available books and borrow one.
                            </p>

                        </Link>


                        <Link
                            to="/member/borrowings"
                            className="
                                rounded-xl
                                border
                                border-[#e5d7c5]
                                bg-white
                                p-5
                                shadow-sm
                                transition
                                hover:-translate-y-0.5
                                hover:bg-[#fffaf5]
                                hover:shadow-md
                            "
                        >

                            <ArrowLeftRight
                                className="
                                    mb-3
                                    h-5
                                    w-5
                                    text-[#a8652c]
                                "
                            />


                            <h3
                                className="
                                    font-medium
                                    text-[#2a1d15]
                                "
                            >
                                My Borrowings
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-[#735e50]
                                "
                            >
                                See your borrowed books and return them.
                            </p>

                        </Link>


                        <Link
                            to="/member/fines"
                            className="
                                rounded-xl
                                border
                                border-[#e5d7c5]
                                bg-white
                                p-5
                                shadow-sm
                                transition
                                hover:-translate-y-0.5
                                hover:bg-[#fffaf5]
                                hover:shadow-md
                            "
                        >

                            <IndianRupee
                                className="
                                    mb-3
                                    h-5
                                    w-5
                                    text-[#a8652c]
                                "
                            />


                            <h3
                                className="
                                    font-medium
                                    text-[#2a1d15]
                                "
                            >
                                My Fines
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-[#735e50]
                                "
                            >
                                Check fines generated for late returns.
                            </p>

                        </Link>

                    </div>

                </section>

            </main>

        </div>
    );
}