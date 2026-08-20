import { useEffect, useState } from "react";

import {
    ArrowLeft,
    BookOpen,
    CalendarDays,
    CheckCircle,
    AlertCircle,
    RotateCcw,
    X,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";


// =========================================================
// MEMBER BORROWINGS
// =========================================================

export default function MemberBorrowings() {

    // =====================================================
    // STATE
    // =====================================================

    const [borrowings, setBorrowings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [returningId, setReturningId] = useState(null);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD MY BORROWINGS
    // =====================================================

    async function loadBorrowings() {

        try {

            setLoading(true);

            setError("");


            /*
             * The backend should use the authenticated
             * user's JWT to determine which borrowings
             * belong to the current member.
             */

            const data =
                await api.borrowings.getMyBorrowings();


            // =================================================
            // NORMAL ARRAY RESPONSE
            // =================================================

            if (Array.isArray(data)) {

                setBorrowings(data);

                return;
            }


            // =================================================
            // PAGINATED RESPONSE
            // =================================================

            if (
                data &&
                Array.isArray(data.content)
            ) {

                setBorrowings(
                    data.content
                );

                return;
            }


            setBorrowings([]);

        } catch (err) {

            console.error(
                "Failed to load borrowings:",
                err
            );

            setError(
                err.message ||
                "Unable to load your borrowings."
            );

        } finally {

            setLoading(false);
        }
    }


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadBorrowings();

    }, []);


    // =====================================================
    // BOOK TITLE
    // =====================================================

    function getBookTitle(
        borrowing
    ) {

        return (
            borrowing.bookTitle ||

            borrowing.book?.title ||

            borrowing.title ||

            "Unknown Book"
        );
    }


    // =====================================================
    // AUTHOR
    // =====================================================

    function getAuthor(
        borrowing
    ) {

        return (
            borrowing.author ||

            borrowing.book?.author ||

            "Unknown Author"
        );
    }


    // =====================================================
    // BORROW DATE
    // =====================================================

    function getBorrowDate(
        borrowing
    ) {

        return (
            borrowing.borrowDate ||

            borrowing.borrowedAt ||

            borrowing.issueDate ||

            borrowing.createdAt ||

            null
        );
    }


    // =====================================================
    // DUE DATE
    // =====================================================

    function getDueDate(
        borrowing
    ) {

        return (
            borrowing.dueDate ||

            borrowing.dueAt ||

            borrowing.expectedReturnDate ||

            null
        );
    }


    // =====================================================
    // RETURN DATE
    // =====================================================

    function getReturnDate(
        borrowing
    ) {

        return (
            borrowing.returnDate ||

            borrowing.returnedAt ||

            null
        );
    }


    // =====================================================
    // CHECK RETURNED
    // =====================================================

    function isReturned(
        borrowing
    ) {

        if (
            getReturnDate(
                borrowing
            )
        ) {

            return true;
        }


        if (
            borrowing.returned === true
        ) {

            return true;
        }


        if (
            String(
                borrowing.status || ""
            ).toUpperCase() ===
            "RETURNED"
        ) {

            return true;
        }


        return false;
    }


    // =====================================================
    // CHECK OVERDUE
    // =====================================================

    function isOverdue(
        borrowing
    ) {

        if (
            isReturned(
                borrowing
            )
        ) {

            return false;
        }


        const dueDate =
            getDueDate(
                borrowing
            );


        if (!dueDate) {

            return false;
        }


        const due =
            new Date(
                dueDate
            );


        if (
            Number.isNaN(
                due.getTime()
            )
        ) {

            return false;
        }


        return (
            due.getTime() <
            Date.now()
        );
    }


    // =====================================================
    // FORMAT DATE
    // =====================================================

    function formatDate(
        date
    ) {

        if (!date) {

            return "—";
        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "—";
        }


        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    }


    // =====================================================
    // RETURN BOOK
    // =====================================================

    async function handleReturnBook(
        borrowing
    ) {

        if (!borrowing?.id) {

            setError(
                "Borrowing ID is missing."
            );

            return;
        }


        const bookTitle =
            getBookTitle(
                borrowing
            );


        const confirmed =
            window.confirm(
                `Are you sure you want to return "${bookTitle}"?`
            );


        if (!confirmed) {

            return;
        }


        try {

            setReturningId(
                borrowing.id
            );

            setError("");

            setSuccess("");


            /*
             * This uses the same return endpoint used
             * by the admin page.
             *
             * The backend must verify that the current
             * authenticated user is allowed to return
             * this borrowing.
             */

            await api.borrowings.returnBook(
                borrowing.id
            );


            setSuccess(
                `"${bookTitle}" was returned successfully.`
            );


            await loadBorrowings();


            setTimeout(() => {

                setSuccess("");

            }, 4000);

        } catch (err) {

            console.error(
                "Failed to return book:",
                err
            );

            setError(
                err.message ||
                "Unable to return the book."
            );

        } finally {

            setReturningId(null);
        }
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
                MAIN
            ================================================= */}

            <main
                className="
                    min-h-[calc(100vh-64px)]
                    w-full
                    px-4
                    py-6
                    sm:px-6
                    lg:px-8
                    xl:px-10
                "
            >

                {/* =================================================
                    BACK
                ================================================= */}

                <Link
                    to="/member"
                    className="
                        mb-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-[#735e50]
                        transition
                        hover:bg-[#f1e3d3]
                        hover:text-[#2a1d15]
                    "
                >

                    <ArrowLeft
                        className="h-4 w-4"
                    />

                    Back to Dashboard

                </Link>


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
                        Member Area
                    </p>


                    <h1
                        className="
                            text-2xl
                            font-semibold
                            text-[#2a1d15]
                        "
                    >
                        My Borrowings
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-[#735e50]
                        "
                    >
                        Track the books you have borrowed and their due dates.
                    </p>

                </div>


                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (

                    <div
                        className="
                            mb-5
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-green-200
                            bg-green-50
                            px-4
                            py-3
                            text-sm
                            text-green-700
                        "
                    >

                        <CheckCircle
                            className="h-4 w-4"
                        />

                        {success}

                    </div>

                )}


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

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <AlertCircle
                                className="h-4 w-4"
                            />

                            {error}

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                        >

                            <X
                                className="h-4 w-4"
                            />

                        </button>

                    </div>

                )}


                {/* =================================================
                    CONTENT
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

                        /* =========================================
                           LOADING
                        ========================================= */

                        <div
                            className="
                                flex
                                min-h-64
                                items-center
                                justify-center
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    text-[#735e50]
                                "
                            >
                                Loading your borrowings...
                            </p>

                        </div>

                    ) : borrowings.length === 0 ? (

                        /* =========================================
                           EMPTY
                        ========================================= */

                        <div
                            className="
                                flex
                                min-h-72
                                flex-col
                                items-center
                                justify-center
                                px-4
                            "
                        >

                            <div
                                className="
                                    mb-4
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#f1e3d3]
                                    text-[#a8652c]
                                "
                            >

                                <BookOpen
                                    className="h-6 w-6"
                                />

                            </div>


                            <h3
                                className="
                                    text-lg
                                    font-medium
                                    text-[#2a1d15]
                                "
                            >
                                No borrowings
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-center
                                    text-sm
                                    text-[#9a8778]
                                "
                            >
                                You haven't borrowed any books yet.
                            </p>


                            <Link
                                to="/member/books"
                                className="
                                    mt-5
                                    inline-flex
                                    items-center
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
                                Browse Books
                            </Link>

                        </div>

                    ) : (

                        /* =========================================
                           TABLE
                        ========================================= */

                        <div
                            className="
                                overflow-x-auto
                            "
                        >

                            <table
                                className="
                                    min-w-full
                                "
                            >

                                {/* =================================
                                    HEADER
                                ================================= */}

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
                                                whitespace-nowrap
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
                                                whitespace-nowrap
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
                                                whitespace-nowrap
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
                                            Due Date
                                        </th>


                                        <th
                                            className="
                                                whitespace-nowrap
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
                                                whitespace-nowrap
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


                                {/* =================================
                                    BODY
                                ================================= */}

                                <tbody>

                                    {borrowings.map(
                                        (borrowing) => {

                                            const returned =
                                                isReturned(
                                                    borrowing
                                                );


                                            const overdue =
                                                isOverdue(
                                                    borrowing
                                                );


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

                                                    {/* =================================
                                                        BOOK
                                                    ================================= */}

                                                    <td
                                                        className="
                                                            px-5
                                                            py-4
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-3
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    flex
                                                                    h-10
                                                                    w-10
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    bg-[#f1e3d3]
                                                                    text-[#a8652c]
                                                                "
                                                            >

                                                                <BookOpen
                                                                    className="h-4 w-4"
                                                                />

                                                            </div>


                                                            <div>

                                                                <p
                                                                    className="
                                                                        whitespace-nowrap
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
                                                                        mt-0.5
                                                                        whitespace-nowrap
                                                                        text-xs
                                                                        text-[#9a8778]
                                                                    "
                                                                >
                                                                    {
                                                                        getAuthor(
                                                                            borrowing
                                                                        )
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* =================================
                                                        BORROWED DATE
                                                    ================================= */}

                                                    <td
                                                        className="
                                                            whitespace-nowrap
                                                            px-5
                                                            py-4
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                                text-sm
                                                                text-[#735e50]
                                                            "
                                                        >

                                                            <CalendarDays
                                                                className="
                                                                    h-4
                                                                    w-4
                                                                    text-[#9a8778]
                                                                "
                                                            />

                                                            {
                                                                formatDate(
                                                                    getBorrowDate(
                                                                        borrowing
                                                                    )
                                                                )
                                                            }

                                                        </div>

                                                    </td>


                                                    {/* =================================
                                                        DUE DATE
                                                    ================================= */}

                                                    <td
                                                        className="
                                                            whitespace-nowrap
                                                            px-5
                                                            py-4
                                                        "
                                                    >

                                                        <span
                                                            className={
                                                                `
                                                                text-sm
                                                                ${
                                                                    overdue
                                                                        ? "font-medium text-red-600"
                                                                        : "text-[#735e50]"
                                                                }
                                                                `
                                                            }
                                                        >

                                                            {
                                                                formatDate(
                                                                    getDueDate(
                                                                        borrowing
                                                                    )
                                                                )
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* =================================
                                                        STATUS
                                                    ================================= */}

                                                    <td
                                                        className="
                                                            whitespace-nowrap
                                                            px-5
                                                            py-4
                                                        "
                                                    >

                                                        {returned ? (

                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    gap-1.5
                                                                    rounded-full
                                                                    bg-green-50
                                                                    px-2.5
                                                                    py-1
                                                                    text-xs
                                                                    font-medium
                                                                    text-green-700
                                                                "
                                                            >

                                                                <CheckCircle
                                                                    className="h-3.5 w-3.5"
                                                                />

                                                                Returned

                                                            </span>

                                                        ) : overdue ? (

                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    gap-1.5
                                                                    rounded-full
                                                                    bg-red-50
                                                                    px-2.5
                                                                    py-1
                                                                    text-xs
                                                                    font-medium
                                                                    text-red-700
                                                                "
                                                            >

                                                                <AlertCircle
                                                                    className="h-3.5 w-3.5"
                                                                />

                                                                Overdue

                                                            </span>

                                                        ) : (

                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    gap-1.5
                                                                    rounded-full
                                                                    bg-blue-50
                                                                    px-2.5
                                                                    py-1
                                                                    text-xs
                                                                    font-medium
                                                                    text-blue-700
                                                                "
                                                            >

                                                                Borrowed

                                                            </span>

                                                        )}

                                                    </td>


                                                    {/* =================================
                                                        ACTION
                                                    ================================= */}

                                                    <td
                                                        className="
                                                            whitespace-nowrap
                                                            px-5
                                                            py-4
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                justify-end
                                                            "
                                                        >

                                                            {!returned ? (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleReturnBook(
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
                                                                        bg-[#a8652c]
                                                                        px-3
                                                                        py-2
                                                                        text-xs
                                                                        font-medium
                                                                        text-white
                                                                        transition
                                                                        hover:bg-[#8f501e]
                                                                        disabled:cursor-not-allowed
                                                                        disabled:opacity-50
                                                                    "
                                                                >

                                                                    <RotateCcw
                                                                        className="h-3.5 w-3.5"
                                                                    />

                                                                    {
                                                                        returningId ===
                                                                        borrowing.id
                                                                            ? "Returning..."
                                                                            : "Return Book"
                                                                    }

                                                                </button>

                                                            ) : (

                                                                <span
                                                                    className="
                                                                        text-xs
                                                                        text-[#9a8778]
                                                                    "
                                                                >
                                                                    Returned
                                                                </span>

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