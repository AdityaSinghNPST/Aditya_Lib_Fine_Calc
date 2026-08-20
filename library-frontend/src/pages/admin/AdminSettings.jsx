import { useEffect, useState } from "react";

import {
    Settings,
    Save,
    Clock,
    IndianRupee,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";


// =========================================================
// ADMIN SETTINGS
// =========================================================

export default function AdminSettings() {

    // =====================================================
    // STATE
    // =====================================================

    const [borrowedDays, setBorrowedDays] =
        useState("");

    const [finePerDay, setFinePerDay] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // LOAD SETTINGS
    // =====================================================

    async function loadSettings() {

        try {

            setLoading(true);

            setError("");

            const data =
                await api.settings.get();


            /*
             * These names should match the backend
             * settings response.
             */

            setBorrowedDays(
                data?.borrowedDays ??
                data?.allowedDays ??
                ""
            );


            setFinePerDay(
                data?.finePerDay ??
                data?.fineAmount ??
                ""
            );

        } catch (err) {

            setError(
                err.message ||
                "Unable to load settings."
            );

        } finally {

            setLoading(false);
        }
    }


    useEffect(() => {

        loadSettings();

    }, []);


    // =====================================================
    // SAVE SETTINGS
    // =====================================================

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");

        setSuccess("");


        // Convert input values to numbers.

        const days =
            Number(borrowedDays);

        const fine =
            Number(finePerDay);


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !Number.isInteger(days) ||
            days <= 0
        ) {

            setError(
                "Borrowed days must be a positive whole number."
            );

            return;
        }


        if (
            !Number.isFinite(fine) ||
            fine < 0
        ) {

            setError(
                "Fine amount must be zero or greater."
            );

            return;
        }


        try {

            setSaving(true);


            await api.settings.update({

                borrowedDays:
                    days,

                finePerDay:
                    fine,

            });


            setSuccess(
                "Settings updated successfully."
            );


            /*
             * Remove the success message after
             * a few seconds.
             */

            setTimeout(() => {

                setSuccess("");

            }, 3000);

        } catch (err) {

            setError(
                err.message ||
                "Unable to update settings."
            );

        } finally {

            setSaving(false);
        }
    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

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
                        flex
                        min-h-[70vh]
                        max-w-7xl
                        items-center
                        justify-center
                        px-4
                    "
                >

                    <p
                        className="
                            text-sm
                            text-[#735e50]
                        "
                    >
                        Loading settings...
                    </p>

                </main>

            </div>
        );
    }


    // =====================================================
    // PAGE
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
                    max-w-4xl
                    px-4
                    py-8
                    sm:px-6
                    lg:px-8
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-8">

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
                        Library Settings
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-[#735e50]
                        "
                    >
                        Configure the borrowing period and
                        automatic fine calculation.
                    </p>

                </div>


                {/* =================================================
                    ALERTS
                ================================================= */}

                {error && (

                    <div
                        className="
                            mb-5
                            flex
                            items-start
                            gap-3
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


                {success && (

                    <div
                        className="
                            mb-5
                            flex
                            items-start
                            gap-3
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
                            className="
                                mt-0.5
                                h-4
                                w-4
                                shrink-0
                            "
                        />

                        <span>
                            {success}
                        </span>

                    </div>

                )}


                {/* =================================================
                    SETTINGS CARD
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        rounded-xl
                        border
                        border-[#e5d7c5]
                        bg-white
                        shadow-sm
                    "
                >

                    {/* CARD HEADER */}

                    <div
                        className="
                            border-b
                            border-[#e5d7c5]
                            px-6
                            py-5
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
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-[#f1e3d3]
                                    text-[#a8652c]
                                "
                            >

                                <Settings
                                    className="h-5 w-5"
                                />

                            </div>


                            <div>

                                <h2
                                    className="
                                        font-semibold
                                        text-[#2a1d15]
                                    "
                                >
                                    Borrowing & Fine Rules
                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-[#9a8778]
                                    "
                                >
                                    These values are used by
                                    the automatic fine calculation.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* FORM BODY */}

                    <div className="space-y-6 p-6">

                        {/* =================================================
                            BORROWED DAYS
                        ================================================= */}

                        <div>

                            <div
                                className="
                                    mb-2
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <Clock
                                    className="
                                        h-4
                                        w-4
                                        text-[#a8652c]
                                    "
                                />


                                <label
                                    className="
                                        text-sm
                                        font-medium
                                        text-[#463529]
                                    "
                                >
                                    Borrowing Period
                                </label>

                            </div>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={borrowedDays}
                                    onChange={(event) =>
                                        setBorrowedDays(
                                            event.target.value
                                        )
                                    }
                                    disabled={saving}
                                    className="
                                        w-full
                                        max-w-xs
                                        rounded-lg
                                        border
                                        border-[#ddd0c1]
                                        bg-[#fffdfb]
                                        px-3
                                        py-2.5
                                        text-sm
                                        outline-none
                                        focus:border-[#a8652c]
                                    "
                                />


                                <span
                                    className="
                                        text-sm
                                        text-[#735e50]
                                    "
                                >
                                    days
                                </span>

                            </div>


                            <p
                                className="
                                    mt-2
                                    text-xs
                                    leading-5
                                    text-[#9a8778]
                                "
                            >
                                The number of days a member can keep
                                a borrowed book before it becomes overdue.
                            </p>

                        </div>


                        {/* =================================================
                            FINE AMOUNT
                        ================================================= */}

                        <div>

                            <div
                                className="
                                    mb-2
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <IndianRupee
                                    className="
                                        h-4
                                        w-4
                                        text-[#a8652c]
                                    "
                                />


                                <label
                                    className="
                                        text-sm
                                        font-medium
                                        text-[#463529]
                                    "
                                >
                                    Fine Per Day
                                </label>

                            </div>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        relative
                                        w-full
                                        max-w-xs
                                    "
                                >

                                    <span
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-sm
                                            text-[#735e50]
                                        "
                                    >
                                        ₹
                                    </span>


                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={finePerDay}
                                        onChange={(event) =>
                                            setFinePerDay(
                                                event.target.value
                                            )
                                        }
                                        disabled={saving}
                                        className="
                                            w-full
                                            rounded-lg
                                            border
                                            border-[#ddd0c1]
                                            bg-[#fffdfb]
                                            px-3
                                            py-2.5
                                            pl-8
                                            text-sm
                                            outline-none
                                            focus:border-[#a8652c]
                                        "
                                    />

                                </div>


                                <span
                                    className="
                                        text-sm
                                        text-[#735e50]
                                    "
                                >
                                    per overdue day
                                </span>

                            </div>


                            <p
                                className="
                                    mt-2
                                    text-xs
                                    leading-5
                                    text-[#9a8778]
                                "
                            >
                                The amount charged for every day
                                a book is returned after the allowed
                                borrowing period.
                            </p>

                        </div>


                        {/* =================================================
                            EXAMPLE
                        ================================================= */}

                        <div
                            className="
                                rounded-lg
                                border
                                border-[#eadcc9]
                                bg-[#fcf8f3]
                                p-4
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-[#a8652c]
                                "
                            >
                                Example
                            </p>


                            <p
                                className="
                                    mt-2
                                    text-sm
                                    leading-6
                                    text-[#735e50]
                                "
                            >
                                If the borrowing period is{" "}

                                <strong
                                    className="text-[#2a1d15]"
                                >
                                    {borrowedDays || 0} days
                                </strong>

                                {" "}and the book is returned{" "}

                                <strong
                                    className="text-[#2a1d15]"
                                >
                                    3 days late
                                </strong>

                                , the fine would be{" "}

                                <strong
                                    className="text-[#2a1d15]"
                                >
                                    ₹
                                    {
                                        (
                                            Number(finePerDay || 0) *
                                            3
                                        ).toFixed(2)
                                    }
                                </strong>.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div
                        className="
                            flex
                            justify-end
                            border-t
                            border-[#e5d7c5]
                            px-6
                            py-4
                        "
                    >

                        <button
                            type="submit"
                            disabled={saving}
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-lg
                                bg-[#a8652c]
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                hover:bg-[#8f501e]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            <Save className="h-4 w-4" />

                            {saving
                                ? "Saving..."
                                : "Save Settings"}

                        </button>

                    </div>

                </form>

            </main>

        </div>
    );
}