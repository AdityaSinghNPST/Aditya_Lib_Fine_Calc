import { useEffect, useState } from "react";

import {
    BookOpen,
    Search,
    X,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";


// =========================================================
// MEMBER BOOKS
// =========================================================

export default function MemberBooks() {

    // =====================================================
    // STATE
    // =====================================================

    const [books, setBooks] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [borrowingId, setBorrowingId] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // LOAD BOOKS
    // =====================================================

    async function loadBooks() {

        try {

            setLoading(true);

            setError("");

            const data =
                await api.books.getAll({
                    page: 0,
                    size: 100,
                });


            if (Array.isArray(data)) {

                setBooks(data);

            } else if (
                data &&
                Array.isArray(data.content)
            ) {

                setBooks(data.content);

            } else {

                setBooks([]);
            }

        } catch (err) {

            setError(
                err.message ||
                "Unable to load books."
            );

        } finally {

            setLoading(false);
        }
    }


    useEffect(() => {

        loadBooks();

    }, []);


    // =====================================================
    // BORROW BOOK
    // =====================================================

    async function handleBorrow(book) {

        const confirmed =
            window.confirm(
                `Borrow "${book.title}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            setBorrowingId(book.id);

            setError("");

            setSuccess("");


            await api.borrowings.borrow(
                book.id
            );


            setSuccess(
                `"${book.title}" has been borrowed successfully.`
            );


            /*
             * Reload the books so the availability
             * shown on screen is updated.
             */

            await loadBooks();


            /*
             * Remove success message after a few seconds.
             */

            setTimeout(() => {

                setSuccess("");

            }, 4000);

        } catch (err) {

            setError(
                err.message ||
                "Unable to borrow this book."
            );

        } finally {

            setBorrowingId(null);
        }
    }


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredBooks =
        books.filter((book) => {

            const value =
                search
                    .toLowerCase()
                    .trim();


            if (!value) {
                return true;
            }


            return (

                String(book.title || "")
                    .toLowerCase()
                    .includes(value)

                ||

                String(book.author || "")
                    .toLowerCase()
                    .includes(value)

                ||

                String(book.isbn || "")
                    .toLowerCase()
                    .includes(value)

            );
        });


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
                        Find an available book and borrow it.
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

                            <X className="h-4 w-4" />

                        </button>

                    </div>

                )}


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
                    SEARCH
                ================================================= */}

                <div
                    className="
                        mb-6
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
                            placeholder="Search by title, author or ISBN..."
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
                    BOOKS
                ================================================= */}

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
                        Loading books...
                    </div>

                ) : filteredBooks.length === 0 ? (

                    <div
                        className="
                            flex
                            min-h-64
                            flex-col
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-[#e5d7c5]
                            bg-white
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
                            grid
                            gap-4
                            sm:grid-cols-2
                            lg:grid-cols-3
                        "
                    >

                        {filteredBooks.map(
                            (book) => {

                                /*
                                 * Support both common backend
                                 * property names.
                                 */

                                const available =
                                    book.available ??
                                    book.isAvailable ??
                                    false;


                                return (

                                    <div
                                        key={book.id}
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

                                        {/* BOOK ICON */}

                                        <div
                                            className="
                                                mb-4
                                                flex
                                                h-11
                                                w-11
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


                                        {/* TITLE */}

                                        <h2
                                            className="
                                                text-base
                                                font-semibold
                                                text-[#2a1d15]
                                            "
                                        >
                                            {book.title}
                                        </h2>


                                        {/* AUTHOR */}

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-[#735e50]
                                            "
                                        >
                                            {book.author}
                                        </p>


                                        {/* ISBN */}

                                        <p
                                            className="
                                                mt-2
                                                text-xs
                                                text-[#9a8778]
                                            "
                                        >
                                            ISBN:{" "}
                                            {book.isbn || "Not available"}
                                        </p>


                                        {/* STATUS */}

                                        <div
                                            className="
                                                mt-4
                                                flex
                                                items-center
                                                justify-between
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
                                                    Borrowed
                                                </span>

                                            )}


                                            {/* BORROW BUTTON */}

                                            <button
                                                type="button"
                                                disabled={
                                                    !available ||
                                                    borrowingId ===
                                                        book.id
                                                }
                                                onClick={() =>
                                                    handleBorrow(
                                                        book
                                                    )
                                                }
                                                className="
                                                    rounded-lg
                                                    bg-[#a8652c]
                                                    px-3
                                                    py-2
                                                    text-xs
                                                    font-medium
                                                    text-white
                                                    hover:bg-[#8f501e]
                                                    disabled:cursor-not-allowed
                                                    disabled:bg-[#d8c9ba]
                                                "
                                            >

                                                {borrowingId ===
                                                book.id
                                                    ? "Borrowing..."
                                                    : available
                                                        ? "Borrow"
                                                        : "Unavailable"}

                                            </button>

                                        </div>

                                    </div>

                                );
                            }
                        )}

                    </div>

                )}

            </main>

        </div>
    );
}