import { useEffect, useMemo, useState } from "react";

import {
    ArrowLeft,
    IndianRupee,
    Search,
    AlertCircle,
    CheckCircle,
    X,
    Clock,
    BookOpen,
    Users,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";


// =========================================================
// ADMIN FINES PAGE
// =========================================================

export default function AdminFines() {

    // =====================================================
    // STATE
    // =====================================================

    const [fines, setFines] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("ALL");


    // =====================================================
    // LOAD FINES
    // =====================================================

    async function loadFines() {

        try {

            setLoading(true);

            setError("");

            const data =
                await api.fines.getAll();


            // =================================================
            // NORMAL ARRAY RESPONSE
            // =================================================

            if (Array.isArray(data)) {

                setFines(data);

                return;
            }


            // =================================================
            // PAGINATED RESPONSE
            // =================================================

            if (
                data &&
                Array.isArray(data.content)
            ) {

                setFines(
                    data.content
                );

                return;
            }


            // =================================================
            // FALLBACK
            // =================================================

            setFines([]);

        } catch (err) {

            console.error(
                "Failed to load fines:",
                err
            );

            setError(
                err.message ||
                "Unable to load fines."
            );

        } finally {

            setLoading(false);
        }
    }


    // =====================================================
    // LOAD ON PAGE OPEN
    // =====================================================

    useEffect(() => {

        loadFines();

    }, []);


    // =====================================================
    // GET BOOK TITLE
    // =====================================================

    function getBookTitle(fine) {

        return (
            fine.bookTitle ||

            fine.book?.title ||

            fine.title ||

            "Unknown Book"
        );
    }


    // =====================================================
    // GET MEMBER NAME
    // =====================================================

    function getMemberName(fine) {

        return (
            fine.memberName ||

            fine.member?.name ||

            fine.userName ||

            fine.user?.name ||

            "Unknown Member"
        );
    }


    // =====================================================
    // GET MEMBER ID
    // =====================================================

    function getMemberId(fine) {

        return (
            fine.memberId ||

            fine.member?.memberId ||

            fine.member?.id ||

            fine.userId ||

            fine.user?.id ||

            "—"
        );
    }


    // =====================================================
    // GET MEMBER EMAIL
    // =====================================================

    function getMemberEmail(fine) {

        return (
            fine.member?.email ||

            fine.user?.email ||

            fine.email ||

            ""
        );
    }


    // =====================================================
    // GET DUE DATE
    // =====================================================

    function getDueDate(fine) {

        return (
            fine.dueDate ||

            fine.dueAt ||

            null
        );
    }


    // =====================================================
    // GET RETURN DATE
    // =====================================================

    function getReturnDate(fine) {

        return (
            fine.returnDate ||

            fine.returnedAt ||

            null
        );
    }


    // =====================================================
    // GET AMOUNT
    // =====================================================

    function getAmount(fine) {

        const amount =
            fine.amount ??
            fine.fineAmount ??
            fine.totalAmount ??
            0;


        const numericAmount =
            Number(amount);


        return Number.isFinite(
            numericAmount
        )
            ? numericAmount
            : 0;
    }


    // =====================================================
    // GET OVERDUE DAYS
    // =====================================================

    function getOverdueDays(fine) {

        // Use backend value if available.

        if (
            fine.overdueDays !==
            undefined &&
            fine.overdueDays !==
            null
        ) {

            return Number(
                fine.overdueDays
            );
        }


        if (
            fine.daysOverdue !==
            undefined &&
            fine.daysOverdue !==
            null
        ) {

            return Number(
                fine.daysOverdue
            );
        }


        // Otherwise calculate only for display.

        const dueDate =
            getDueDate(fine);


        const returnDate =
            getReturnDate(fine);


        if (!dueDate) {

            return 0;
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

            return 0;
        }


        const endDate =
            returnDate
                ? new Date(returnDate)
                : new Date();


        if (
            Number.isNaN(
                endDate.getTime()
            )
        ) {

            return 0;
        }


        const difference =
            endDate.getTime() -
            due.getTime();


        const days =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );


        return Math.max(
            days,
            0
        );
    }


    // =====================================================
    // CHECK WHETHER FINE EXISTS
    // =====================================================

    function isPaid(fine) {

        return (
            fine.paid === true ||

            fine.isPaid === true ||

            String(
                fine.status || ""
            ).toUpperCase() ===
                "PAID"
        );
    }


    // =====================================================
    // CHECK ACTIVE / UNPAID
    // =====================================================

    function isOutstanding(fine) {

        return !isPaid(fine);
    }


    // =====================================================
    // FORMAT DATE
    // =====================================================

    function formatDate(date) {

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
    // FORMAT MONEY
    // =====================================================

    function formatMoney(amount) {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
            }
        ).format(amount);
    }


    // =====================================================
    // GET INITIAL
    // =====================================================

    function getInitial(name) {

        if (!name) {

            return "?";
        }


        return name
            .charAt(0)
            .toUpperCase();
    }


    // =====================================================
    // FILTER FINES
    // =====================================================

    const filteredFines =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();


            return fines.filter(
                (fine) => {

                    // -----------------------------------------
                    // SEARCH
                    // -----------------------------------------

                    const bookTitle =
                        getBookTitle(
                            fine
                        ).toLowerCase();


                    const memberName =
                        getMemberName(
                            fine
                        ).toLowerCase();


                    const memberId =
                        String(
                            getMemberId(
                                fine
                            )
                        ).toLowerCase();


                    const matchesSearch =
                        !searchValue ||

                        bookTitle.includes(
                            searchValue
                        ) ||

                        memberName.includes(
                            searchValue
                        ) ||

                        memberId.includes(
                            searchValue
                        );


                    if (!matchesSearch) {

                        return false;
                    }


                    // -----------------------------------------
                    // STATUS FILTER
                    // -----------------------------------------

                    if (
                        filter ===
                        "OUTSTANDING"
                    ) {

                        return isOutstanding(
                            fine
                        );
                    }


                    if (
                        filter ===
                        "PAID"
                    ) {

                        return isPaid(
                            fine
                        );
                    }


                    return true;
                }
            );

        }, [
            fines,
            search,
            filter,
        ]);


    // =====================================================
    // TOTAL FINE AMOUNT
    // =====================================================

    const totalFineAmount =
        useMemo(() => {

            return fines.reduce(
                (
                    total,
                    fine
                ) => {

                    return (
                        total +
                        getAmount(
                            fine
                        )
                    );

                },
                0
            );

        }, [fines]);


    // =====================================================
    // OUTSTANDING AMOUNT
    // =====================================================

    const outstandingAmount =
        useMemo(() => {

            return fines.reduce(
                (
                    total,
                    fine
                ) => {

                    if (
                        !isOutstanding(
                            fine
                        )
                    ) {

                        return total;
                    }


                    return (
                        total +
                        getAmount(
                            fine
                        )
                    );

                },
                0
            );

        }, [fines]);


    // =====================================================
    // OUTSTANDING COUNT
    // =====================================================

    const outstandingCount =
        useMemo(() => {

            return fines.filter(
                (fine) =>
                    isOutstanding(
                        fine
                    )
            ).length;

        }, [fines]);


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
                            Fines
                        </h1>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-[#735e50]
                            "
                        >
                            View automatically calculated library fines.
                        </p>

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

                            <span>
                                {error}
                            </span>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                            className="
                                rounded
                                p-1
                                hover:bg-red-100
                            "
                        >

                            <X
                                className="h-4 w-4"
                            />

                        </button>

                    </div>

                )}


                {/* =================================================
                    SUMMARY CARDS
                ================================================= */}

                {!loading && (

                    <div
                        className="
                            mb-6
                            grid
                            gap-4
                            sm:grid-cols-2
                            lg:grid-cols-3
                        "
                    >

                        {/* TOTAL FINES */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-[#e5d7c5]
                                bg-white
                                p-5
                                shadow-sm
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-start
                                    justify-between
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            text-[#735e50]
                                        "
                                    >
                                        Total Fines
                                    </p>


                                    <p
                                        className="
                                            mt-2
                                            text-2xl
                                            font-semibold
                                            text-[#2a1d15]
                                        "
                                    >
                                        {
                                            formatMoney(
                                                totalFineAmount
                                            )
                                        }
                                    </p>

                                </div>


                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-[#f1e3d3]
                                        text-[#a8652c]
                                    "
                                >

                                    <IndianRupee
                                        className="h-5 w-5"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* OUTSTANDING */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-[#e5d7c5]
                                bg-white
                                p-5
                                shadow-sm
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-start
                                    justify-between
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            text-[#735e50]
                                        "
                                    >
                                        Outstanding
                                    </p>


                                    <p
                                        className="
                                            mt-2
                                            text-2xl
                                            font-semibold
                                            text-[#2a1d15]
                                        "
                                    >
                                        {
                                            formatMoney(
                                                outstandingAmount
                                            )
                                        }
                                    </p>

                                </div>


                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-red-50
                                        text-red-600
                                    "
                                >

                                    <Clock
                                        className="h-5 w-5"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* RECORDS */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-[#e5d7c5]
                                bg-white
                                p-5
                                shadow-sm
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-start
                                    justify-between
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            text-[#735e50]
                                        "
                                    >
                                        Outstanding Records
                                    </p>


                                    <p
                                        className="
                                            mt-2
                                            text-2xl
                                            font-semibold
                                            text-[#2a1d15]
                                        "
                                    >
                                        {
                                            outstandingCount
                                        }
                                    </p>

                                </div>


                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-[#f1e3d3]
                                        text-[#a8652c]
                                    "
                                >

                                    <AlertCircle
                                        className="h-5 w-5"
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    SEARCH + FILTER
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
                            flex
                            flex-col
                            gap-3
                            lg:flex-row
                        "
                    >

                        {/* SEARCH */}

                        <div
                            className="
                                relative
                                flex-1
                            "
                        >

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
                                placeholder="Search by book, member or member ID..."
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


                        {/* FILTER */}

                        <select
                            value={filter}
                            onChange={(event) =>
                                setFilter(
                                    event.target.value
                                )
                            }
                            className="
                                rounded-lg
                                border
                                border-[#ddd0c1]
                                bg-[#fffdfb]
                                px-4
                                py-2.5
                                text-sm
                                text-[#2a1d15]
                                outline-none
                                focus:border-[#a8652c]
                                focus:ring-1
                                focus:ring-[#a8652c]
                            "
                        >

                            <option value="ALL">
                                All Fines
                            </option>

                            <option value="OUTSTANDING">
                                Outstanding
                            </option>

                            <option value="PAID">
                                Paid
                            </option>

                        </select>

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
                                Loading fines...
                            </p>

                        </div>

                    ) : filteredFines.length === 0 ? (

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

                                <IndianRupee
                                    className="h-5 w-5"
                                />

                            </div>


                            <h3
                                className="
                                    font-medium
                                    text-[#2a1d15]
                                "
                            >
                                No fines found
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-center
                                    text-sm
                                    text-[#9a8778]
                                "
                            >

                                {search
                                    ? "Try a different search."
                                    : "There are currently no fine records."}

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

                                <thead
                                    className="
                                        border-b
                                        border-[#e5d7c5]
                                        bg-[#fcf8f3]
                                    "
                                >

                                    <tr>

                                        {/* BOOK */}

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


                                        {/* MEMBER */}

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


                                        {/* DUE DATE */}

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


                                        {/* RETURN DATE */}

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
                                            Return Date
                                        </th>


                                        {/* OVERDUE DAYS */}

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
                                            Overdue
                                        </th>


                                        {/* AMOUNT */}

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
                                            Fine
                                        </th>


                                        {/* STATUS */}

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

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredFines.map(
                                        (fine, index) => {

                                            const amount =
                                                getAmount(
                                                    fine
                                                );


                                            const overdueDays =
                                                getOverdueDays(
                                                    fine
                                                );


                                            const memberName =
                                                getMemberName(
                                                    fine
                                                );


                                            const memberEmail =
                                                getMemberEmail(
                                                    fine
                                                );


                                            const paid =
                                                isPaid(
                                                    fine
                                                );


                                            return (

                                                <tr
                                                    key={
                                                        fine.id ??
                                                        `${getBookTitle(fine)}-${getMemberId(fine)}-${index}`
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
                                                                        getBookTitle(
                                                                            fine
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

                                                                    ID:{" "}
                                                                    {
                                                                        getMemberId(
                                                                            fine
                                                                        )
                                                                    }

                                                                    {memberEmail && (
                                                                        <>
                                                                            {" • "}
                                                                            {
                                                                                memberEmail
                                                                            }
                                                                        </>
                                                                    )}

                                                                </p>

                                                            </div>

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
                                                            text-sm
                                                            text-[#735e50]
                                                        "
                                                    >

                                                        {
                                                            formatDate(
                                                                getDueDate(
                                                                    fine
                                                                )
                                                            )
                                                        }

                                                    </td>


                                                    {/* =================================
                                                        RETURN DATE
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
                                                                getReturnDate(
                                                                    fine
                                                                )
                                                            )
                                                        }

                                                    </td>


                                                    {/* =================================
                                                        OVERDUE DAYS
                                                    ================================= */}

                                                    <td
                                                        className="
                                                            whitespace-nowrap
                                                            px-5
                                                            py-4
                                                        "
                                                    >

                                                        {overdueDays >
                                                        0 ? (

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

                                                                {
                                                                    overdueDays
                                                                }{" "}
                                                                day
                                                                {overdueDays !==
                                                                1
                                                                    ? "s"
                                                                    : ""}

                                                            </span>

                                                        ) : (

                                                            <span
                                                                className="
                                                                    text-sm
                                                                    text-[#9a8778]
                                                                "
                                                            >
                                                                0 days
                                                            </span>

                                                        )}

                                                    </td>


                                                    {/* =================================
                                                        AMOUNT
                                                    ================================= */}

                                                    <td
                                                        className="
                                                            whitespace-nowrap
                                                            px-5
                                                            py-4
                                                        "
                                                    >

                                                        <span
                                                            className="
                                                                text-sm
                                                                font-semibold
                                                                text-[#2a1d15]
                                                            "
                                                        >
                                                            {
                                                                formatMoney(
                                                                    amount
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

                                                        {paid ? (

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
                                                                Paid
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
                                                                Outstanding
                                                            </span>

                                                        )}

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