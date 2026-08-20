import { useEffect, useState } from "react";

import {
    ArrowLeft,
    Edit,
    Plus,
    Search,
    BookOpen,
    X,
    CheckCircle,
    AlertCircle,
    Trash2,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";


// =========================================================
// ADMIN BOOKS
// =========================================================

export default function AdminBooks() {

    // =====================================================
    // BOOK STATE
    // =====================================================

    const [books, setBooks] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState(null);


    // =====================================================
    // SEARCH
    // =====================================================

    const [search, setSearch] = useState("");


    // =====================================================
    // PAGINATION
    // =====================================================

    const [page, setPage] = useState(0);

    const [totalPages, setTotalPages] = useState(1);

    const [totalElements, setTotalElements] = useState(0);

    const pageSize = 10;


    // =====================================================
    // MESSAGES
    // =====================================================

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // MODAL
    // =====================================================

    const [showForm, setShowForm] = useState(false);

    const [editingBook, setEditingBook] = useState(null);


    // =====================================================
    // FORM
    // =====================================================

    const [form, setForm] = useState({
        title: "",
        author: "",
    });


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
            // NORMAL ARRAY RESPONSE
            // =================================================

            if (Array.isArray(data)) {

                setBooks(data);

                setTotalPages(1);

                setTotalElements(
                    data.length
                );

                return;
            }


            // =================================================
            // FALLBACK
            // =================================================

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
    // LOAD WHEN PAGE / SEARCH CHANGES
    // =====================================================

    useEffect(() => {

        loadBooks();

    }, [page, search]);


    // =====================================================
    // SEARCH CHANGE
    // =====================================================

    function handleSearchChange(event) {

        setSearch(
            event.target.value
        );

        setPage(0);
    }


    // =====================================================
    // OPEN ADD BOOK FORM
    // =====================================================

    function handleAddBook() {

        setEditingBook(null);

        setForm({
            title: "",
            author: "",
        });

        setError("");

        setSuccess("");

        setShowForm(true);
    }


    // =====================================================
    // OPEN EDIT BOOK FORM
    // =====================================================

    function handleEditBook(book) {

        setEditingBook(book);

        setForm({
            title:
                book.title || "",

            author:
                book.author || "",
        });

        setError("");

        setSuccess("");

        setShowForm(true);
    }


    // =====================================================
    // CLOSE FORM
    // =====================================================

    function handleCloseForm() {

        if (saving) {

            return;
        }


        setShowForm(false);

        setEditingBook(null);

        setError("");
    }


    // =====================================================
    // FORM CHANGE
    // =====================================================

    function handleChange(event) {

        const {
            name,
            value,
        } = event.target;


        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }


    // =====================================================
    // SAVE BOOK
    // =====================================================

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");

        setSuccess("");


        // -------------------------------------------------
        // VALIDATE TITLE
        // -------------------------------------------------

        if (!form.title.trim()) {

            setError(
                "Book title is required."
            );

            return;
        }


        // -------------------------------------------------
        // VALIDATE AUTHOR
        // -------------------------------------------------

        if (!form.author.trim()) {

            setError(
                "Author is required."
            );

            return;
        }


        try {

            setSaving(true);


            // =================================================
            // UPDATE
            // =================================================

            if (editingBook) {

                await api.books.update(
                    editingBook.id,
                    {
                        title:
                            form.title.trim(),

                        author:
                            form.author.trim(),
                    }
                );


                setSuccess(
                    "Book updated successfully."
                );

            }


            // =================================================
            // CREATE
            // =================================================

            else {

                await api.books.create({
                    title:
                        form.title.trim(),

                    author:
                        form.author.trim(),
                });


                setSuccess(
                    "Book added successfully."
                );
            }


            // Close modal.

            setShowForm(false);

            setEditingBook(null);


            // Refresh books.

            await loadBooks();


            // Clear success message.

            setTimeout(() => {

                setSuccess("");

            }, 4000);

        } catch (err) {

            console.error(
                "Failed to save book:",
                err
            );

            setError(
                err.message ||
                "Unable to save book."
            );

        } finally {

            setSaving(false);
        }
    }


    // =====================================================
    // DELETE BOOK
    // =====================================================

    async function handleDeleteBook(book) {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${book.title}"?`
            );


        if (!confirmed) {

            return;
        }


        try {

            setDeletingId(
                book.id
            );

            setError("");

            setSuccess("");


            await api.books.delete(
                book.id
            );


            setSuccess(
                "Book deleted successfully."
            );


            await loadBooks();


            setTimeout(() => {

                setSuccess("");

            }, 4000);

        } catch (err) {

            console.error(
                "Failed to delete book:",
                err
            );


            setError(
                err.message ||
                "Unable to delete book."
            );

        } finally {

            setDeletingId(null);
        }
    }


    // =====================================================
    // GET AVAILABILITY
    // =====================================================

    function getAvailability(book) {

        /*
         * The backend may return the field as:
         *
         * available
         * isAvailable
         * availableCopies
         */

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


        return null;
    }


    // =====================================================
    // GET INITIAL
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
                            Add, update and manage library books.
                        </p>

                    </div>


                    {/* ADD BOOK */}

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
                        "
                    >

                        <Plus
                            className="h-4 w-4"
                        />

                        Add Book

                    </button>

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

                {error && !showForm && (

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
                                handleSearchChange
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
                                Loading books...
                            </p>

                        </div>

                    ) : books.length === 0 ? (

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
                                No books found
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-center
                                    text-sm
                                    text-[#9a8778]
                                "
                            >
                                Add a book or try a different search.
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

                                {/* TABLE HEADER */}

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
                                            ID
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
                                            Author
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
                                            Availability
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
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                {/* TABLE BODY */}

                                <tbody>

                                    {books.map(
                                        (book) => {

                                            const available =
                                                getAvailability(
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

                                                    {/* ID */}

                                                    <td
                                                        className="
                                                            whitespace-nowrap
                                                            px-5
                                                            py-4
                                                            text-sm
                                                            text-[#9a8778]
                                                        "
                                                    >

                                                        #{book.id}

                                                    </td>


                                                    {/* BOOK */}

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

                                                                <span
                                                                    className="
                                                                        text-sm
                                                                        font-semibold
                                                                    "
                                                                >
                                                                    {
                                                                        getInitial(
                                                                            book.title
                                                                        )
                                                                    }
                                                                </span>

                                                            </div>


                                                            <span
                                                                className="
                                                                    text-sm
                                                                    font-medium
                                                                    text-[#2a1d15]
                                                                "
                                                            >
                                                                {
                                                                    book.title ||
                                                                    "Untitled"
                                                                }
                                                            </span>

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

                                                        {available ===
                                                        true ? (

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

                                                        ) : available ===
                                                          false ? (

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

                                                        ) : (

                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    rounded-full
                                                                    bg-[#f1e3d3]
                                                                    px-2.5
                                                                    py-1
                                                                    text-xs
                                                                    font-medium
                                                                    text-[#735e50]
                                                                "
                                                            >
                                                                Unknown
                                                            </span>

                                                        )}

                                                    </td>


                                                    {/* ACTIONS */}

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
                                                                gap-2
                                                            "
                                                        >

                                                            {/* EDIT */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleEditBook(
                                                                        book
                                                                    )
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
                                                                    transition
                                                                    hover:bg-[#f5ede3]
                                                                "
                                                            >

                                                                <Edit
                                                                    className="
                                                                        h-3.5
                                                                        w-3.5
                                                                    "
                                                                />

                                                                Edit

                                                            </button>


                                                            {/* DELETE */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeleteBook(
                                                                        book
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingId ===
                                                                    book.id
                                                                }
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    gap-2
                                                                    rounded-lg
                                                                    border
                                                                    border-red-200
                                                                    bg-white
                                                                    px-3
                                                                    py-2
                                                                    text-xs
                                                                    font-medium
                                                                    text-red-600
                                                                    transition
                                                                    hover:bg-red-50
                                                                    disabled:cursor-not-allowed
                                                                    disabled:opacity-50
                                                                "
                                                            >

                                                                <Trash2
                                                                    className="
                                                                        h-3.5
                                                                        w-3.5
                                                                    "
                                                                />

                                                                {deletingId ===
                                                                book.id
                                                                    ? "Deleting..."
                                                                    : "Delete"}

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
                                Showing page{" "}
                                <span
                                    className="
                                        font-medium
                                        text-[#2a1d15]
                                    "
                                >
                                    {page + 1}
                                </span>{" "}
                                of{" "}
                                <span
                                    className="
                                        font-medium
                                        text-[#2a1d15]
                                    "
                                >
                                    {totalPages}
                                </span>

                                {totalElements > 0 && (
                                    <>
                                        {" "}
                                        ({totalElements} books)
                                    </>
                                )}

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


            {/* =====================================================
                ADD / EDIT BOOK MODAL
            ===================================================== */}

            {showForm && (

                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/30
                        p-4
                    "
                >

                    <div
                        className="
                            max-h-[90vh]
                            w-full
                            max-w-lg
                            overflow-y-auto
                            rounded-2xl
                            border
                            border-[#e5d7c5]
                            bg-white
                            shadow-xl
                        "
                    >

                        {/* =================================================
                            MODAL HEADER
                        ================================================= */}

                        <div
                            className="
                                sticky
                                top-0
                                z-10
                                flex
                                items-center
                                justify-between
                                border-b
                                border-[#e5d7c5]
                                bg-white
                                px-6
                                py-5
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

                                    {editingBook
                                        ? "Edit Book"
                                        : "Add Book"}

                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-[#9a8778]
                                    "
                                >

                                    {editingBook
                                        ? "Update the book information."
                                        : "Add a new book to the library."}

                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={handleCloseForm}
                                disabled={saving}
                                className="
                                    rounded-lg
                                    p-2
                                    text-[#735e50]
                                    transition
                                    hover:bg-[#f1e3d3]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                <X
                                    className="h-5 w-5"
                                />

                            </button>

                        </div>


                        {/* =================================================
                            FORM ERROR
                        ================================================= */}

                        {error && (

                            <div
                                className="
                                    mx-6
                                    mt-5
                                    flex
                                    items-start
                                    gap-2
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

                                <AlertCircle
                                    className="
                                        mt-0.5
                                        h-4
                                        w-4
                                        shrink-0
                                    "
                                />

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        {/* =================================================
                            FORM
                        ================================================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="
                                space-y-5
                                p-6
                            "
                        >

                            {/* TITLE */}

                            <div>

                                <label
                                    htmlFor="book-title"
                                    className="
                                        mb-1.5
                                        block
                                        text-sm
                                        font-medium
                                        text-[#463529]
                                    "
                                >
                                    Book Title
                                </label>


                                <input
                                    id="book-title"
                                    type="text"
                                    name="title"
                                    value={
                                        form.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={saving}
                                    placeholder="Enter book title"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-[#ddd0c1]
                                        bg-[#fffdfb]
                                        px-3
                                        py-2.5
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


                            {/* AUTHOR */}

                            <div>

                                <label
                                    htmlFor="book-author"
                                    className="
                                        mb-1.5
                                        block
                                        text-sm
                                        font-medium
                                        text-[#463529]
                                    "
                                >
                                    Author
                                </label>


                                <input
                                    id="book-author"
                                    type="text"
                                    name="author"
                                    value={
                                        form.author
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={saving}
                                    placeholder="Enter author name"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-[#ddd0c1]
                                        bg-[#fffdfb]
                                        px-3
                                        py-2.5
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
                                    onClick={
                                        handleCloseForm
                                    }
                                    disabled={saving}
                                    className="
                                        rounded-lg
                                        border
                                        border-[#ddd0c1]
                                        bg-white
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-[#735e50]
                                        transition
                                        hover:bg-[#f5ede3]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="
                                        rounded-lg
                                        bg-[#a8652c]
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-[#8f501e]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {saving
                                        ? "Saving..."
                                        : editingBook
                                            ? "Update Book"
                                            : "Add Book"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}