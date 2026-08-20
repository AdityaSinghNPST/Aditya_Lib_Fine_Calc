import { useEffect, useState } from "react";

import {
    ArrowLeftRight,
    RotateCcw,
    Search,
    X,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";


// =========================================================
// ADMIN BORROWINGS
// =========================================================

export default function AdminBorrowings() {

    // =====================================================
    // STATE
    // =====================================================

    const [borrowings, setBorrowings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [returningId, setReturningId] =
        useState(null);


    // =====================================================
    // LOAD BORROWINGS
    // =====================================================

    async function loadBorrowings() {

        try {

            setLoading(true);

            setError("");

            const data =
                await api.borrowings.getAll();


            /*
             * The backend may return either
             * a direct array or a paginated object.
             */

            if (Array.isArray(data)) {

                setBorrowings(data);

            } else if (
                data &&
                Array.isArray(data.content)
            ) {

                setBorrowings(data.content);

            } else {

                setBorrowings([]);
            }

        } catch (err) {

            setError(
                err.message ||
                "Unable to load borrowing records."
            );

        } finally {

            setLoading(false);
        }
    }


    useEffect(() => {

        loadBorrowings();

    }, []);


    // =====================================================
    // RETURN BOOK
    // =====================================================

    async function handleReturn(borrowing) {

        const confirmed =
            window.confirm(
                "Are you sure you want to mark this book as returned?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setReturningId(
                borrowing.id
            );

            setError("");


            await api.borrowings.returnBook(
                borrowing.id
            );


            /*
             * Reload because the backend may have:
             *
             * - changed borrowing status
             * - changed book availability
             * - calculated a fine
             */

            await loadBorrowings();

        } catch (err) {

            setError(
                err.message ||
                "Unable to return the book."
            );

        } finally {

            setReturningId(null);
        }
    }


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredBorrowings =
        borrowings.filter((borrowing) => {

            const value =
                search
                    .toLowerCase()
                    .trim();


            if (!value) {
                return true;
            }


            /*
             * We support different possible backend
             * property names so the UI remains flexible.
             */

            const bookTitle =
                borrowing.book?.title ||
                borrowing.bookTitle ||
                "";

            const userName =
                borrowing.user?.name ||
                borrowing.userName ||
                "";

            const email =
                borrowing.user?.email ||
                borrowing.userEmail ||
                "";


            return (

                String(bookTitle)
                    .toLowerCase()
                    .includes(value)

                ||

                String(userName)
                    .toLowerCase()
                    .includes(value)

                ||

                String(email)
                    .toLowerCase()
                    .includes(value)

                ||

                String(borrowing.id || "")
                    .toLowerCase()
                    .includes(value)

            );
        });


    // =====================================================
    // STATUS
    // =====================================================

    function getStatus(borrowing) {

        const status =
            String(
                borrowing.status ||
                borrowing.borrowingStatus ||
                ""
            ).toUpperCase();


        if (
            status === "RETURNED" ||
            borrowing.returned === true
        ) {

            return "RETURNED";
        }


        return "BORROWED";
    }


    // =====================================================
    // DISPLAY HELPERS
    // =====================================================

    function getBookTitle(borrowing) {

        return (
            borrowing.book?.title ||
            borrowing.bookTitle ||
            "Unknown book"
        );
    }


    function getUserName(borrowing) {

        return (
            borrowing.user?.name ||
            borrowing.userName ||
            "Unknown member"
        );
    }


    function getUserEmail(borrowing) {

        return (
            borrowing.user?.email ||
            borrowing.userEmail ||
            "—"
        );
    }


    function getBorrowDate(borrowing) {

        return (
            borrowing.borrowedAt ||
            borrowing.borrowDate ||
            borrowing.borrowedDate ||
            borrowing.createdAt ||
            "—"
        );
    }


    function getReturnDate(borrowing) {

        return (
            borrowing.returnedAt ||
            borrowing.returnDate ||
            "—"
        );
    }


    function formatDate(value) {

        if (!value || value === "—") {

            return "—";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return value;
        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
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

                <div className="mb-6">

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
                        Administration
                    </p>


                    <h1
                        className="
                            text-2xl
                            font-semibold
                            text-[#2a1d15]
                        "
                    >
                        Borrowings
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-[#735e50]
                        "
                    >
                        View active borrowing records and
                        manage book returns.
                    </p>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div
                        className="
                            mb-5
                            flex
                            items-center
                            justify-between
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

                        <span>
                            {error}
                        </span>


                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                        >

                            <X className="h-4 w-4" />

                        </button>

                    </div>

                )}


                {/* =================================================
                    SEARCH
                ================================================= */}

                <div
                    className="
                        mb-5
                        rounded-xl
                        border
                        border-[#e5d7c5]
                        bg-white
                        p-4
                        shadow-sm
                    "
                >

                    <div className="relative">

                        <Search
                            className="
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-[#9a8778]
                            "
                        />


                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search by member, email or book..."
                            className="
                                w-full
                                rounded-lg
                                border
                                border-[#ddd0c1]
                                bg-[#fffdfb]
                                py-2.5
                                pl-9
                                pr-3
                                text-sm
                                outline-none
                                focus:border-[#a8652c]
                            "
                        />

                    </div>

                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                <div
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#e5d7c5]
                        bg-white
                        shadow-sm
                    "
                >

                    {loading ? (

                        <div
                            className="
                                flex
                                min-h-64
                                items-center
                                justify-center
                                text-sm
                                text-[#735e50]
                            "
                        >
                            Loading borrowing records...
                        </div>

                    ) : filteredBorrowings.length === 0 ? (

                        <div
                            className="
                                flex
                                min-h-64
                                flex-col
                                items-center
                                justify-center
                            "
                        >

                            <div
                                className="
                                    mb-3
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#f1e3d3]
                                    text-[#a8652c]
                                "
                            >

                                <ArrowLeftRight
                                    className="h-5 w-5"
                                />

                            </div>


                            <h3
                                className="
                                    font-medium
                                    text-[#2a1d15]
                                "
                            >
                                No borrowing records found
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-[#9a8778]
                                "
                            >
                                Borrowing activity will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="min-w-full">

                                <thead
                                    className="
                                        border-b
                                        border-[#e5d7c5]
                                        bg-[#fcf8f3]
                                    "
                                >

                                    <tr>

                                        <th
                                            className="
                                                px-5
                                                py-3
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-[#735e50]
                                            "
                                        >
                                            Member
                                        </th>


                                        <th
                                            className="
                                                px-5
                                                py-3
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-[#735e50]
                                            "
                                        >
                                            Book
                                        </th>


                                        <th
                                            className="
                                                px-5
                                                py-3
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-[#735e50]
                                            "
                                        >
                                            Borrowed
                                        </th>


                                        <th
                                            className="
                                                px-5
                                                py-3
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-[#735e50]
                                            "
                                        >
                                            Returned
                                        </th>


                                        <th
                                            className="
                                                px-5
                                                py-3
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-[#735e50]
                                            "
                                        >
                                            Status
                                        </th>


                                        <th
                                            className="
                                                px-5
                                                py-3
                                                text-right
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-[#735e50]
                                            "
                                        >
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredBorrowings.map(
                                        (borrowing) => {

                                            const status =
                                                getStatus(
                                                    borrowing
                                                );


                                            const returned =
                                                status ===
                                                "RETURNED";


                                            return (

                                                <tr
                                                    key={
                                                        borrowing.id
                                                    }
                                                    className="
                                                        border-b
                                                        border-[#eee5dc]
                                                        last:border-0
                                                        hover:bg-[#fffaf5]
                                                    "
                                                >

                                                    {/* MEMBER */}

                                                    <td className="px-5 py-4">

                                                        <div>

                                                            <p
                                                                className="
                                                                    text-sm
                                                                    font-medium
                                                                    text-[#2a1d15]
                                                                "
                                                            >
                                                                {
                                                                    getUserName(
                                                                        borrowing
                                                                    )
                                                                }
                                                            </p>


                                                            <p
                                                                className="
                                                                    mt-0.5
                                                                    text-xs
                                                                    text-[#9a8778]
                                                                "
                                                            >
                                                                {
                                                                    getUserEmail(
                                                                        borrowing
                                                                    )
                                                                }
                                                            </p>

                                                        </div>

                                                    </td>


                                                    {/* BOOK */}

                                                    <td className="px-5 py-4">

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    flex
                                                                    h-8
                                                                    w-8
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    bg-[#f1e3d3]
                                                                    text-[#a8652c]
                                                                "
                                                            >

                                                                <ArrowLeftRight
                                                                    className="h-4 w-4"
                                                                />

                                                            </div>


                                                            <div>

                                                                <p
                                                                    className="
                                                                        text-sm
                                                                        font-medium
                                                                        text-[#2a1d15]
                                                                    "
                                                                >
                                                                    {
                                                                        getBookTitle(
                                                                            borrowing
                                                                        )
                                                                    }
                                                                </p>


                                                                <p
                                                                    className="
                                                                        text-xs
                                                                        text-[#9a8778]
                                                                    "
                                                                >
                                                                    ID: {
                                                                        borrowing.id
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* BORROW DATE */}

                                                    <td
                                                        className="
                                                            px-5
                                                            py-4
                                                            text-sm
                                                            text-[#735e50]
                                                        "
                                                    >
                                                        {
                                                            formatDate(
                                                                getBorrowDate(
                                                                    borrowing
                                                                )
                                                            )
                                                        }
                                                    </td>


                                                    {/* RETURN DATE */}

                                                    <td
                                                        className="
                                                            px-5
                                                            py-4
                                                            text-sm
                                                            text-[#735e50]
                                                        "
                                                    >
                                                        {
                                                            formatDate(
                                                                getReturnDate(
                                                                    borrowing
                                                                )
                                                            )
                                                        }
                                                    </td>


                                                    {/* STATUS */}

                                                    <td className="px-5 py-4">

                                                        {returned ? (

                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    rounded-full
                                                                    bg-green-50
                                                                    px-2.5
                                                                    py-1
                                                                    text-xs
                                                                    font-medium
                                                                    text-green-700
                                                                "
                                                            >
                                                                Returned
                                                            </span>

                                                        ) : (

                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    rounded-full
                                                                    bg-amber-50
                                                                    px-2.5
                                                                    py-1
                                                                    text-xs
                                                                    font-medium
                                                                    text-amber-700
                                                                "
                                                            >
                                                                Borrowed
                                                            </span>

                                                        )}

                                                    </td>


                                                    {/* ACTION */}

                                                    <td className="px-5 py-4">

                                                        <div
                                                            className="
                                                                flex
                                                                justify-end
                                                            "
                                                        >

                                                            {!returned && (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleReturn(
                                                                            borrowing
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        returningId ===
                                                                        borrowing.id
                                                                    }
                                                                    className="
                                                                        inline-flex
                                                                        items-center
                                                                        gap-2
                                                                        rounded-lg
                                                                        border
                                                                        border-[#ddd0c1]
                                                                        bg-white
                                                                        px-3
                                                                        py-2
                                                                        text-xs
                                                                        font-medium
                                                                        text-[#73533b]
                                                                        hover:bg-[#f5ede3]
                                                                        disabled:cursor-not-allowed
                                                                        disabled:opacity-50
                                                                    "
                                                                >

                                                                    <RotateCcw
                                                                        className="
                                                                            h-3.5
                                                                            w-3.5
                                                                        "
                                                                    />

                                                                    {returningId ===
                                                                    borrowing.id
                                                                        ? "Returning..."
                                                                        : "Return"}

                                                                </button>

                                                            )}

                                                        </div>

                                                    </td>

                                                </tr>

                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}