import { useEffect, useState } from "react";

import {
    ArrowLeft,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Search,
    CheckCircle,
    AlertCircle,
    X,
    Library,
    RotateCcw,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";

import { normalizeList } from "../../utils/lookups";


// =========================================================
// MEMBER BOOKS
// =========================================================

export default function MemberBooks() {

    // =====================================================
    // BOOKS
    // =====================================================

    const [books, setBooks] = useState([]);

    const [loading, setLoading] = useState(true);

    const [borrowingBookId, setBorrowingBookId] = useState(null);

    const [returningBorrowingId, setReturningBorrowingId] = useState(null);

    const [activeBorrowingByBookId, setActiveBorrowingByBookId] =
        useState(new Map());


    // =====================================================
    // SEARCH
    // =====================================================

    const [search, setSearch] = useState("");

    const [authorSearch, setAuthorSearch] = useState("");


    // =====================================================
    // PAGINATION
    // =====================================================

    const [page, setPage] = useState(0);

    const pageSize = 10;

    const [totalPages, setTotalPages] = useState(1);

    const [totalElements, setTotalElements] = useState(0);


    // =====================================================
    // MESSAGES
    // =====================================================

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD BOOKS
    // =====================================================

    async function loadBooks() {

        try {

            setLoading(true);

            setError("");


            const [
                booksData,
                borrowingsData,
            ] = await Promise.all([
                api.books.getAll({
                    page,
                    size: pageSize,
                    title: search,
                    author: authorSearch,
                }),
                api.borrowings.getAll(),
            ]);

            const data = booksData;

            const borrowings =
                normalizeList(borrowingsData);

            const borrowingMap =
                new Map();

            borrowings.forEach((borrowing) => {

                if (
                    isActiveBorrowing(
                        borrowing
                    ) &&
                    borrowing.bookId !=
                        null
                ) {

                    borrowingMap.set(
                        borrowing.bookId,
                        borrowing
                    );
                }
            });

            setActiveBorrowingByBookId(
                borrowingMap
            );


            // =================================================
            // SPRING PAGE RESPONSE
            // =================================================

            if (
                data &&
                Array.isArray(data.content)
            ) {

                setBooks(data.content);

                setTotalPages(
                    data.totalPages || 1
                );

                setTotalElements(
                    data.totalElements ||
                    data.content.length
                );

                return;
            }


            // =================================================
            // NORMAL ARRAY
            // =================================================

            if (Array.isArray(data)) {

                setBooks(data);

                setTotalPages(1);

                setTotalElements(
                    data.length
                );

                return;
            }


            setBooks([]);

            setTotalPages(1);

            setTotalElements(0);

        } catch (err) {

            console.error(
                "Failed to load books:",
                err
            );

            setError(
                err.message ||
                "Unable to load books."
            );

        } finally {

            setLoading(false);
        }
    }


    // =====================================================
    // INITIAL LOAD / SEARCH / PAGE
    // =====================================================

    useEffect(() => {

        loadBooks();

    }, [page, search, authorSearch]);


    // =====================================================
    // SEARCH
    // =====================================================

    function handleSearch(event) {

        setSearch(
            event.target.value
        );

        setPage(0);
    }


    function handleAuthorSearch(event) {

        setAuthorSearch(
            event.target.value
        );

        setPage(0);
    }


    // =====================================================
    // BORROWING HELPERS
    // =====================================================

    function isActiveBorrowing(
        borrowing
    ) {

        if (
            borrowing.returnDate
        ) {

            return false;
        }

        if (
            borrowing.returned ===
            true
        ) {

            return false;
        }

        if (
            String(
                borrowing.status || ""
            ).toUpperCase() ===
            "RETURNED"
        ) {

            return false;
        }

        return true;
    }


    function getMyBorrowing(
        bookId
    ) {

        return activeBorrowingByBookId.get(
            bookId
        );
    }


    // =====================================================
    // CHECK AVAILABILITY
    // =====================================================

    function isAvailable(book) {

        return book?.available === true;
    }


    // =====================================================
    // BORROW BOOK
    // =====================================================

    async function handleBorrow(book) {

        if (!book?.id) {

            setError(
                "Book ID is missing."
            );

            return;
        }


        // const confirmed =
        //     window.confirm(
        //         `Do you want to borrow "${book.title}"?`
        //     );
        //
        //
        // if (!confirmed) {
        //
        //     return;
        // }


        try {

            setBorrowingBookId(
                book.id
            );

            setError("");

            setSuccess("");


            await api.borrowings.borrow(
                book.id
            );


            setSuccess(
                `"${book.title}" has been borrowed successfully.`
            );


            // Refresh books so availability
            // is updated.

            await loadBooks();


            setTimeout(() => {

                setSuccess("");

            }, 4000);

        } catch (err) {

            console.error(
                "Failed to borrow book:",
                err
            );


            setError(
                err.message ||
                "Unable to borrow this book."
            );

        } finally {

            setBorrowingBookId(null);
        }
    }


    // =====================================================
    // RETURN BOOK
    // =====================================================

    async function handleReturn(
        borrowing,
        bookTitle
    ) {

        if (!borrowing?.id) {

            setError(
                "Borrowing record not found."
            );

            return;
        }


        // const confirmed =
        //     window.confirm(
        //         `Are you sure you want to return "${bookTitle}"?`
        //     );
        //
        //
        // if (!confirmed) {
        //
        //     return;
        // }


        try {

            setReturningBorrowingId(
                borrowing.id
            );

            setError("");

            setSuccess("");


            await api.borrowings.returnBook(
                borrowing.id
            );


            setSuccess(
                `"${bookTitle}" was returned successfully.`
            );


            await loadBooks();


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
                "Unable to return this book."
            );

        } finally {

            setReturningBorrowingId(null);
        }
    }


    // =====================================================
    // INITIAL
    // =====================================================

    function getInitial(title) {

        if (!title) {

            return "?";
        }


        return title
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
                    HEADER
                ================================================= */}

                <div
                    className="
                        mb-6
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
                                text-2xl
                                font-semibold
                                text-[#292524]
                            "
                        >
                            Browse Books
                        </h1>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-[#78716c]
                            "
                        >
                            Find a book and borrow it from the library.
                        </p>

                    </div>


                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-[#fed7aa]
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            text-[#78716c]
                        "
                    >

                        <Library
                            className="
                                h-4
                                w-4
                                text-[#ea580c]
                            "
                        />

                        {totalElements} books

                    </div>

                </div>


                {/* =================================================
                    SUCCESS
                ================================================= */}

                {/*
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
                */}


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
                    SEARCH
                ================================================= */}

                <div
                    className="
                        mb-5
                        rounded-xl
                        border
                        border-[#fed7aa]
                        bg-white
                        p-4
                        shadow-sm
                    "
                >

                    <div className="grid gap-3 sm:grid-cols-2">

                        <div className="relative">

                            <Search
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-[#a8a29e]
                                "
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search by title..."
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-[#fdba74]
                                    bg-[#fffef9]
                                    py-2.5
                                    pl-9
                                    pr-3
                                    text-sm
                                    text-[#292524]
                                    outline-none
                                    transition
                                    focus:border-[#ea580c]
                                    focus:ring-1
                                    focus:ring-[#ea580c]
                                "
                            />

                        </div>

                        <div className="relative">

                            <Search
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-[#a8a29e]
                                "
                            />

                            <input
                                type="text"
                                value={authorSearch}
                                onChange={handleAuthorSearch}
                                placeholder="Search by author..."
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-[#fdba74]
                                    bg-[#fffef9]
                                    py-2.5
                                    pl-9
                                    pr-3
                                    text-sm
                                    text-[#292524]
                                    outline-none
                                    transition
                                    focus:border-[#ea580c]
                                    focus:ring-1
                                    focus:ring-[#ea580c]
                                "
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    BOOKS
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
                                Loading books...
                            </p>

                        </div>

                    ) : books.length === 0 ? (

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
                                No books found
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-[#a8a29e]
                                "
                            >
                                Try a different search.
                            </p>

                        </div>

                    ) : (

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

                                {/* HEADER */}

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
                                            Author
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
                                                text-[#78716c]
                                            "
                                        >
                                            Availability
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
                                                text-[#78716c]
                                            "
                                        >
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                {/* BODY */}

                                <tbody>

                                    {books.map(
                                        (book) => {

                                            const myBorrowing =
                                                getMyBorrowing(
                                                    book.id
                                                );

                                            const available =
                                                isAvailable(
                                                    book
                                                );


                                            return (

                                                <tr
                                                    key={
                                                        book.id
                                                    }
                                                    className="
                                                        border-b
                                                        border-[#eee5dc]
                                                        last:border-0
                                                        hover:bg-[#fffbf5]
                                                    "
                                                >

                                                    {/* BOOK */}

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
                                                                    bg-[#ffedd5]
                                                                    text-[#ea580c]
                                                                "
                                                            >

                                                                {
                                                                    getInitial(
                                                                        book.title
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
                                                                        book.title ||
                                                                        "Untitled"
                                                                    }
                                                                </p>


                                                                <p
                                                                    className="
                                                                        mt-0.5
                                                                        text-xs
                                                                        text-[#a8a29e]
                                                                    "
                                                                >
                                                                    Book #
                                                                    {book.id}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* AUTHOR */}

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
                                                            book.author ||
                                                            "Unknown"
                                                        }

                                                    </td>


                                                    {/* AVAILABILITY */}

                                                    <td
                                                        className="
                                                            whitespace-nowrap
                                                            px-5
                                                            py-4
                                                        "
                                                    >

                                                        {myBorrowing ? (

                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    rounded-full
                                                                    bg-[#ffedd5]
                                                                    px-2.5
                                                                    py-1
                                                                    text-xs
                                                                    font-medium
                                                                    text-[#c2410c]
                                                                "
                                                            >
                                                                Borrowed by you
                                                            </span>

                                                        ) : available ? (

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
                                                                Available
                                                            </span>

                                                        ) : (

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
                                                                Not Available
                                                            </span>

                                                        )}

                                                    </td>


                                                    {/* ACTION */}

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

                                                            {myBorrowing ? (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleReturn(
                                                                            myBorrowing,
                                                                            book.title ||
                                                                                "this book"
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        returningBorrowingId ===
                                                                        myBorrowing.id
                                                                    }
                                                                    className="
                                                                        inline-flex
                                                                        items-center
                                                                        gap-2
                                                                        rounded-lg
                                                                        bg-[#ea580c]
                                                                        px-4
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
                                                                        className="h-3.5 w-3.5"
                                                                    />

                                                                    {returningBorrowingId ===
                                                                    myBorrowing.id
                                                                        ? "Returning..."
                                                                        : "Return Book"}

                                                                </button>

                                                            ) : available ? (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleBorrow(
                                                                            book
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        borrowingBookId ===
                                                                        book.id
                                                                    }
                                                                    className="
                                                                        rounded-lg
                                                                        bg-[#ea580c]
                                                                        px-4
                                                                        py-2
                                                                        text-xs
                                                                        font-medium
                                                                        text-white
                                                                        transition
                                                                        hover:bg-[#c2410c]
                                                                        disabled:cursor-not-allowed
                                                                        disabled:opacity-40
                                                                    "
                                                                >

                                                                    {borrowingBookId ===
                                                                    book.id
                                                                        ? "Borrowing..."
                                                                        : "Borrow Book"}

                                                                </button>

                                                            ) : (

                                                                <span
                                                                    className="
                                                                        text-xs
                                                                        text-[#a8a29e]
                                                                    "
                                                                >
                                                                    Unavailable
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


                {/* =================================================
                    PAGINATION
                ================================================= */}

                {!loading &&
                    books.length > 0 &&
                    totalPages > 1 && (

                        <div
                            className="
                                mt-5
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    text-[#78716c]
                                "
                            >

                                Page{" "}

                                <span
                                    className="
                                        font-medium
                                        text-[#292524]
                                    "
                                >
                                    {page + 1}
                                </span>

                                {" "}of{" "}

                                <span
                                    className="
                                        font-medium
                                        text-[#292524]
                                    "
                                >
                                    {totalPages}
                                </span>

                            </p>


                            <div
                                className="
                                    flex
                                    gap-2
                                "
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage(
                                            (previous) =>
                                                Math.max(
                                                    previous - 1,
                                                    0
                                                )
                                        )
                                    }
                                    disabled={
                                        page === 0
                                    }
                                    aria-label="Previous page"
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1
                                        rounded-lg
                                        border
                                        border-[#fdba74]
                                        bg-white
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        text-[#78716c]
                                        transition
                                        hover:bg-[#fff7ed]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    <ChevronLeft
                                        className="h-4 w-4"
                                    />
                                    Previous
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage(
                                            (previous) =>
                                                Math.min(
                                                    previous + 1,
                                                    totalPages - 1
                                                )
                                        )
                                    }
                                    disabled={
                                        page >=
                                        totalPages - 1
                                    }
                                    aria-label="Next page"
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1
                                        rounded-lg
                                        bg-[#ea580c]
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-[#c2410c]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    Next
                                    <ChevronRight
                                        className="h-4 w-4"
                                    />
                                </button>

                            </div>

                        </div>

                    )}

            </main>

        </div>
    );
}