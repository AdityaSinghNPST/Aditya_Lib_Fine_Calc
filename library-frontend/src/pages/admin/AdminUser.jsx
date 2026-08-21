import { useEffect, useState } from "react";

import {
    ArrowLeft,
    Edit,
    Plus,
    Search,
    Users,
    X,
    CheckCircle,
    AlertCircle,
    Trash2,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";


// =========================================================
// ADMIN USER MANAGEMENT
// =========================================================

export default function AdminUser() {

    // =====================================================
    // STATE
    // =====================================================

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState(null);

    const [search, setSearch] = useState("");

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingUser, setEditingUser] = useState(null);


    // =====================================================
    // FORM STATE
    // =====================================================

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER",
    });


    // =====================================================
    // LOAD USERS
    // =====================================================

    async function loadUsers() {

        try {

            setLoading(true);

            setError("");

            const data =
                await api.users.getAll();


            // Backend returns an array.

            if (Array.isArray(data)) {

                setUsers(data);

                return;
            }


            // Backend returns a Spring Page.

            if (
                data &&
                Array.isArray(data.content)
            ) {

                setUsers(data.content);

                return;
            }


            // Fallback.

            setUsers([]);

        } catch (err) {

            console.error(
                "Failed to load users:",
                err
            );

            setError(
                err.message ||
                "Unable to load users."
            );

        } finally {

            setLoading(false);
        }
    }


    // =====================================================
    // LOAD USERS WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        loadUsers();

    }, []);


    // =====================================================
    // OPEN ADD USER FORM
    // =====================================================

    function handleAddUser() {

        setEditingUser(null);

        setForm({
            name: "",
            email: "",
            password: "",
            role: "USER",
        });

        setError("");

        setSuccess("");

        setShowForm(true);
    }


    // =====================================================
    // OPEN EDIT USER FORM
    // =====================================================

    async function handleEditUser(user) {

        setEditingUser(user);

        setError("");

        setSuccess("");

        setShowForm(true);

        try {

            const freshUser =
                await api.users.getById(
                    user.id
                );

            setForm({
                name: freshUser.name || "",
                email: freshUser.email || "",
                password: "",
                role: freshUser.role || "USER",
            });

        } catch (err) {

            setForm({
                name: user.name || "",
                email: user.email || "",
                password: "",
                role: user.role || "USER",
            });

        }
    }


    // =====================================================
    // CLOSE FORM
    // =====================================================

    function handleCloseForm() {

        if (saving) {

            return;
        }

        setShowForm(false);

        setEditingUser(null);

        setError("");
    }


    // =====================================================
    // HANDLE FORM INPUT
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
    // SAVE USER
    // =====================================================

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");

        setSuccess("");


        // -------------------------------------------------
        // Validate name
        // -------------------------------------------------

        if (!form.name.trim()) {

            setError(
                "Name is required."
            );

            return;
        }


        // -------------------------------------------------
        // Validate email
        // -------------------------------------------------

        if (!form.email.trim()) {

            setError(
                "Email is required."
            );

            return;
        }


        // -------------------------------------------------
        // Validate password for new user
        // -------------------------------------------------

        if (
            !editingUser &&
            !form.password.trim()
        ) {

            setError(
                "Password is required."
            );

            return;
        }


        try {

            setSaving(true);


            // =================================================
            // EDIT EXISTING USER
            // =================================================

            if (editingUser) {

                const payload = {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    role: form.role,
                };


                /*
                 * Only send the password when the admin
                 * actually entered a new password.
                 */

                if (form.password.trim()) {

                    payload.password =
                        form.password.trim();
                }


                await api.users.update(
                    editingUser.id,
                    payload
                );


                setSuccess(
                    "User updated successfully."
                );

            }


            // =================================================
            // CREATE NEW USER
            // =================================================

            else {

                await api.users.create({

                    name:
                        form.name.trim(),

                    email:
                        form.email.trim(),

                    password:
                        form.password,

                    role:
                        form.role,

                });


                setSuccess(
                    "User created successfully."
                );
            }


            // Close modal.

            setShowForm(false);

            setEditingUser(null);


            // Reload users.

            await loadUsers();


            // Clear success message.

            setTimeout(() => {

                setSuccess("");

            }, 4000);

        } catch (err) {

            console.error(
                "Failed to save user:",
                err
            );

            setError(
                err.message ||
                "Unable to save user."
            );

        } finally {

            setSaving(false);
        }
    }


    // =====================================================
    // DELETE USER
    // =====================================================

    async function handleDeleteUser(user) {

        // const confirmed =
        //     window.confirm(
        //         `Are you sure you want to delete "${user.name}"?`
        //     );
        //
        // if (!confirmed) {
        //
        //     return;
        // }

        try {

            setDeletingId(user.id);

            setError("");

            setSuccess("");

            await api.users.delete(
                user.id
            );

            setSuccess(
                "User deleted successfully."
            );

            await loadUsers();

            setTimeout(() => {

                setSuccess("");

            }, 4000);

        } catch (err) {

            setError(
                err.message ||
                "Unable to delete user."
            );

        } finally {

            setDeletingId(null);
        }
    }


    // =====================================================
    // SEARCH USERS
    // =====================================================

    const filteredUsers =
        users.filter((user) => {

            const searchValue =
                search
                    .toLowerCase()
                    .trim();


            if (!searchValue) {

                return true;
            }


            const name =
                String(
                    user.name || ""
                ).toLowerCase();


            const email =
                String(
                    user.email || ""
                ).toLowerCase();


            const role =
                String(
                    user.role || ""
                ).toLowerCase();


            const id =
                String(
                    user.id || ""
                ).toLowerCase();


            return (

                name.includes(
                    searchValue
                )

                ||

                email.includes(
                    searchValue
                )

                ||

                role.includes(
                    searchValue
                )

                ||

                id.includes(
                    searchValue
                )

            );
        });


    // =====================================================
    // GET INITIAL
    // =====================================================

    function getInitial(name) {

        if (!name) {

            return "?";
        }


        return name
            .charAt(0)
            .toUpperCase();
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
                    BACK TO DASHBOARD
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

                <div
                    className="
                        mb-6
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    "
                >

                    <div>

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
                            Users
                        </h1>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-[#78716c]
                            "
                        >
                            Create and manage library users.
                        </p>

                    </div>


                    {/* ADD USER BUTTON */}

                    <button
                        type="button"
                        onClick={handleAddUser}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-[#ea580c]
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-[#c2410c]
                        "
                    >

                        <Plus
                            className="h-4 w-4"
                        />

                        Add User

                    </button>

                </div>


                {/* =================================================
                    SUCCESS MESSAGE
                ================================================= */}

                {/*
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
                */}


                {/* =================================================
                    ERROR MESSAGE
                ================================================= */}

                {error && !showForm && (

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
                            className="rounded p-1 hover:bg-red-100"
                        >

                            <X
                                className="h-4 w-4"
                            />

                        </button>

                    </div>

                )}


                {/* =================================================
                    SEARCH
                ================================================= */}

                <div
                    className="
                        mb-5
                        rounded-xl
                        border
                        border-[#fed7aa]
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
                                text-[#a8a29e]
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
                            placeholder="Search by name, email, role or ID..."
                            className="
                                w-full
                                rounded-lg
                                border
                                border-[#fdba74]
                                bg-[#fffef9]
                                py-2.5
                                pl-9
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


                {/* =================================================
                    USER TABLE
                ================================================= */}

                <div
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#fed7aa]
                        bg-white
                        shadow-sm
                    "
                >

                    {loading ? (

                        /* =========================================
                           LOADING
                        ========================================= */

                        <div
                            className="
                                flex
                                min-h-64
                                items-center
                                justify-center
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    text-[#78716c]
                                "
                            >
                                Loading users...
                            </p>

                        </div>

                    ) : filteredUsers.length === 0 ? (

                        /* =========================================
                           EMPTY
                        ========================================= */

                        <div
                            className="
                                flex
                                min-h-64
                                flex-col
                                items-center
                                justify-center
                                px-4
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
                                    bg-[#ffedd5]
                                    text-[#ea580c]
                                "
                            >

                                <Users
                                    className="h-5 w-5"
                                />

                            </div>


                            <h3
                                className="
                                    font-medium
                                    text-[#292524]
                                "
                            >
                                No users found
                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-center
                                    text-sm
                                    text-[#a8a29e]
                                "
                            >
                                Try a different search or
                                create a new user.
                            </p>

                        </div>

                    ) : (

                        /* =========================================
                           TABLE
                        ========================================= */

                        <div
                            className="
                                overflow-x-auto
                            "
                        >

                            <table
                                className="
                                    min-w-full
                                "
                            >

                                {/* TABLE HEADER */}

                                <thead
                                    className="
                                        border-b
                                        border-[#fed7aa]
                                        bg-[#fffbeb]
                                    "
                                >

                                    <tr>

                                        <th
                                            className="
                                                whitespace-nowrap
                                                px-5
                                                py-3
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-[#78716c]
                                            "
                                        >
                                            ID
                                        </th>


                                        <th
                                            className="
                                                whitespace-nowrap
                                                px-5
                                                py-3
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-[#78716c]
                                            "
                                        >
                                            User
                                        </th>


                                        <th
                                            className="
                                                whitespace-nowrap
                                                px-5
                                                py-3
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-[#78716c]
                                            "
                                        >
                                            Email
                                        </th>


                                        <th
                                            className="
                                                whitespace-nowrap
                                                px-5
                                                py-3
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-[#78716c]
                                            "
                                        >
                                            Role
                                        </th>


                                        <th
                                            className="
                                                whitespace-nowrap
                                                px-5
                                                py-3
                                                text-right
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-[#78716c]
                                            "
                                        >
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredUsers.map(
                                        (user) => (

                                            <tr
                                                key={user.id}
                                                className="border-b border-[#eee5dc] last:border-0 hover:bg-[#fffbf5]"
                                            >

                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-[#a8a29e]">
                                                    #{user.id}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffedd5] text-sm font-semibold text-[#ea580c]">
                                                            {getInitial(user.name)}
                                                        </div>
                                                        <span className="text-sm font-medium text-[#292524]">
                                                            {user.name || "Unnamed user"}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-[#78716c]">
                                                    {user.email || "—"}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span className="inline-flex rounded-full bg-[#ffedd5] px-2.5 py-1 text-xs font-medium text-[#78716c]">
                                                        {user.role || "USER"}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditUser(user)}
                                                            className="inline-flex items-center gap-2 rounded-lg border border-[#fdba74] bg-white px-3 py-2 text-xs font-medium text-[#57534e] transition hover:bg-[#fff7ed]"
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteUser(user)}
                                                            disabled={deletingId === user.id}
                                                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            {deletingId === user.id ? "Deleting..." : "Delete"}
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>


            {/* =====================================================
                ADD / EDIT USER MODAL
            ===================================================== */}

            {showForm && (

                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/30
                        p-4
                    "
                >

                    <div
                        className="
                            max-h-[90vh]
                            w-full
                            max-w-lg
                            overflow-y-auto
                            rounded-2xl
                            border
                            border-[#fed7aa]
                            bg-white
                            shadow-xl
                        "
                    >

                        {/* =================================================
                            MODAL HEADER
                        ================================================= */}

                        <div
                            className="
                                sticky
                                top-0
                                z-10
                                flex
                                items-center
                                justify-between
                                border-b
                                border-[#fed7aa]
                                bg-white
                                px-6
                                py-5
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        text-lg
                                        font-semibold
                                        text-[#292524]
                                    "
                                >

                                    {editingUser
                                        ? "Edit User"
                                        : "Add User"}

                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-[#a8a29e]
                                    "
                                >

                                    {editingUser
                                        ? "Update the user's information."
                                        : "Create a new library user."}

                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={handleCloseForm}
                                disabled={saving}
                                className="
                                    rounded-lg
                                    p-2
                                    text-[#78716c]
                                    transition
                                    hover:bg-[#ffedd5]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                <X
                                    className="h-5 w-5"
                                />

                            </button>

                        </div>


                        {/* =================================================
                            FORM ERROR
                        ================================================= */}

                        {error && (

                            <div
                                className="
                                    mx-6
                                    mt-5
                                    flex
                                    items-start
                                    gap-2
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


                        {/* =================================================
                            FORM
                        ================================================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="
                                space-y-5
                                p-6
                            "
                        >

                            {/* NAME */}

                            <div>

                                <label
                                    htmlFor="name"
                                    className="
                                        mb-1.5
                                        block
                                        text-sm
                                        font-medium
                                        text-[#44403c]
                                    "
                                >
                                    Name
                                </label>


                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    disabled={saving}
                                    placeholder="Enter user name"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-[#fdba74]
                                        bg-[#fffef9]
                                        px-3
                                        py-2.5
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


                            {/* EMAIL */}

                            <div>

                                <label
                                    htmlFor="email"
                                    className="
                                        mb-1.5
                                        block
                                        text-sm
                                        font-medium
                                        text-[#44403c]
                                    "
                                >
                                    Email
                                </label>


                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    disabled={saving}
                                    placeholder="Enter email address"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-[#fdba74]
                                        bg-[#fffef9]
                                        px-3
                                        py-2.5
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


                            {/* PASSWORD */}

                            <div>

                                <label
                                    htmlFor="password"
                                    className="
                                        mb-1.5
                                        block
                                        text-sm
                                        font-medium
                                        text-[#44403c]
                                    "
                                >
                                    Password
                                </label>


                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    disabled={saving}
                                    placeholder={
                                        editingUser
                                            ? "Leave blank to keep current password"
                                            : "Enter password"
                                    }
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-[#fdba74]
                                        bg-[#fffef9]
                                        px-3
                                        py-2.5
                                        text-sm
                                        text-[#292524]
                                        outline-none
                                        transition
                                        focus:border-[#ea580c]
                                        focus:ring-1
                                        focus:ring-[#ea580c]
                                    "
                                />


                                {editingUser && (

                                    <p
                                        className="
                                            mt-1.5
                                            text-xs
                                            text-[#a8a29e]
                                        "
                                    >
                                        Leave this field empty if you
                                        don't want to change the password.
                                    </p>

                                )}

                            </div>


                            {/* ROLE */}

                            <div>

                                <label
                                    htmlFor="role"
                                    className="
                                        mb-1.5
                                        block
                                        text-sm
                                        font-medium
                                        text-[#44403c]
                                    "
                                >
                                    Role
                                </label>


                                <select
                                    id="role"
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    disabled={saving}
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-[#fdba74]
                                        bg-[#fffef9]
                                        px-3
                                        py-2.5
                                        text-sm
                                        text-[#292524]
                                        outline-none
                                        transition
                                        focus:border-[#ea580c]
                                        focus:ring-1
                                        focus:ring-[#ea580c]
                                    "
                                >

                                    <option value="USER">
                                        USER
                                    </option>

                                    <option value="ADMIN">
                                        ADMIN
                                    </option>

                                </select>

                            </div>


                            {/* =================================================
                                FORM BUTTONS
                            ================================================= */}

                            <div
                                className="
                                    flex
                                    justify-end
                                    gap-3
                                    pt-2
                                "
                            >

                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    disabled={saving}
                                    className="
                                        rounded-lg
                                        border
                                        border-[#fdba74]
                                        bg-white
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-[#78716c]
                                        transition
                                        hover:bg-[#fff7ed]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="
                                        rounded-lg
                                        bg-[#ea580c]
                                        px-4
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

                                    {saving
                                        ? "Saving..."
                                        : editingUser
                                            ? "Update User"
                                            : "Create User"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}