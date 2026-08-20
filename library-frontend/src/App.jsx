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
import AdminFines from "./pages/admin/AdminFines";
import MemberDashboard from "./pages/member/MemberDashboard";
import MemberBooks from "./pages/member/MemberBooks";
import MemberBorrowings from "./pages/member/MemberBorrowings";
import MemberFines from "./pages/member/MemberFines";



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