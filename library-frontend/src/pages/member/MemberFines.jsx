import { useEffect, useState } from "react";

import {
    IndianRupee,
    Search,
    X,
    AlertCircle,
    CheckCircle,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";


// =========================================================
// MEMBER FINES
// =========================================================

export default function MemberFines() {

    const [fines, setFines] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");


    // =====================================================
    // LOAD MY FINES
    // =====================================================

    async function loadFines() {

        try {

            setLoading(true);

            setError("");

            const data =
                await api.fines.getMy();


            if (Array.isArray(data)) {

                setFines(data);

            } else if (
                data &&
                Array.isArray(data.content)
            ) {

                setFines(data.content);

            } else {

                setFines([]);
            }

        } catch (err) {

            setError(
                err.message ||
                "Unable to load your fines."
            );

        } finally {

            setLoading(false);
        }
    }


    useEffect(() => {

        loadFines();

    }, []);


    // =====================================================
    // HELPERS
    // =====================================================

    function getBookTitle(fine) {

        return (
            fine.book?.title ||
            fine.bookTitle ||
            "Unknown book"
        );
    }


    function getAmount(fine) {

        return (
            fine.amount ??
            fine.fineAmount ??
            fine.totalFine ??
            0
        );
    }


    function getDaysLate(fine) {

        return (
            fine.daysLate ??
            fine.overdueDays ??
            fine.lateDays ??
            0
        );
    }


    function getStatus(fine) {

        return String(
            fine.status ||
            (
                fine.paid
                    ? "PAID"
                    : "UNPAID"
            )
        ).toUpperCase();
    }


    function getDate(fine) {

        return (
            fine.createdAt ||
            fine.calculatedAt ||
            fine.date ||
            fine.fineDate ||
            "—"
        );
    }


    function formatDate(value) {

        if (!value || value === "—") {

            return "—";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return value;
        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    }


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredFines =
        fines.filter((fine) => {

            const value =
                search
                    .toLowerCase()
                    .trim();


            if (!value) {

                return true;
            }


            return (

                getBookTitle(fine)
                    .toLowerCase()
                    .includes(value)

                ||

                String(fine.id || "")
                    .toLowerCase()
                    .includes(value)

                ||

                getStatus(fine)
                    .toLowerCase()
                    .includes(value)

            );
        });


    // =====================================================
    // TOTAL
    // =====================================================

    const totalFine =
        filteredFines.reduce(
            (total, fine) =>
                total +
                Number(getAmount(fine)),
            0
        );


    // =====================================================
    // OUTSTANDING
    // =====================================================

    const outstandingFine =
        filteredFines.reduce(
            (total, fine) => {

                if (
                    getStatus(fine) ===
                    "PAID"
                ) {

                    return total;
                }


                return (
                    total +
                    Number(getAmount(fine))
                );
            },
            0
        );


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
                        My Fines
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-[#735e50]
                        "
                    >
                        View fines generated from late book returns.
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
                    SUMMARY
                ================================================= */}

                <div
                    className="
                        mb-5
                        grid
                        gap-4
                        sm:grid-cols-3
                    "
                >

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

                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-[#9a8778]
                            "
                        >
                            Fine Records
                        </p>


                        <p
                            className="
                                mt-2
                                text-2xl
                                font-semibold
                                text-[#2a1d15]
                            "
                        >
                            {filteredFines.length}
                        </p>

                    </div>


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

                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-[#9a8778]
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
                            ₹{totalFine.toFixed(2)}
                        </p>

                    </div>


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

                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-[#9a8778]
                            "
                        >
                            Outstanding
                        </p>


                        <p
                            className="
                                mt-2
                                text-2xl
                                font-semibold
                                text-[#a8652c]
                            "
                        >
                            ₹{outstandingFine.toFixed(2)}
                        </p>

                    </div>

                </div>


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
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search your fines..."
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
                            Loading your fines...
                        </div>

                    ) : filteredFines.length === 0 ? (

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
                                    bg-green-50
                                    text-green-600
                                "
                            >

                                <CheckCircle
                                    className="h-5 w-5"
                                />

                            </div>


                            <h3
                                className="
                                    font-medium
                                    text-[#2a1d15]
                                "
                            >
                                No fines
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-[#9a8778]
                                "
                            >
                                You currently have no fine records.
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
                                            Days Late
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
                                            Fine
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
                                            Date
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

                                    {filteredFines.map(
                                        (fine) => {

                                            const status =
                                                getStatus(fine);


                                            return (

                                                <tr
                                                    key={
                                                        fine.id
                                                    }
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
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    bg-[#f1e3d3]
                                                                    text-[#a8652c]
                                                                "
                                                            >

                                                                <IndianRupee
                                                                    className="h-4 w-4"
                                                                />

                                                            </div>


                                                            <div>

                                                                <p
                                                                    className="
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


                                                                <p
                                                                    className="
                                                                        mt-0.5
                                                                        text-xs
                                                                        text-[#9a8778]
                                                                    "
                                                                >
                                                                    Fine ID: {
                                                                        fine.id ??
                                                                        "—"
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* DAYS */}

                                                    <td
                                                        className="
                                                            px-5
                                                            py-4
                                                            text-sm
                                                            text-[#735e50]
                                                        "
                                                    >
                                                        {
                                                            getDaysLate(
                                                                fine
                                                            )
                                                        }{" "}
                                                        days
                                                    </td>


                                                    {/* AMOUNT */}

                                                    <td className="px-5 py-4">

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-1
                                                                text-sm
                                                                font-semibold
                                                                text-[#a8652c]
                                                            "
                                                        >

                                                            <IndianRupee
                                                                className="
                                                                    h-3.5
                                                                    w-3.5
                                                                "
                                                            />

                                                            {
                                                                Number(
                                                                    getAmount(
                                                                        fine
                                                                    )
                                                                ).toFixed(2)
                                                            }

                                                        </div>

                                                    </td>


                                                    {/* DATE */}

                                                    <td
                                                        className="
                                                            px-5
                                                            py-4
                                                            text-sm
                                                            text-[#735e50]
                                                        "
                                                    >
                                                        {
                                                            formatDate(
                                                                getDate(
                                                                    fine
                                                                )
                                                            )
                                                        }
                                                    </td>


                                                    {/* STATUS */}

                                                    <td className="px-5 py-4">

                                                        {status ===
                                                        "PAID" ? (

                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    gap-1
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
                                                                    className="h-3 w-3"
                                                                />

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
                                                                Unpaid
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