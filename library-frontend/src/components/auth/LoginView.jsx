
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Loader2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function LoginView() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    async function handleSubmit(e) {

        e.preventDefault();

        setError("");

        // Frontend validation
        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!password.trim()) {
            setError("Password is required.");
            return;
        }

        try {

            setLoading(true);

            // Calls AuthContext
            const loggedInUser = await login(
                email.trim(),
                password
            );

            // Redirect according to backend role
            if (loggedInUser.role === "ADMIN") {

                navigate("/admin", {
                    replace: true,
                });

            } else {

                navigate("/member", {
                    replace: true,
                });
            }

        } catch (err) {

            setError(
                err.message ||
                "Invalid email or password"
            );

        } finally {

            setLoading(false);
        }
    }


    return (

        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f5ede3] text-[#2a1d15]">

            {/* Left Side Library Image */}

            <div className="relative w-full lg:w-[70%] min-h-[300px] lg:min-h-screen overflow-hidden">

                <img
                    src="/library-hero.jpg"
                    alt="Library Interior"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />

            </div>


            {/* Right Side Login */}

            <div className="w-full lg:w-[30%] min-h-[calc(100vh-300px)] lg:min-h-screen flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-[#faf4ec] border-l border-[#e5d7c5]">


                <div className="w-full max-w-xs mx-auto my-auto py-8 text-left">


                    {/* Logo */}

                    <div className="mb-6">

                        <div className="flex items-center gap-2.5 mb-4">

                            <div className="w-8 h-8 rounded-lg bg-[#a8652c] flex items-center justify-center text-white shadow-xs">

                                <BookOpen className="w-4 h-4" />

                            </div>

                            <span className="font-semibold text-[#2a1d15] text-base tracking-tight">

                                Aditya Library

                            </span>

                        </div>


                        <h2 className="text-xl font-bold text-[#2a1d15] tracking-tight">

                            Sign In

                        </h2>

                        <p className="text-xs text-[#735e50] mt-1">

                            Enter your credentials to continue

                        </p>

                    </div>


                    {/* Login Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >


                        {/* Error Message */}

                        {error && (

                            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">

                                {error}

                            </div>

                        )}


                        {/* Email */}

                        <div>

                            <label className="block text-xs font-medium text-[#463529] mb-1.5">

                                Email Address

                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="you@example.com"
                                disabled={loading}
                                className="app-input w-full px-3.5 py-2 text-xs sm:text-sm placeholder-[#a8988a]"
                            />

                        </div>


                        {/* Password */}

                        <div>

                            <label className="block text-xs font-medium text-[#463529] mb-1.5">

                                Password

                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="••••••••"
                                disabled={loading}
                                className="app-input w-full px-3.5 py-2 text-xs sm:text-sm placeholder-[#a8988a]"
                            />

                        </div>


                        {/* Button */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-2.5 bg-[#a8652c] hover:bg-[#8f501e] text-white font-medium rounded-lg text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs active:scale-[0.99]"
                        >

                            {loading ? (

                                <>

                                    <Loader2 className="w-4 h-4 animate-spin" />

                                    <span>
                                        Signing in...
                                    </span>

                                </>

                            ) : (

                                "Sign In"

                            )}

                        </button>

                    </form>

                </div>


                {/* Footer */}

                <div className="text-center text-[11px] text-[#8e7b6d] py-2">

                    Aditya Library • Fine Calculator

                </div>

            </div>

        </div>
    );
}