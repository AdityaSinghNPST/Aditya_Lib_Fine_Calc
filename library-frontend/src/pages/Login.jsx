import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function Login() {

    // Used to navigate after successful login.
    const navigate = useNavigate();


    // Get authentication functions/state.
    const {
        login,
        user,
        isAuthenticated,
    } = useAuth();


    // Form state.
    const [email, setEmail] = useState("");

    const [password, setPassword] =
        useState("");


    // UI states.
    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // IF ALREADY LOGGED IN
    // =====================================================

    /*
     * If the user refreshes the login page while
     * already logged in, don't show Login again.
     */
    if (isAuthenticated && user) {

        if (user.role === "ADMIN") {

            return (
                <Navigate
                    to="/admin"
                    replace
                />
            );
        }

        if (user.role === "USER") {

            return (
                <Navigate
                    to="/member"
                    replace
                />
            );
        }
    }


    // =====================================================
    // HANDLE LOGIN
    // =====================================================

    async function handleSubmit(event) {

        event.preventDefault();

        // Remove previous error.
        setError("");


        // -------------------------------------------------
        // Basic frontend validation
        // -------------------------------------------------

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


            /*
             * AuthContext handles the actual API request.
             *
             * It calls:
             *
             * POST /api/auth/login
             */
            const loggedInUser =
                await login(
                    email.trim(),
                    password
                );


            /*
             * Redirect according to the role
             * returned by the backend.
             */
            if (
                loggedInUser.role ===
                "ADMIN"
            ) {

                navigate(
                    "/admin",
                    {
                        replace: true,
                    }
                );

                return;
            }


            if (
                loggedInUser.role ===
                "USER"
            ) {

                navigate(
                    "/member",
                    {
                        replace: true,
                    }
                );

                return;
            }


            /*
             * If an unexpected role is returned,
             * don't send the user somewhere incorrectly.
             */
            setError(
                "Your account has an unsupported role."
            );

        } catch (err) {

            /*
             * api.js converts the backend error response
             * into a normal JavaScript Error.
             *
             * So err.message can contain something like:
             *
             * "Invalid email or password"
             */
            setError(
                err.message ||
                "Login failed. Please try again."
            );

        } finally {

            setLoading(false);
        }
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            className="
                min-h-screen
                bg-[#f5f1e8]
                flex
                items-center
                justify-center
                px-4
                py-8
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                "
            >

                {/* =================================================
                    LOGO / BRAND
                ================================================= */}

                <div
                    className="
                        text-center
                        mb-8
                    "
                >

                    <div
                        className="
                            mx-auto
                            mb-4
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            bg-[#6f4e37]
                            text-3xl
                            shadow-lg
                        "
                    >
                        📚
                    </div>


                    <h1
                        className="
                            text-3xl
                            font-bold
                            tracking-tight
                            text-[#3d2b1f]
                        "
                    >
                        Library Management
                    </h1>


                    <p
                        className="
                            mt-2
                            text-sm
                            text-[#806f63]
                        "
                    >
                        Sign in to continue
                    </p>

                </div>


                {/* =================================================
                    LOGIN CARD
                ================================================= */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-[#e5ddd3]
                        bg-white
                        p-6
                        shadow-xl
                        sm:p-8
                    "
                >

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div
                                className="
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
                                {error}
                            </div>

                        )}


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
                                    text-[#49382d]
                                "
                            >
                                Email
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
                                    w-full
                                    rounded-xl
                                    border
                                    border-[#ddd2c7]
                                    bg-[#fcfaf7]
                                    px-4
                                    py-3
                                    text-[#3d2b1f]
                                    outline-none
                                    transition
                                    placeholder:text-[#a69a90]
                                    focus:border-[#6f4e37]
                                    focus:ring-2
                                    focus:ring-[#6f4e37]/20
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
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
                                    text-[#49382d]
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
                                        w-full
                                        rounded-xl
                                        border
                                        border-[#ddd2c7]
                                        bg-[#fcfaf7]
                                        px-4
                                        py-3
                                        pr-20
                                        text-[#3d2b1f]
                                        outline-none
                                        transition
                                        placeholder:text-[#a69a90]
                                        focus:border-[#6f4e37]
                                        focus:ring-2
                                        focus:ring-[#6f4e37]/20
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (current) =>
                                                !current
                                        )
                                    }
                                    disabled={loading}
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        rounded-lg
                                        px-2
                                        py-1
                                        text-xs
                                        font-medium
                                        text-[#6f4e37]
                                        transition
                                        hover:bg-[#f0e9e1]
                                        disabled:opacity-50
                                    "
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
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
                                w-full
                                rounded-xl
                                bg-[#6f4e37]
                                px-4
                                py-3
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-[#5c3f2d]
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#6f4e37]/30
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {loading
                                ? "Signing in..."
                                : "Sign In"}

                        </button>

                    </form>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <p
                    className="
                        mt-6
                        text-center
                        text-xs
                        text-[#918277]
                    "
                >
                    Library Management System
                </p>

            </div>

        </div>
    );
}


export default Login;