import { useEffect, useState } from "react";

import {
    BookOpen,
    Plus,
    Search,
    X,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";


export default function AdminBooks() {

    // =====================================================
    // STATE
    // =====================================================

    const [books, setBooks] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);


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


            /*
             * Depending on the backend response,
             * books may be directly returned as an array
             * or inside a "content" property.
             */

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
    // ADD BOOK
    // =====================================================

    function handleAddBook() {

        setShowForm(true);
    }


    // =====================================================
    // SUCCESS
    // =====================================================

    async function handleSuccess() {

        setShowForm(false);

        await loadBooks();
    }


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
                            Administration
                        </p>


                        <h1
                            className="
                                text-2xl
                                font-semibold
                                text-[#2a1d15]
                            "
                        >
                            Books
                        </h1>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-[#735e50]
                            "
                        >
                            Manage books in the library.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleAddBook}
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
                            hover:bg-[#8f501e]
                        "
                    >

                        <Plus className="h-4 w-4" />

                        Add Book

                    </button>

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
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
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
                    BOOK TABLE
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

                                <BookOpen className="h-5 w-5" />

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
                                Add a book to get started.
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
                                            ISBN
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

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredBooks.map(
                                        (book) => (

                                            <tr
                                                key={book.id}
                                                className="
                                                    border-b
                                                    border-[#eee5dc]
                                                    last:border-0
                                                    hover:bg-[#fffaf5]
                                                "
                                            >

                                                {/* BOOK */}

                                                <td className="px-5 py-4">

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
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                bg-[#f1e3d3]
                                                                text-[#a8652c]
                                                            "
                                                        >

                                                            <BookOpen className="h-4 w-4" />

                                                        </div>


                                                        <div>

                                                            <p
                                                                className="
                                                                    text-sm
                                                                    font-medium
                                                                    text-[#2a1d15]
                                                                "
                                                            >
                                                                {book.title}
                                                            </p>


                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-[#9a8778]
                                                                "
                                                            >
                                                                ID: {book.id}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* AUTHOR */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-[#735e50]
                                                    "
                                                >
                                                    {book.author}
                                                </td>


                                                {/* ISBN */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-[#735e50]
                                                    "
                                                >
                                                    {book.isbn || "—"}
                                                </td>


                                                {/* STATUS */}

                                                <td className="px-5 py-4">

                                                    {book.available ? (

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

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>


            {/* =================================================
                ADD BOOK MODAL
            ================================================= */}

            {showForm && (

                <BookForm
                    onSuccess={handleSuccess}
                    onCancel={() =>
                        setShowForm(false)
                    }
                />

            )}

        </div>
    );
}


// =========================================================
// BOOK FORM
// =========================================================

function BookForm({
    onSuccess,
    onCancel,
}) {

    const [title, setTitle] =
        useState("");

    const [author, setAuthor] =
        useState("");

    const [isbn, setIsbn] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // SUBMIT
    // =====================================================

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");


        // Basic validation.

        if (!title.trim()) {

            setError(
                "Book title is required."
            );

            return;
        }


        if (!author.trim()) {

            setError(
                "Author is required."
            );

            return;
        }


        try {

            setLoading(true);


            await api.books.create({

                title:
                    title.trim(),

                author:
                    author.trim(),

                isbn:
                    isbn.trim(),
            });


            onSuccess();

        } catch (err) {

            setError(
                err.message ||
                "Unable to create book."
            );

        } finally {

            setLoading(false);
        }
    }


    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                px-4
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    rounded-xl
                    border
                    border-[#e5d7c5]
                    bg-[#faf4ec]
                    p-6
                    shadow-2xl
                "
            >

                {/* HEADER */}

                <div
                    className="
                        mb-5
                        flex
                        items-center
                        justify-between
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
                            Add Book
                        </h2>


                        <p
                            className="
                                mt-1
                                text-xs
                                text-[#735e50]
                            "
                        >
                            Add a new book to the library.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onCancel}
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-[#735e50]
                            hover:bg-[#eee2d5]
                        "
                    >

                        <X className="h-4 w-4" />

                    </button>

                </div>


                {/* ERROR */}

                {error && (

                    <div
                        className="
                            mb-4
                            rounded-lg
                            border
                            border-red-200
                            bg-red-50
                            px-3
                            py-2
                            text-xs
                            text-red-700
                        "
                    >
                        {error}
                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    {/* TITLE */}

                    <div>

                        <label
                            className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-[#463529]
                            "
                        >
                            Book Title
                        </label>


                        <input
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            placeholder="Enter book title"
                            disabled={loading}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-[#ddd0c1]
                                bg-white
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                                focus:border-[#a8652c]
                            "
                        />

                    </div>


                    {/* AUTHOR */}

                    <div>

                        <label
                            className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-[#463529]
                            "
                        >
                            Author
                        </label>


                        <input
                            type="text"
                            value={author}
                            onChange={(e) =>
                                setAuthor(
                                    e.target.value
                                )
                            }
                            placeholder="Enter author name"
                            disabled={loading}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-[#ddd0c1]
                                bg-white
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                                focus:border-[#a8652c]
                            "
                        />

                    </div>


                    {/* ISBN */}

                    <div>

                        <label
                            className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-[#463529]
                            "
                        >
                            ISBN
                        </label>


                        <input
                            type="text"
                            value={isbn}
                            onChange={(e) =>
                                setIsbn(
                                    e.target.value
                                )
                            }
                            placeholder="Enter ISBN"
                            disabled={loading}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-[#ddd0c1]
                                bg-white
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                                focus:border-[#a8652c]
                            "
                        />

                    </div>


                    {/* BUTTONS */}

                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                            pt-2
                        "
                    >

                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="
                                rounded-lg
                                border
                                border-[#ddd0c1]
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-[#73533b]
                                hover:bg-[#f5ede3]
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                rounded-lg
                                bg-[#a8652c]
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                hover:bg-[#8f501e]
                                disabled:opacity-50
                            "
                        >

                            {loading
                                ? "Adding..."
                                : "Add Book"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}