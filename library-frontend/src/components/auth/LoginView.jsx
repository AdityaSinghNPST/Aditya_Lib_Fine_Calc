import { useState } from "react";

import {
    BookOpen,
    Calculator,
    CheckCircle2,
    Eye,
    EyeOff,
    Loader2,
    ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";


// =========================================================
// LOGIN VIEW
// =========================================================

export default function LoginView() {

    const navigate = useNavigate();

    const { login } = useAuth();


    // =====================================================
    // FORM STATE
    // =====================================================

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");


    // =====================================================
    // UI STATE
    // =====================================================

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOGIN
    // =====================================================

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");


        // =================================================
        // VALIDATION
        // =================================================

        if (!email.trim()) {

            setError(
                "Please enter your email."
            );

            return;
        }


        if (!password) {

            setError(
                "Please enter your password."
            );

            return;
        }


        try {

            setLoading(true);


            // =================================================
            // LOGIN API
            // =================================================

            const response =
                await api.auth.login(
                    email.trim(),
                    password
                );


            // =================================================
            // SAVE AUTHENTICATION
            // =================================================

            const loggedInUser =
                login(response);


            // =================================================
            // ROLE BASED REDIRECT
            // =================================================

            const role =
                String(
                    loggedInUser.role || ""
                ).toUpperCase();


            if (role === "ADMIN") {

                navigate(
                    "/admin",
                    {
                        replace: true,
                    }
                );

                return;
            }


            if (
                role === "USER" ||
                role === "MEMBER"
            ) {

                navigate(
                    "/member",
                    {
                        replace: true,
                    }
                );

                return;
            }


            setError(
                "Your account does not have a valid role."
            );

        } catch (err) {

            console.error(
                "Login failed:",
                err
            );


            setError(
                err.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);
        }
    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            className="
                fixed
                inset-0
                flex
                overflow-hidden
                bg-[#fff7ed]
            "
        >

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <section
                className="
                    relative
                    hidden
                    h-full
                    w-1/2
                    overflow-hidden
                    bg-[#431407]
                    lg:flex
                    lg:items-center
                    lg:px-12
                    xl:px-20
                "
            >

                {/* =================================================
                    BACKGROUND DECORATION
                ================================================= */}

                <div
                    className="
                        absolute
                        -right-32
                        -top-32
                        h-80
                        w-80
                        rounded-full
                        border
                        border-[#ea580c]/20
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-40
                        -left-40
                        h-96
                        w-96
                        rounded-full
                        border
                        border-[#ea580c]/10
                    "
                />


                <div
                    className="
                        relative
                        z-10
                        w-full
                        max-w-lg
                        animate-slide-up
                    "
                >

                    {/* =================================================
                        BRAND
                    ================================================= */}

                    <div
                        className="
                            group
                            mb-10
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#ea580c]
                                text-white
                                shadow-lg
                                transition-all
                                duration-300
                                group-hover:scale-105
                            "
                        >

                            <BookOpen
                                className="
                                    h-6
                                    w-6
                                    transition-transform
                                    duration-300
                                    group-hover:rotate-[-5deg]
                                "
                            />

                        </div>


                        <div>

                            <p
                                className="
                                    text-base
                                    font-semibold
                                    text-white
                                "
                            >
                                Library Fine Calculator
                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-[#a8a29e]
                                "
                            >
                                Simple • Accurate • Fast
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        HEADING
                    ================================================= */}

                    <h1
                        className="
                            text-4xl
                            font-semibold
                            leading-tight
                            tracking-tight
                            text-white
                            xl:text-5xl
                        "
                    >
                        Calculate library fines
                        <span
                            className="
                                block
                                text-[#fb923c]
                            "
                        >
                            without the guesswork.
                        </span>
                    </h1>


                    <p
                        className="
                            mt-5
                            max-w-md
                            text-sm
                            leading-7
                            text-[#d6d3d1]
                        "
                    >
                        Track overdue books and calculate
                        fines based on borrowing and return
                        dates quickly and accurately.
                    </p>


                    {/* =================================================
                        FINE CALCULATION CARD
                    ================================================= */}

                    <div
                        className="
                            mt-8
                            max-w-md
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.06]
                            p-5
                            backdrop-blur-sm
                            transition-all
                            duration-300
                            hover:bg-white/[0.09]
                            hover:border-white/15
                        "
                    >

                        <div
                            className="
                                mb-4
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <Calculator
                                    className="
                                        h-4
                                        w-4
                                        text-[#fb923c]
                                    "
                                />


                                <span
                                    className="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-[#e7e5e4]
                                    "
                                >
                                    Fine calculation
                                </span>

                            </div>


                            <span
                                className="
                                    rounded-full
                                    bg-[#ea580c]/20
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-medium
                                    text-[#fdba74]
                                "
                            >
                                Example
                            </span>

                        </div>


                        <div
                            className="
                                grid
                                grid-cols-3
                                gap-3
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-[10px]
                                        text-[#a8a29e]
                                    "
                                >
                                    Due date
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-medium
                                        text-white
                                    "
                                >
                                    12 Aug
                                </p>

                            </div>


                            <div>

                                <p
                                    className="
                                        text-[10px]
                                        text-[#a8a29e]
                                    "
                                >
                                    Returned
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-medium
                                        text-white
                                    "
                                >
                                    17 Aug
                                </p>

                            </div>


                            <div>

                                <p
                                    className="
                                        text-[10px]
                                        text-[#a8a29e]
                                    "
                                >
                                    Overdue
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-medium
                                        text-[#fb923c]
                                    "
                                >
                                    5 days
                                </p>

                            </div>

                        </div>


                        <div
                            className="
                                my-4
                                h-px
                                bg-white/10
                            "
                        />


                        <div
                            className="
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <span
                                className="
                                    text-sm
                                    text-[#d6d3d1]
                                "
                            >
                                Calculated fine
                            </span>


                            <span
                                className="
                                    text-xl
                                    font-semibold
                                    text-white
                                "
                            >
                                ₹50
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        FEATURES
                    ================================================= */}

                    <div
                        className="
                            mt-7
                            flex
                            flex-wrap
                            gap-x-6
                            gap-y-3
                        "
                    >

                        <div
                            className="
                                feature-item
                                flex
                                items-center
                                gap-2
                                text-xs
                                text-[#d6d3d1]
                            "
                        >

                            <CheckCircle2
                                className="
                                    h-4
                                    w-4
                                    text-[#fb923c]
                                "
                            />

                            Overdue tracking

                        </div>


                        <div
                            className="
                                feature-item
                                flex
                                items-center
                                gap-2
                                text-xs
                                text-[#d6d3d1]
                            "
                        >

                            <CheckCircle2
                                className="
                                    h-4
                                    w-4
                                    text-[#fb923c]
                                "
                            />

                            Fine calculation

                        </div>


                        <div
                            className="
                                feature-item
                                flex
                                items-center
                                gap-2
                                text-xs
                                text-[#d6d3d1]
                            "
                        >

                            <CheckCircle2
                                className="
                                    h-4
                                    w-4
                                    text-[#fb923c]
                                "
                            />

                            Borrowing records

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <section
                className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                    px-5
                    sm:px-8
                    lg:w-1/2
                    lg:px-12
                    xl:px-20
                "
            >

                <div
                    className="
                        w-full
                        max-w-md
                        animate-slide-up
                    "
                >

                    {/* =================================================
                        MOBILE BRAND
                    ================================================= */}

                    <div
                        className="
                            mb-8
                            flex
                            items-center
                            gap-3
                            lg:hidden
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
                                rounded-xl
                                bg-[#ea580c]
                                text-white
                            "
                        >

                            <BookOpen
                                className="h-5 w-5"
                            />

                        </div>


                        <div>

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-[#292524]
                                "
                            >
                                Library Fine Calculator
                            </p>


                            <p
                                className="
                                    text-[11px]
                                    text-[#a8a29e]
                                "
                            >
                                Fine & Borrowing
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        LOGIN HEADING
                    ================================================= */}

                    <div
                        className="
                            mb-7
                        "
                    >

                        <p
                            className="
                                mb-2
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.15em]
                                text-[#ea580c]
                            "
                        >
                            Welcome back
                        </p>


                        <h2
                            className="
                                text-3xl
                                font-semibold
                                tracking-tight
                                text-[#292524]
                            "
                        >
                            Sign in
                        </h2>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-[#78716c]
                            "
                        >
                            Sign in to calculate and manage
                            library fines.
                        </p>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div
                            className="
                                animate-error
                                mb-5
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                text-red-700
                            "
                        >
                            {error}
                        </div>

                    )}


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="
                            space-y-5
                        "
                    >

                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="email"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-[#44403c]
                                "
                            >
                                Email address
                            </label>


                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter your email"
                                autoComplete="email"
                                disabled={loading}
                                className="
                                    h-12
                                    w-full
                                    rounded-xl
                                    border
                                    border-[#fdba74]
                                    bg-white
                                    px-4
                                    text-sm
                                    text-[#292524]
                                    outline-none
                                    transition-all
                                    duration-300
                                    placeholder:text-[#b4a69b]
                                    hover:border-[#fbbf24]
                                    hover:shadow-sm
                                    focus:-translate-y-0.5
                                    focus:border-[#ea580c]
                                    focus:ring-2
                                    focus:ring-[#ea580c]/10
                                    focus:shadow-md
                                "
                            />

                        </div>


                        {/* =================================================
                            PASSWORD
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="password"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-[#44403c]
                                "
                            >
                                Password
                            </label>


                            <div
                                className="
                                    relative
                                "
                            >

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    disabled={loading}
                                    className="
                                        h-12
                                        w-full
                                        rounded-xl
                                        border
                                        border-[#fdba74]
                                        bg-white
                                        px-4
                                        pr-12
                                        text-sm
                                        text-[#292524]
                                        outline-none
                                        transition-all
                                        duration-300
                                        placeholder:text-[#b4a69b]
                                        hover:border-[#fbbf24]
                                        hover:shadow-sm
                                        focus:-translate-y-0.5
                                        focus:border-[#ea580c]
                                        focus:ring-2
                                        focus:ring-[#ea580c]/10
                                        focus:shadow-md
                                    "
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (value) =>
                                                !value
                                        )
                                    }
                                    disabled={loading}
                                    className="
                                        absolute
                                        right-2
                                        top-1/2
                                        -translate-y-1/2
                                        rounded-lg
                                        p-2
                                        text-[#a8a29e]
                                        transition-all
                                        duration-200
                                        hover:scale-105
                                        hover:bg-[#fff7ed]
                                        hover:text-[#78716c]
                                    "
                                >

                                    {showPassword ? (

                                        <EyeOff
                                            className="h-4 w-4"
                                        />

                                    ) : (

                                        <Eye
                                            className="h-4 w-4"
                                        />

                                    )}

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            LOGIN BUTTON
                        ================================================= */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                login-button
                                group
                                relative
                                flex
                                h-12
                                w-full
                                items-center
                                justify-center
                                gap-2
                                overflow-hidden
                                rounded-xl
                                bg-[#ea580c]
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:bg-[#c2410c]
                                hover:shadow-lg
                                active:translate-y-0
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {loading ? (

                                <>

                                    <Loader2
                                        className="
                                            h-4
                                            w-4
                                            animate-spin
                                        "
                                    />

                                    Signing in...

                                </>

                            ) : (

                                <>

                                    Sign in

                                    <ArrowRight
                                        className="
                                            h-4
                                            w-4
                                            transition-transform
                                            duration-300
                                            group-hover:translate-x-1
                                        "
                                    />

                                </>

                            )}

                        </button>

                    </form>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div
                        className="
                            mt-8
                            border-t
                            border-[#fed7aa]
                            pt-5
                        "
                    >

                        <p
                            className="
                                text-center
                                text-xs
                                text-[#a8a29e]
                            "
                        >
                            Library Fine Calculator
                        </p>

                    </div>

                </div>

            </section>

        </div>
    );
}