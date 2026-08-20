import { useEffect, useState } from "react";

import {
    BookOpen,
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";


export default function AdminBooks() {

    // =====================================================
    // BOOK DATA
    // =====================================================

    const [books, setBooks] = useState([]);


    // =====================================================
    // LOADING / ERROR
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // SEARCH
    // =====================================================

    const [titleSearch, setTitleSearch] =
        useState("");

    const [authorSearch, setAuthorSearch] =
        useState("");


    // =====================================================
    // PAGINATION
    // =====================================================

    const [page, setPage] =
        useState(0);

    const [pageSize] =
        useState(10);


    /*
     * We don't know the total number of pages
     * because the backend returns List<Book>.
     *
     * So we use whether the returned list contains
     * a full page to determine whether a next page
     * might exist.
     */
    const [hasNextPage, setHasNextPage] =
        useState(false);


    // =====================================================
    // FORM
    // =====================================================

    const [showForm, setShowForm] =
        useState(false);

    const [editingBook, setEditingBook] =
        useState(null);


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

                    title: titleSearch,

                    author: authorSearch,

                });


            /*
             * Backend returns List<Book>.
             *
             * Make sure we always store an array.
             */
            const result =
                Array.isArray(data)
                    ? data
                    : [];


            setBooks(result);


            /*
             * If we receive a full page,
             * there may be another page.
             */
            setHasNextPage(
                result.length === pageSize
            );

        } catch (err) {

            setError(
                err.message ||
                "Unable to load books."
            );

        } finally {

            setLoading(false);
        }
    }


    // =====================================================
    // LOAD WHEN PAGE / SEARCH CHANGES
    // =====================================================

    useEffect(() => {

        loadBooks();

    }, [
        page,
        titleSearch,
        authorSearch,
    ]);


    // =====================================================
    // SEARCH
    // =====================================================

    function handleTitleSearch(value) {

        setTitleSearch(value);

        /*
         * Start from first page when
         * search criteria changes.
         */
        setPage(0);
    }


    function handleAuthorSearch(value) {

        setAuthorSearch(value);

        setPage(0);
    }


    // =====================================================
    // ADD BOOK
    // =====================================================

    function handleAddBook() {

        setEditingBook(null);

        setShowForm(true);

    }


    // =====================================================
    // EDIT BOOK
    // =====================================================

    function handleEditBook(book) {

        setEditingBook(book);

        setShowForm(true);

    }


    // =====================================================
    // DELETE BOOK
    // =====================================================

    async function handleDeleteBook(book) {

        /*
         * The backend DELETE endpoint has not been
         * added yet.
         *
         * We keep this function ready so that when
         * DELETE /api/books/{id} is implemented,
         * only this API call needs to be enabled.
         */

        const confirmed =
            window.confirm(
                `Delete "${book.title}"?`
            );


        if (!confirmed) {

            return;
        }


        try {

            setError("");


            await api.books.delete(
                book.id
            );


            await loadBooks();

        } catch (err) {

            /*
             * Currently this will normally return
             * an error because the backend DELETE
             * endpoint hasn't been implemented yet.
             */
            setError(
                err.message ||
                "Book deletion is not available yet."
            );
        }
    }


    // =====================================================
    // FORM SUCCESS
    // =====================================================

    async function handleFormSuccess() {

        setShowForm(false);

        setEditingBook(null);

        await loadBooks();
    }


    // =====================================================
    // FORM CANCEL
    // =====================================================

    function handleFormCancel() {

        setShowForm(false);

        setEditingBook(null);
    }


    return (

        <div
            className="
                min-h-screen
                bg-[#faf4ec]
            "
        >

            {/* =================================================
                NAVBAR
            ================================================= */}

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
                            Manage the library book collection.
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
                            transition
                            hover:bg-[#8f501e]
                            active:scale-[0.98]
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
                            items-start
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
                            className="
                                ml-4
                                text-red-500
                                hover:text-red-700
                            "
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

                    <div
                        className="
                            grid
                            gap-3
                            md:grid-cols-2
                        "
                    >

                        {/* Title */}

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
                                value={titleSearch}
                                onChange={(e) =>
                                    handleTitleSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search by title..."
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
                                    placeholder:text-[#a8988a]
                                    focus:border-[#a8652c]
                                    focus:ring-2
                                    focus:ring-[#a8652c]/10
                                "
                            />

                        </div>


                        {/* Author */}

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
                                value={authorSearch}
                                onChange={(e) =>
                                    handleAuthorSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search by author..."
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
                                    placeholder:text-[#a8988a]
                                    focus:border-[#a8652c]
                                    focus:ring-2
                                    focus:ring-[#a8652c]/10
                                "
                            />

                        </div>

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

                    ) : books.length === 0 ? (

                        <div
                            className="
                                flex
                                min-h-64
                                flex-col
                                items-center
                                justify-center
                                px-6
                                text-center
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
                                    text-[#8e7b6d]
                                "
                            >
                                Try changing your search or add a new book.
                            </p>

                        </div>

                    ) : (

                        <>

                            <div className="overflow-x-auto">

                                <table
                                    className="
                                        min-w-full
                                        text-left
                                    "
                                >

                                    <thead
                                        className="
                                            border-b
                                            border-[#e5d7c5]
                                            bg-[#fcf8f3]
                                        "
                                    >

                                        <tr>

                                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#735e50]">
                                                Title
                                            </th>

                                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#735e50]">
                                                Author
                                            </th>

                                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#735e50]">
                                                ISBN
                                            </th>

                                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#735e50]">
                                                Status
                                            </th>

                                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#735e50]">
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {books.map((book) => (

                                            <tr
                                                key={book.id}
                                                className="
                                                    border-b
                                                    border-[#eee5dc]
                                                    last:border-b-0
                                                    hover:bg-[#fffaf5]
                                                "
                                            >

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
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                bg-[#f1e3d3]
                                                                text-[#a8652c]
                                                            "
                                                        >

                                                            <BookOpen className="h-4 w-4" />

                                                        </div>


                                                        <span
                                                            className="
                                                                text-sm
                                                                font-medium
                                                                text-[#2a1d15]
                                                            "
                                                        >
                                                            {book.title}
                                                        </span>

                                                    </div>

                                                </td>


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


                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-[#735e50]
                                                    "
                                                >
                                                    {book.isbn}
                                                </td>


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
                                                                bg-orange-50
                                                                px-2.5
                                                                py-1
                                                                text-xs
                                                                font-medium
                                                                text-orange-700
                                                            "
                                                        >
                                                            Borrowed
                                                        </span>

                                                    )}

                                                </td>


                                                <td className="px-5 py-4">

                                                    <div
                                                        className="
                                                            flex
                                                            justify-end
                                                            gap-2
                                                        "
                                                    >

                                                        {/* Edit */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEditBook(
                                                                    book
                                                                )
                                                            }
                                                            className="
                                                                flex
                                                                h-8
                                                                w-8
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                text-[#73533b]
                                                                hover:bg-[#f1e3d3]
                                                            "
                                                            title="Edit book"
                                                        >

                                                            <Pencil className="h-4 w-4" />

                                                        </button>


                                                        {/* Delete */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteBook(
                                                                    book
                                                                )
                                                            }
                                                            className="
                                                                flex
                                                                h-8
                                                                w-8
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                text-red-500
                                                                hover:bg-red-50
                                                            "
                                                            title="Delete book"
                                                        >

                                                            <Trash2 className="h-4 w-4" />

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>


                            {/* =================================================
                                PAGINATION
                            ================================================= */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    border-t
                                    border-[#e5d7c5]
                                    px-5
                                    py-3
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        text-[#8e7b6d]
                                    "
                                >
                                    Page {page + 1}
                                </p>


                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <button
                                        type="button"
                                        disabled={
                                            page === 0 ||
                                            loading
                                        }
                                        onClick={() =>
                                            setPage(
                                                (current) =>
                                                    Math.max(
                                                        0,
                                                        current - 1
                                                    )
                                            )
                                        }
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            items-center
                                            justify-center
                                            rounded-lg
                                            border
                                            border-[#ddd0c1]
                                            bg-white
                                            text-[#73533b]
                                            transition
                                            hover:bg-[#f5ede3]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-40
                                        "
                                    >

                                        <ChevronLeft className="h-4 w-4" />

                                    </button>


                                    <button
                                        type="button"
                                        disabled={
                                            !hasNextPage ||
                                            loading
                                        }
                                        onClick={() =>
                                            setPage(
                                                (current) =>
                                                    current + 1
                                            )
                                        }
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            items-center
                                            justify-center
                                            rounded-lg
                                            border
                                            border-[#ddd0c1]
                                            bg-white
                                            text-[#73533b]
                                            transition
                                            hover:bg-[#f5ede3]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-40
                                        "
                                    >

                                        <ChevronRight className="h-4 w-4" />

                                    </button>

                                </div>

                            </div>

                        </>

                    )}

                </div>

            </main>


            {/* =================================================
                ADD / EDIT FORM
            ================================================= */}

            {showForm && (

                <BookForm
                    book={editingBook}
                    onSuccess={
                        handleFormSuccess
                    }
                    onCancel={
                        handleFormCancel
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
    book,
    onSuccess,
    onCancel,
}) {

    const isEditing =
        Boolean(book);


    const [title, setTitle] =
        useState(
            book?.title || ""
        );


    const [author, setAuthor] =
        useState(
            book?.author || ""
        );


    const [isbn, setIsbn] =
        useState(
            book?.isbn || ""
        );


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


        if (!isbn.trim()) {

            setError(
                "ISBN is required."
            );

            return;
        }


        try {

            setLoading(true);


            const bookData = {

                title:
                    title.trim(),

                author:
                    author.trim(),

                isbn:
                    isbn.trim(),

            };


            if (isEditing) {

                await api.books.update(
                    book.id,
                    bookData
                );

            } else {

                await api.books.create(
                    bookData
                );
            }


            onSuccess();

        } catch (err) {

            setError(
                err.message ||
                "Unable to save book."
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

                {/* Header */}

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
                            {isEditing
                                ? "Edit Book"
                                : "Add Book"}
                        </h2>


                        <p
                            className="
                                mt-1
                                text-xs
                                text-[#735e50]
                            "
                        >
                            Enter the book information below.
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


                {/* Error */}

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


                {/* Form */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    {/* Title */}

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
                            Title
                        </label>


                        <input
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
                                text-[#2a1d15]
                                outline-none
                                placeholder:text-[#a8988a]
                                focus:border-[#a8652c]
                                focus:ring-2
                                focus:ring-[#a8652c]/10
                            "
                        />

                    </div>


                    {/* Author */}

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
                                text-[#2a1d15]
                                outline-none
                                placeholder:text-[#a8988a]
                                focus:border-[#a8652c]
                                focus:ring-2
                                focus:ring-[#a8652c]/10
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
                                text-[#2a1d15]
                                outline-none
                                placeholder:text-[#a8988a]
                                focus:border-[#a8652c]
                                focus:ring-2
                                focus:ring-[#a8652c]/10
                            "
                        />

                    </div>


                    {/* Buttons */}

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
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            {loading
                                ? "Saving..."
                                : isEditing
                                    ? "Update Book"
                                    : "Add Book"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}