import { useEffect, useState } from "react";

import {
    BookOpen,
    Users,
    ArrowLeftRight,
    IndianRupee,
    Settings,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";

import { normalizeList } from "../../utils/lookups";


// =========================================================
// ADMIN DASHBOARD
// =========================================================

export default function AdminDashboard() {

    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        books: 0,
        members: 0,
        activeBorrowings: 0,
        totalFines: 0,
    });


    useEffect(() => {

        async function loadStats() {

            try {

                setLoading(true);

                const [
                    booksData,
                    usersData,
                    borrowingsData,
                    finesData,
                ] = await Promise.all([
                    api.books.getAll({ page: 0, size: 1000 }),
                    api.users.getAll(),
                    api.borrowings.getAll(),
                    api.fines.getAll(),
                ]);

                const books =
                    normalizeList(booksData);

                const users =
                    normalizeList(usersData);

                const borrowings =
                    normalizeList(borrowingsData);

                const fines =
                    normalizeList(finesData);

                const activeBorrowings =
                    borrowings.filter(
                        (borrowing) =>
                            borrowing.status !== "RETURNED" &&
                            !borrowing.returnDate
                    ).length;

                const totalFines =
                    fines.reduce(
                        (total, fine) =>
                            total + (Number(fine.amount) || 0),
                        0
                    );

                setStats({
                    books: books.length,
                    members: users.filter(
                        (user) => user.role === "USER"
                    ).length,
                    activeBorrowings,
                    totalFines,
                });

            } catch (err) {

                console.error(
                    "Failed to load dashboard stats:",
                    err
                );

            } finally {

                setLoading(false);
            }
        }

        loadStats();

    }, []);


    const statCards = [

        {
            title: "Total Books",
            value: loading ? "…" : String(stats.books),
            icon: BookOpen,
            description: "Books in library",
        },

        {
            title: "Members",
            value: loading ? "…" : String(stats.members),
            icon: Users,
            description: "Registered members",
        },

        {
            title: "Active Borrowings",
            value: loading ? "…" : String(stats.activeBorrowings),
            icon: ArrowLeftRight,
            description: "Currently borrowed",
        },

        {
            title: "Total Fines",
            value: loading
                ? "…"
                : new Intl.NumberFormat(
                    "en-IN",
                    {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                    }
                ).format(stats.totalFines),
            icon: IndianRupee,
            description: "Automatically calculated",
        },

    ];


    const quickActions = [

        {
            title: "Manage Books",
            description:
                "Add new books, update book information and manage availability.",
            icon: BookOpen,
            path: "/admin/books",
        },

        {
            title: "Manage Members",
            description:
                "Create and manage library member accounts.",
            icon: Users,
            path: "/admin/members",
        },

        {
            title: "Manage Borrowings",
            description:
                "View borrowing records and manage book returns.",
            icon: ArrowLeftRight,
            path: "/admin/borrowings",
        },

        {
            title: "Automatic Fines",
            description:
                "View fines calculated automatically when books are returned late.",
            icon: IndianRupee,
            path: "/admin/fines",
        },

        {
            title: "Library Settings",
            description:
                "Configure borrowing period and fine per day rules.",
            icon: Settings,
            path: "/admin/settings",
        },

    ];


    return (

        <div className="min-h-screen bg-[#fff8f0]">

            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                <div className="mb-8">

                    <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#ea580c]">
                        Administration
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight text-[#292524]">
                        Library Dashboard
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#78716c]">
                        Manage books, members, borrowings and
                        automatically calculated fines from one place.
                    </p>

                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {statCards.map((stat) => {

                        const Icon = stat.icon;

                        return (

                            <div
                                key={stat.title}
                                className="rounded-xl border border-[#fed7aa] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-sm font-medium text-[#78716c]">
                                            {stat.title}
                                        </p>

                                        <p className="mt-2 text-3xl font-semibold text-[#292524]">
                                            {stat.value}
                                        </p>

                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffedd5] text-[#ea580c]">
                                        <Icon className="h-5 w-5" />
                                    </div>

                                </div>

                                <p className="mt-3 text-xs text-[#a8a29e]">
                                    {stat.description}
                                </p>

                            </div>

                        );

                    })}

                </div>

                <section className="mt-8">

                    <div className="mb-4">

                        <h2 className="text-lg font-semibold text-[#292524]">
                            Quick overview
                        </h2>

                        <p className="mt-1 text-sm text-[#78716c]">
                            Select an area to manage your library.
                        </p>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

                        {quickActions.map((action) => {

                            const Icon = action.icon;

                            return (

                                <Link
                                    key={action.title}
                                    to={action.path}
                                    className="group rounded-xl border border-[#fed7aa] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fffbf5] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:ring-offset-2"
                                >

                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffedd5] text-[#ea580c] transition group-hover:bg-[#fdba74]">
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <h3 className="font-medium text-[#292524]">
                                        {action.title}
                                    </h3>

                                    <p className="mt-1 text-sm leading-5 text-[#78716c]">
                                        {action.description}
                                    </p>

                                    <p className="mt-4 text-xs font-medium text-[#ea580c] opacity-0 transition group-hover:opacity-100">
                                        Open →
                                    </p>

                                </Link>

                            );

                        })}

                    </div>

                </section>

            </main>

        </div>
    );
}
