import { useEffect, useState } from "react";

import {
    ArrowLeft,
    BookOpen,
    CheckCircle,
    AlertCircle,
    RotateCcw,
    X,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";


// =========================================================
// ADMIN BORROWINGS PAGE
// =========================================================

export default function AdminBorrowings() {

    // =====================================================
    // STATE
    // =====================================================

    const [borrowings, setBorrowings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [returningId, setReturningId] = useState(null);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD BORROWINGS
    // =====================================================

    async function loadBorrowings() {

        try {

            setLoading(true);

            setError("");


            const data =
                await api.borrowings.getAll();


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


            // =================================================
            // FALLBACK
            // =================================================

            setBorrowings([]);

        } catch (err) {

            console.error(
                "Failed to load borrowings:",
                err
            );

            setError(
                err.message ||
                "Unable to load borrowing records."
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
    // RETURN BOOK
    // =====================================================

    async function handleReturnBook(
        borrowing
    ) {

        const borrowingId =
            borrowing.id;


        if (!borrowingId) {

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
                borrowingId
            );

            setError("");

            setSuccess("");


            await api.borrowings.returnBook(
                borrowingId
            );


            setSuccess(
                "Book returned successfully."
            );


            // Refresh borrowing records.

            await loadBorrowings();


            // Remove success message after a few seconds.

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
    // GET BOOK TITLE
    // =====================================================

    function getBookTitle(
        borrowing
    ) {

        return (
            borrowing.bookTitle ||

            borrowing.book?.title ||

            borrowing.book?.name ||

            borrowing.title ||

            "Unknown Book"
        );
    }


    // =====================================================
    // GET AUTHOR
    // =====================================================

    function getAuthor(
        borrowing
    ) {

        return (
            borrowing.author ||

            borrowing.book?.author ||

            "Unknown"
        );
    }


    // =====================================================
    // GET USER NAME
    // =====================================================

    function getUserName(
        borrowing
    ) {

        return (
            borrowing.userName ||

            borrowing.user?.name ||

            borrowing.memberName ||

            borrowing.member?.name ||

            borrowing.user?.email ||

            borrowing.member?.email ||

            "Unknown User"
        );
    }


    // =====================================================
    // GET USER EMAIL
    // =====================================================

    function getUserEmail(
        borrowing
    ) {

        return (
            borrowing.email ||

            borrowing.user?.email ||

            borrowing.member?.email ||

            "—"
        );
    }


    // =====================================================
    // GET DUE DATE
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
    // GET BORROW DATE
    // =====================================================

    function getBorrowDate(
        borrowing
    ) {

        return (
            borrowing.borrowDate ||

            borrowing.borrowedAt ||

            borrowing.createdAt ||

            borrowing.issueDate ||

            null
        );
    }


    // =====================================================
    // GET RETURN DATE
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
    // CHECK WHETHER RETURNED
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
            borrowing.status
                ?.toString()
                .toUpperCase() ===
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
    // GET INITIAL
    // =====================================================

    function getInitial(
        name
    ) {

        if (!name) {

            return "?";
        }


        return name
            .charAt(0)
            .toUpperCase();
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
                    py-6
                    sm:px-6
                    lg:px-8
                    xl:px-10
                "
            >

                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <Link
                    to="/admin"
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
                    PAGE HEADER
                ================================================= */}

                <div
                    className="
                        mb-6
                        flex
                        flex-col
                        gap-3
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
                            View all borrowed books and manage returns.
                        </p>

                    </div>


                    {/* TOTAL */}

                    {!loading && (

                        <div
                            className="
                                rounded-lg
                                border
                                border-[#e5d7c5]
                                bg-white
                                px-4
                                py-3
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-[#9a8778]
                                "
                            >
                                Total Records
                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-lg
                                    font-semibold
                                    text-[#2a1d15]
                                "
                            >
                                {borrowings.length}
                            </p>

                        </div>

                    )}

                </div>


                {/* =================================================
                    SUCCESS MESSAGE
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

                        <span>
                            {success}
                        </span>

                    </div>

                )}


                {/* =================================================
                    ERROR MESSAGE
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

                            <span>
                                {error}
                            </span>

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
                    BORROWINGS TABLE
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
                                Loading borrowing records...
                            </p>

                        </div>

                    ) : borrowings.length === 0 ? (

                        /* =========================================
                           EMPTY
                        ========================================= */

                        <div
                            className="
                                flex
                                min-h-64
                                flex-col
                                items-center
                                justify-center
                                px-4
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

                                <BookOpen
                                    className="h-5 w-5"
                                />

                            </div>


                            <h3
                                className="
                                    font-medium
                                    text-[#2a1d15]
                                "
                            >
                                No borrowing records
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-center
                                    text-sm
                                    text-[#9a8778]
                                "
                            >
                                There are currently no borrowing records.
                            </p>

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
                                            Member
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


                                            const bookTitle =
                                                getBookTitle(
                                                    borrowing
                                                );


                                            const memberName =
                                                getUserName(
                                                    borrowing
                                                );


                                            const memberEmail =
                                                getUserEmail(
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
                                                                    h-9
                                                                    w-9
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    bg-[#f1e3d3]
                                                                    text-[#a8652c]
                                                                "
                                                            >

                                                                <BookOpen
                                                                    className="
                                                                        h-4
                                                                        w-4
                                                                    "
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
                                                                        bookTitle
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
                                                        MEMBER
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
                                                                    h-8
                                                                    w-8
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-full
                                                                    bg-[#ead7c5]
                                                                    text-xs
                                                                    font-semibold
                                                                    text-[#8f501e]
                                                                "
                                                            >

                                                                {
                                                                    getInitial(
                                                                        memberName
                                                                    )
                                                                }

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
                                                                        memberName
                                                                    }
                                                                </p>


                                                                <p
                                                                    className="
                                                                        whitespace-nowrap
                                                                        text-xs
                                                                        text-[#9a8778]
                                                                    "
                                                                >
                                                                    {
                                                                        memberEmail
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

                                                        ) : overdue ? (

                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    rounded-full
                                                                    bg-red-50
                                                                    px-2.5
                                                                    py-1
                                                                    text-xs
                                                                    font-medium
                                                                    text-red-700
                                                                "
                                                            >
                                                                Overdue
                                                            </span>

                                                        ) : (

                                                            <span
                                                                className="
                                                                    inline-flex
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
                                                                        className="
                                                                            h-3.5
                                                                            w-3.5
                                                                        "
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