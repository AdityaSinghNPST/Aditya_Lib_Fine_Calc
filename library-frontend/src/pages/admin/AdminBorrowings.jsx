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

import {
    buildLookup,
    normalizeList,
} from "../../utils/lookups";


// =========================================================
// ADMIN BORROWINGS PAGE
// =========================================================

export default function AdminBorrowings() {

    // =====================================================
    // STATE
    // =====================================================

    const [borrowings, setBorrowings] = useState([]);

    const [bookMap, setBookMap] = useState(new Map());

    const [userMap, setUserMap] = useState(new Map());

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


            const [
                borrowingsData,
                booksData,
                usersData,
            ] = await Promise.all([
                api.borrowings.getAll(),
                api.books.getAll({ page: 0, size: 1000 }),
                api.users.getAll(),
            ]);

            setBookMap(
                buildLookup(
                    normalizeList(booksData)
                )
            );

            setUserMap(
                buildLookup(
                    normalizeList(usersData)
                )
            );

            const data = borrowingsData;


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

        const book =
            bookMap.get(
                borrowing.bookId
            );

        return (
            borrowing.bookTitle ||
            book?.title ||
            borrowing.book?.title ||
            (borrowing.bookId
                ? `Book #${borrowing.bookId}`
                : "Unknown Book")
        );
    }


    // =====================================================
    // GET AUTHOR
    // =====================================================

    function getAuthor(
        borrowing
    ) {

        const book =
            bookMap.get(
                borrowing.bookId
            );

        return (
            borrowing.author ||
            book?.author ||
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

        const member =
            userMap.get(
                borrowing.userId
            );

        return (
            borrowing.userName ||
            member?.name ||
            borrowing.user?.name ||
            (borrowing.userId
                ? `User #${borrowing.userId}`
                : "Unknown User")
        );
    }


    // =====================================================
    // GET USER EMAIL
    // =====================================================

    function getUserEmail(
        borrowing
    ) {

        const member =
            userMap.get(
                borrowing.userId
            );

        return (
            borrowing.email ||
            member?.email ||
            borrowing.user?.email ||
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
                        text-[#78716c]
                        transition
                        hover:bg-[#ffedd5]
                        hover:text-[#292524]
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
                                text-[#ea580c]
                            "
                        >
                            Administration
                        </p>


                        <h1
                            className="
                                text-2xl
                                font-semibold
                                text-[#292524]
                            "
                        >
                            Borrowings
                        </h1>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-[#78716c]
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
                                border-[#fed7aa]
                                bg-white
                                px-4
                                py-3
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-[#a8a29e]
                                "
                            >
                                Total Records
                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-lg
                                    font-semibold
                                    text-[#292524]
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
                        border-[#fed7aa]
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
                                    text-[#78716c]
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
                                    bg-[#ffedd5]
                                    text-[#ea580c]
                                "
                            >

                                <BookOpen
                                    className="h-5 w-5"
                                />

                            </div>


                            <h3
                                className="
                                    font-medium
                                    text-[#292524]
                                "
                            >
                                No borrowing records
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-center
                                    text-sm
                                    text-[#a8a29e]
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
                                        border-[#fed7aa]
                                        bg-[#fffbeb]
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
                                                text-[#78716c]
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
                                                text-[#78716c]
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
                                                text-[#78716c]
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
                                                text-[#78716c]
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
                                                text-[#78716c]
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
                                                text-[#78716c]
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
                                                        hover:bg-[#fffbf5]
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
                                                                    bg-[#ffedd5]
                                                                    text-[#ea580c]
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
                                                                        text-[#292524]
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
                                                                        text-[#a8a29e]
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
                                                                    bg-[#fed7aa]
                                                                    text-xs
                                                                    font-semibold
                                                                    text-[#c2410c]
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
                                                                        text-[#292524]
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
                                                                        text-[#a8a29e]
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
                                                            text-[#78716c]
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
                                                                        : "text-[#78716c]"
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
                                                                        bg-[#ea580c]
                                                                        px-3
                                                                        py-2
                                                                        text-xs
                                                                        font-medium
                                                                        text-white
                                                                        transition
                                                                        hover:bg-[#c2410c]
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
                                                                        text-[#a8a29e]
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