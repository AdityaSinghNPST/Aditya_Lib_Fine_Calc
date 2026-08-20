import { useEffect, useState } from "react";

import {
    ArrowLeft,
    BookOpen,
    Search,
    CheckCircle,
    AlertCircle,
    X,
    Library,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";


// =========================================================
// MEMBER BOOKS
// =========================================================

export default function MemberBooks() {

    // =====================================================
    // BOOKS
    // =====================================================

    const [books, setBooks] = useState([]);

    const [loading, setLoading] = useState(true);

    const [borrowingId, setBorrowingId] = useState(null);


    // =====================================================
    // SEARCH
    // =====================================================

    const [search, setSearch] = useState("");


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


            const data =
                await api.books.getAll({

                    page,

                    size: pageSize,

                    title: search,

                });


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

    }, [page, search]);


    // =====================================================
    // SEARCH
    // =====================================================

    function handleSearch(event) {

        setSearch(
            event.target.value
        );

        setPage(0);
    }


    // =====================================================
    // CHECK AVAILABILITY
    // =====================================================

    function isAvailable(book) {

        if (
            typeof book.available ===
            "boolean"
        ) {

            return book.available;
        }


        if (
            typeof book.isAvailable ===
            "boolean"
        ) {

            return book.isAvailable;
        }


        if (
            typeof book.availableCopies ===
            "number"
        ) {

            return book.availableCopies > 0;
        }


        if (
            typeof book.copiesAvailable ===
            "number"
        ) {

            return book.copiesAvailable > 0;
        }


        /*
         * If the backend does not provide
         * availability, don't prevent
         * the member from attempting
         * to borrow the book.
         */

        return true;
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


        const confirmed =
            window.confirm(
                `Do you want to borrow "${book.title}"?`
            );


        if (!confirmed) {

            return;
        }


        try {

            setBorrowingId(
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

            setBorrowingId(null);
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
                            Browse Books
                        </h1>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-[#735e50]
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
                            border-[#e5d7c5]
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            text-[#735e50]
                        "
                    >

                        <Library
                            className="
                                h-4
                                w-4
                                text-[#a8652c]
                            "
                        />

                        {totalElements} books

                    </div>

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

                        <span>
                            {success}
                        </span>

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
                            onChange={
                                handleSearch
                            }
                            placeholder="Search books by title..."
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
                                text-[#2a1d15]
                                outline-none
                                transition
                                focus:border-[#a8652c]
                                focus:ring-1
                                focus:ring-[#a8652c]
                            "
                        />

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
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    text-[#735e50]
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
                                No books found
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-[#9a8778]
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
                                                text-[#735e50]
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
                                                text-[#735e50]
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
                                                        hover:bg-[#fffaf5]
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
                                                                    bg-[#f1e3d3]
                                                                    text-[#a8652c]
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
                                                                        text-[#2a1d15]
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
                                                                        text-[#9a8778]
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
                                                            text-[#735e50]
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

                                                        {available ? (

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
                                                                Currently Borrowed
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

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleBorrow(
                                                                        book
                                                                    )
                                                                }
                                                                disabled={
                                                                    !available ||
                                                                    borrowingId ===
                                                                    book.id
                                                                }
                                                                className="
                                                                    rounded-lg
                                                                    bg-[#a8652c]
                                                                    px-4
                                                                    py-2
                                                                    text-xs
                                                                    font-medium
                                                                    text-white
                                                                    transition
                                                                    hover:bg-[#8f501e]
                                                                    disabled:cursor-not-allowed
                                                                    disabled:opacity-40
                                                                "
                                                            >

                                                                {borrowingId ===
                                                                book.id
                                                                    ? "Borrowing..."
                                                                    : "Borrow Book"}

                                                            </button>

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
                                    text-[#735e50]
                                "
                            >

                                Page{" "}

                                <span
                                    className="
                                        font-medium
                                        text-[#2a1d15]
                                    "
                                >
                                    {page + 1}
                                </span>

                                {" "}of{" "}

                                <span
                                    className="
                                        font-medium
                                        text-[#2a1d15]
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
                                    className="
                                        rounded-lg
                                        border
                                        border-[#ddd0c1]
                                        bg-white
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        text-[#735e50]
                                        transition
                                        hover:bg-[#f5ede3]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
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
                                    className="
                                        rounded-lg
                                        bg-[#a8652c]
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-[#8f501e]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    Next
                                </button>

                            </div>

                        </div>

                    )}

            </main>

        </div>
    );
}