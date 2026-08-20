import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LoginView from "./components/auth/LoginView";
import AdminUsers from "./pages/admin/AdminUser";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminBorrowings from "./pages/admin/AdminBorrowings";

// =========================================================
// ADMIN PAGES
// =========================================================

// Temporary pages.
// We will replace these with the real pages/components
// from your existing frontend design one by one.








function AdminFines() {

    return (
        <div className="min-h-screen bg-[#faf4ec] p-8">

            <h1 className="text-2xl font-bold text-[#2a1d15]">
                Fines
            </h1>

            <p className="mt-2 text-[#735e50]">
                View automatically generated fines.
            </p>

        </div>
    );
}




// =========================================================
// MEMBER PAGES
// =========================================================

function MemberDashboard() {

    return (
        <div className="min-h-screen bg-[#faf4ec] p-8">

            <h1 className="text-2xl font-bold text-[#2a1d15]">
                My Dashboard
            </h1>

            <p className="mt-2 text-[#735e50]">
                Welcome to your library dashboard.
            </p>

        </div>
    );
}


function MemberBooks() {

    return (
        <div className="min-h-screen bg-[#faf4ec] p-8">

            <h1 className="text-2xl font-bold text-[#2a1d15]">
                Browse Books
            </h1>

            <p className="mt-2 text-[#735e50]">
                Browse available books.
            </p>

        </div>
    );
}


function MemberBorrowings() {

    return (
        <div className="min-h-screen bg-[#faf4ec] p-8">

            <h1 className="text-2xl font-bold text-[#2a1d15]">
                My Borrowings
            </h1>

            <p className="mt-2 text-[#735e50]">
                View your borrowed books.
            </p>

        </div>
    );
}


function MemberFines() {

    return (
        <div className="min-h-screen bg-[#faf4ec] p-8">

            <h1 className="text-2xl font-bold text-[#2a1d15]">
                My Fines
            </h1>

            <p className="mt-2 text-[#735e50]">
                View your automatically generated fines.
            </p>

        </div>
    );
}


// =========================================================
// APP
// =========================================================

function App() {

    return (

        <BrowserRouter>

            <AuthProvider>

                <Routes>

                    {/* =================================================
                        LOGIN
                    ================================================= */}

                    <Route
                        path="/login"
                        element={
                            <LoginView />
                        }
                    />


                    {/* =================================================
                        ADMIN ROUTES
                    ================================================= */}

                    <Route
                        path="/admin"
                        element={

                            <ProtectedRoute
                                allowedRole="ADMIN"
                            >

                                <AdminDashboard />

                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/admin/books"
                        element={

                            <ProtectedRoute
                                allowedRole="ADMIN"
                            >

                                <AdminBooks />

                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/admin/members"
                        element={

                            <ProtectedRoute
                                allowedRole="ADMIN"
                            >

                                <AdminUsers />

                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/admin/borrowings"
                        element={

                            <ProtectedRoute
                                allowedRole="ADMIN"
                            >

                                <AdminBorrowings />

                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/admin/fines"
                        element={

                            <ProtectedRoute
                                allowedRole="ADMIN"
                            >

                                <AdminFines />

                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/admin/settings"
                        element={

                            <ProtectedRoute
                                allowedRole="ADMIN"
                            >

                                <AdminSettings />

                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        MEMBER ROUTES
                    ================================================= */}

                    <Route
                        path="/member"
                        element={

                            <ProtectedRoute
                                allowedRole="USER"
                            >

                                <MemberDashboard />

                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/member/books"
                        element={

                            <ProtectedRoute
                                allowedRole="USER"
                            >

                                <MemberBooks />

                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/member/borrowings"
                        element={

                            <ProtectedRoute
                                allowedRole="USER"
                            >

                                <MemberBorrowings />

                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/member/fines"
                        element={

                            <ProtectedRoute
                                allowedRole="USER"
                            >

                                <MemberFines />

                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        ROOT
                    ================================================= */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />


                    {/* =================================================
                        UNKNOWN ROUTE
                    ================================================= */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />

                </Routes>

            </AuthProvider>

        </BrowserRouter>
    );
}


export default App;