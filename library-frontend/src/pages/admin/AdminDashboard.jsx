import {
    BookOpen,
    Users,
    ArrowLeftRight,
    IndianRupee,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";


export default function AdminDashboard() {

    // =====================================================
    // TEMPORARY DASHBOARD DATA
    // =====================================================
    //
    // We will replace these values with backend API data
    // after the page layout is working.
    //

    const stats = [

        {
            title: "Total Books",
            value: "0",
            icon: BookOpen,
            description: "Books in library",
        },

        {
            title: "Members",
            value: "0",
            icon: Users,
            description: "Registered members",
        },

        {
            title: "Borrowings",
            value: "0",
            icon: ArrowLeftRight,
            description: "Active borrowings",
        },

        {
            title: "Total Fines",
            value: "₹0",
            icon: IndianRupee,
            description: "Automatically calculated",
        },

    ];


    return (

        <div
            className="
                min-h-screen
                bg-[#faf4ec]
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
                    mx-auto
                    max-w-7xl
                    px-4
                    py-8
                    sm:px-6
                    lg:px-8
                "
            >

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="mb-8">

                    <p
                        className="
                            mb-2
                            text-sm
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
                            text-3xl
                            font-semibold
                            tracking-tight
                            text-[#2a1d15]
                        "
                    >
                        Library Dashboard
                    </h1>


                    <p
                        className="
                            mt-2
                            max-w-2xl
                            text-sm
                            leading-6
                            text-[#735e50]
                        "
                    >
                        Manage books, members, borrowings and
                        automatically calculated fines from one place.
                    </p>

                </div>


                {/* =================================================
                    STAT CARDS
                ================================================= */}

                <div
                    className="
                        grid
                        gap-4
                        sm:grid-cols-2
                        lg:grid-cols-4
                    "
                >

                    {stats.map((stat) => {

                        const Icon =
                            stat.icon;


                        return (

                            <div
                                key={stat.title}
                                className="
                                    rounded-xl
                                    border
                                    border-[#e5d7c5]
                                    bg-white
                                    p-5
                                    shadow-sm
                                    transition
                                    hover:-translate-y-0.5
                                    hover:shadow-md
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
                                                font-medium
                                                text-[#735e50]
                                            "
                                        >
                                            {stat.title}
                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-3xl
                                                font-semibold
                                                text-[#2a1d15]
                                            "
                                        >
                                            {stat.value}
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

                                        <Icon
                                            className="h-5 w-5"
                                        />

                                    </div>

                                </div>


                                <p
                                    className="
                                        mt-3
                                        text-xs
                                        text-[#9a8778]
                                    "
                                >
                                    {stat.description}
                                </p>

                            </div>
                        );
                    })}

                </div>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <section className="mt-8">

                    <div className="mb-4">

                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-[#2a1d15]
                            "
                        >
                            Quick overview
                        </h2>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-[#735e50]
                            "
                        >
                            Important library information will
                            appear here.
                        </p>

                    </div>


                    <div
                        className="
                            rounded-xl
                            border
                            border-[#e5d7c5]
                            bg-white
                            p-6
                            shadow-sm
                        "
                    >

                        <div
                            className="
                                grid
                                gap-6
                                md:grid-cols-3
                            "
                        >

                            {/* Books */}

                            <div>

                                <div
                                    className="
                                        mb-3
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

                                    <BookOpen
                                        className="h-5 w-5"
                                    />

                                </div>


                                <h3
                                    className="
                                        font-medium
                                        text-[#2a1d15]
                                    "
                                >
                                    Manage Books
                                </h3>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        leading-5
                                        text-[#735e50]
                                    "
                                >
                                    Add new books, update book
                                    information and manage availability.
                                </p>

                            </div>


                            {/* Members */}

                            <div>

                                <div
                                    className="
                                        mb-3
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

                                    <Users
                                        className="h-5 w-5"
                                    />

                                </div>


                                <h3
                                    className="
                                        font-medium
                                        text-[#2a1d15]
                                    "
                                >
                                    Manage Members
                                </h3>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        leading-5
                                        text-[#735e50]
                                    "
                                >
                                    Create and manage library
                                    member accounts.
                                </p>

                            </div>


                            {/* Fines */}

                            <div>

                                <div
                                    className="
                                        mb-3
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


                                <h3
                                    className="
                                        font-medium
                                        text-[#2a1d15]
                                    "
                                >
                                    Automatic Fines
                                </h3>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        leading-5
                                        text-[#735e50]
                                    "
                                >
                                    Fines are calculated automatically
                                    when a book is returned late.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}