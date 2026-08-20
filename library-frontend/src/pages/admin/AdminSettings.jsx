import { useEffect, useState } from "react";

import {
    ArrowLeft,
    Settings,
    Clock,
    IndianRupee,
    Save,
    CheckCircle,
    AlertCircle,
    X,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";


// =========================================================
// ADMIN SETTINGS PAGE
// =========================================================

export default function AdminSettings() {

    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // FORM
    // =====================================================

    const [form, setForm] = useState({
        borrowingPeriodDays: "",
        finePerDay: "",
    });


    // =====================================================
    // LOAD SETTINGS
    // =====================================================

    async function loadSettings() {

        try {

            setLoading(true);

            setError("");

            const data =
                await api.settings.get();


            setForm({
                borrowingPeriodDays:
                    data?.borrowingPeriodDays ??
                    data?.loanPeriodDays ??
                    data?.borrowingPeriod ??
                    "",

                finePerDay:
                    data?.finePerDay ??
                    data?.fineAmountPerDay ??
                    data?.fine ??
                    "",
            });

        } catch (err) {

            console.error(
                "Failed to load settings:",
                err
            );

            setError(
                err.message ||
                "Unable to load library settings."
            );

        } finally {

            setLoading(false);
        }
    }


    // =====================================================
    // LOAD WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        loadSettings();

    }, []);


    // =====================================================
    // HANDLE INPUT
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
    // SAVE SETTINGS
    // =====================================================

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");

        setSuccess("");


        // =================================================
        // VALIDATE BORROWING PERIOD
        // =================================================

        const borrowingPeriod =
            Number(
                form.borrowingPeriodDays
            );


        if (
            !Number.isFinite(
                borrowingPeriod
            ) ||
            borrowingPeriod <= 0
        ) {

            setError(
                "Borrowing period must be greater than 0."
            );

            return;
        }


        // =================================================
        // VALIDATE FINE
        // =================================================

        const finePerDay =
            Number(
                form.finePerDay
            );


        if (
            !Number.isFinite(
                finePerDay
            ) ||
            finePerDay < 0
        ) {

            setError(
                "Fine per day cannot be negative."
            );

            return;
        }


        try {

            setSaving(true);


            await api.settings.update({

                borrowingPeriodDays:
                    borrowingPeriod,

                finePerDay:
                    finePerDay,

            });


            setSuccess(
                "Library settings updated successfully."
            );


            setTimeout(() => {

                setSuccess("");

            }, 4000);

        } catch (err) {

            console.error(
                "Failed to update settings:",
                err
            );

            setError(
                err.message ||
                "Unable to update library settings."
            );

        } finally {

            setSaving(false);
        }
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

                <div className="mb-6">

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
                        Administration
                    </p>


                    <h1
                        className="
                            text-2xl
                            font-semibold
                            text-[#292524]
                        "
                    >
                        Settings
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-[#78716c]
                        "
                    >
                        Configure the library borrowing and fine rules.
                    </p>

                </div>


                {/* =================================================
                    SUCCESS MESSAGE
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
                    ERROR MESSAGE
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
                    SETTINGS CARD
                ================================================= */}

                <div
                    className="
                        max-w-3xl
                        rounded-xl
                        border
                        border-[#fed7aa]
                        bg-white
                        shadow-sm
                    "
                >

                    {/* =================================================
                        CARD HEADER
                    ================================================= */}

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                            border-b
                            border-[#fed7aa]
                            px-6
                            py-5
                        "
                    >

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-lg
                                bg-[#ffedd5]
                                text-[#ea580c]
                            "
                        >

                            <Settings
                                className="h-5 w-5"
                            />

                        </div>


                        <div>

                            <h2
                                className="
                                    text-lg
                                    font-semibold
                                    text-[#292524]
                                "
                            >
                                Library Rules
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-[#a8a29e]
                                "
                            >
                                These values are used when calculating
                                borrowing deadlines and fines.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        FORM
                    ================================================= */}

                    {loading ? (

                        <div
                            className="
                                flex
                                min-h-64
                                items-center
                                justify-center
                                px-6
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    text-[#78716c]
                                "
                            >
                                Loading settings...
                            </p>

                        </div>

                    ) : (

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="
                                space-y-6
                                p-6
                            "
                        >

                            {/* =================================================
                                BORROWING PERIOD
                            ================================================= */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-[#fed7aa]
                                    bg-[#fffef9]
                                    p-5
                                "
                            >

                                <div
                                    className="
                                        mb-4
                                        flex
                                        items-start
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

                                        <Clock
                                            className="h-5 w-5"
                                        />

                                    </div>


                                    <div>

                                        <h3
                                            className="
                                                text-sm
                                                font-semibold
                                                text-[#292524]
                                            "
                                        >
                                            Borrowing Period
                                        </h3>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-[#a8a29e]
                                            "
                                        >
                                            Number of days a member can
                                            keep a borrowed book.
                                        </p>

                                    </div>

                                </div>


                                <div>

                                    <label
                                        htmlFor="borrowingPeriodDays"
                                        className="
                                            mb-1.5
                                            block
                                            text-sm
                                            font-medium
                                            text-[#44403c]
                                        "
                                    >
                                        Borrowing period in days
                                    </label>


                                    <input
                                        id="borrowingPeriodDays"
                                        type="number"
                                        min="1"
                                        name="borrowingPeriodDays"
                                        value={
                                            form.borrowingPeriodDays
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={saving}
                                        placeholder="Example: 14"
                                        className="
                                            w-full
                                            rounded-lg
                                            border
                                            border-[#fdba74]
                                            bg-white
                                            px-3
                                            py-2.5
                                            text-sm
                                            text-[#292524]
                                            outline-none
                                            transition
                                            focus:border-[#ea580c]
                                            focus:ring-1
                                            focus:ring-[#ea580c]
                                            sm:max-w-sm
                                        "
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                FINE
                            ================================================= */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-[#fed7aa]
                                    bg-[#fffef9]
                                    p-5
                                "
                            >

                                <div
                                    className="
                                        mb-4
                                        flex
                                        items-start
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

                                        <IndianRupee
                                            className="h-5 w-5"
                                        />

                                    </div>


                                    <div>

                                        <h3
                                            className="
                                                text-sm
                                                font-semibold
                                                text-[#292524]
                                            "
                                        >
                                            Fine Per Day
                                        </h3>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-[#a8a29e]
                                            "
                                        >
                                            Amount charged for each day
                                            a book is overdue.
                                        </p>

                                    </div>

                                </div>


                                <div>

                                    <label
                                        htmlFor="finePerDay"
                                        className="
                                            mb-1.5
                                            block
                                            text-sm
                                            font-medium
                                            text-[#44403c]
                                        "
                                    >
                                        Fine amount per day
                                    </label>


                                    <div
                                        className="
                                            relative
                                            sm:max-w-sm
                                        "
                                    >

                                        <span
                                            className="
                                                absolute
                                                left-3
                                                top-1/2
                                                -translate-y-1/2
                                                text-sm
                                                text-[#a8a29e]
                                            "
                                        >
                                            ₹
                                        </span>


                                        <input
                                            id="finePerDay"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            name="finePerDay"
                                            value={
                                                form.finePerDay
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={saving}
                                            placeholder="Example: 5"
                                            className="
                                                w-full
                                                rounded-lg
                                                border
                                                border-[#fdba74]
                                                bg-white
                                                py-2.5
                                                pl-8
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
                                INFO
                            ================================================= */}

                            <div
                                className="
                                    rounded-lg
                                    border
                                    border-[#fed7aa]
                                    bg-[#fff8f0]
                                    px-4
                                    py-3
                                    text-sm
                                    text-[#78716c]
                                "
                            >

                                <p>

                                    <span
                                        className="
                                            font-medium
                                            text-[#44403c]
                                        "
                                    >
                                        Example:
                                    </span>{" "}

                                    If the borrowing period is{" "}

                                    <span
                                        className="
                                            font-medium
                                            text-[#292524]
                                        "
                                    >
                                        14 days
                                    </span>{" "}

                                    and the fine is{" "}

                                    <span
                                        className="
                                            font-medium
                                            text-[#292524]
                                        "
                                    >
                                        ₹5 per day
                                    </span>
                                    , a book returned 3 days late
                                    would have a fine of ₹15.

                                </p>

                            </div>


                            {/* =================================================
                                SAVE BUTTON
                            ================================================= */}

                            <div
                                className="
                                    flex
                                    justify-end
                                    border-t
                                    border-[#fed7aa]
                                    pt-5
                                "
                            >

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-lg
                                        bg-[#ea580c]
                                        px-5
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-[#c2410c]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    <Save
                                        className="h-4 w-4"
                                    />

                                    {saving
                                        ? "Saving..."
                                        : "Save Settings"}

                                </button>

                            </div>

                        </form>

                    )}

                </div>

            </main>

        </div>
    );
}