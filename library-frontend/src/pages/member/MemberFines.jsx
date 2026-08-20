import { useEffect, useMemo, useState } from "react";

import {
    ArrowLeft,
    IndianRupee,
    BookOpen,
    CalendarDays,
    Clock,
    AlertCircle,
    CheckCircle,
    X,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";

import { useAuth } from "../../context/AuthContext";


// =========================================================
// MEMBER FINES
// =========================================================

export default function MemberFines() {

    // =====================================================
    // AUTHENTICATED USER
    // =====================================================

    const {
        user,
    } = useAuth();


    // =====================================================
    // STATE
    // =====================================================

    const [fines, setFines] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD MY FINES
    // =====================================================

    async function loadFines() {

        try {

            setLoading(true);

            setError("");


            /*
             * The backend endpoint requires the current
             * user's ID.
             *
             * The ID comes from the authenticated user
             * stored by AuthContext.
             */

            if (!user?.id) {

                setError(
                    "Unable to identify the logged-in member."
                );

                return;
            }


            const data =
                await api.fines.getByUserId(
                    user.id
                );


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


            setFines([]);

        } catch (err) {

            console.error(
                "Failed to load fines:",
                err
            );

            setError(
                err.message ||
                "Unable to load your fines."
            );

        } finally {

            setLoading(false);
        }
    }


    // =====================================================
    // LOAD WHEN USER IS AVAILABLE
    // =====================================================

    useEffect(() => {

        if (user?.id) {

            loadFines();

        }

    }, [user?.id]);


    // =====================================================
    // BOOK TITLE
    // =====================================================

    function getBookTitle(
        fine
    ) {

        return (
            fine.bookTitle ||

            fine.book?.title ||

            fine.title ||

            "Unknown Book"
        );
    }


    // =====================================================
    // DUE DATE
    // =====================================================

    function getDueDate(
        fine
    ) {

        return (
            fine.dueDate ||

            fine.dueAt ||

            null
        );
    }


    // =====================================================
    // RETURN DATE
    // =====================================================

    function getReturnDate(
        fine
    ) {

        return (
            fine.returnDate ||

            fine.returnedAt ||

            null
        );
    }


    // =====================================================
    // AMOUNT
    // =====================================================

    function getAmount(
        fine
    ) {

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
    // OVERDUE DAYS
    // =====================================================

    function getOverdueDays(
        fine
    ) {

        /*
         * Prefer the value supplied by the backend.
         */

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


        /*
         * Fallback calculation for display only.
         * The actual fine calculation remains
         * the responsibility of the backend.
         */

        const dueDate =
            getDueDate(fine);


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


        const returnDate =
            getReturnDate(fine);


        const end =
            returnDate
                ? new Date(returnDate)
                : new Date();


        if (
            Number.isNaN(
                end.getTime()
            )
        ) {

            return 0;
        }


        const difference =
            end.getTime() -
            due.getTime();


        return Math.max(
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            ),
            0
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
    // FORMAT MONEY
    // =====================================================

    function formatMoney(
        amount
    ) {

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
    // CHECK PAID
    // =====================================================

    function isPaid(
        fine
    ) {

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
    // TOTAL
    // =====================================================

    const totalFine =
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
    // OUTSTANDING
    // =====================================================

    const outstandingFine =
        useMemo(() => {

            return fines.reduce(
                (
                    total,
                    fine
                ) => {

                    if (
                        isPaid(
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
                        My Fines
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-[#735e50]
                        "
                    >
                        View fines generated for overdue books.
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
                    SUMMARY
                ================================================= */}

                {!loading && (

                    <div
                        className="
                            mb-6
                            grid
                            gap-4
                            sm:grid-cols-2
                        "
                    >

                        {/* TOTAL */}

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
                                                totalFine
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
                                                outstandingFine
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

                                    <AlertCircle
                                        className="h-5 w-5"
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    FINES
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
                                Loading your fines...
                            </p>

                        </div>

                    ) : fines.length === 0 ? (

                        /* =========================================
                           NO FINES
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
                                    bg-green-50
                                    text-green-600
                                "
                            >

                                <CheckCircle
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
                                No fines
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-center
                                    text-sm
                                    text-[#9a8778]
                                "
                            >
                                You currently have no library fines.
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
                                            Return Date
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
                                            Overdue
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
                                            Amount
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

                                    </tr>

                                </thead>


                                <tbody>

                                    {fines.map(
                                        (fine, index) => {

                                            const amount =
                                                getAmount(
                                                    fine
                                                );


                                            const overdueDays =
                                                getOverdueDays(
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
                                                        index
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
                                                                    className="h-4 w-4"
                                                                />

                                                            </div>


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

                                                    </td>


                                                    {/* DUE DATE */}

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
                                                                    getDueDate(
                                                                        fine
                                                                    )
                                                                )
                                                            }

                                                        </div>

                                                    </td>


                                                    {/* RETURN DATE */}

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


                                                    {/* OVERDUE */}

                                                    <td
                                                        className="
                                                            whitespace-nowrap
                                                            px-5
                                                            py-4
                                                        "
                                                    >

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

                                                            <Clock
                                                                className="h-3.5 w-3.5"
                                                            />

                                                            {
                                                                overdueDays
                                                            }{" "}
                                                            day
                                                            {overdueDays !==
                                                            1
                                                                ? "s"
                                                                : ""}

                                                        </span>

                                                    </td>


                                                    {/* AMOUNT */}

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


                                                    {/* STATUS */}

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

                                                                Paid

                                                            </span>

                                                        ) : (

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