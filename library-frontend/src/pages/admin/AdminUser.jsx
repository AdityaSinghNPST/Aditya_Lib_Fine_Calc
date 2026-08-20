import { useEffect, useState } from "react";

import {
    Users,
    Plus,
    Pencil,
    Trash2,
    X,
    Search,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";

import api from "../../services/api";


export default function AdminUsers() {

    // =====================================================
    // STATE
    // =====================================================

    const [users, setUsers] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [editingUser, setEditingUser] =
        useState(null);


    // =====================================================
    // LOAD USERS
    // =====================================================

    async function loadUsers() {

        try {

            setLoading(true);

            setError("");

            const data =
                await api.users.getAll();

            setUsers(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            setError(
                err.message ||
                "Unable to load members."
            );

        } finally {

            setLoading(false);
        }
    }


    useEffect(() => {

        loadUsers();

    }, []);


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredUsers =
        users.filter((user) => {

            const value =
                search
                    .toLowerCase()
                    .trim();

            if (!value) {
                return true;
            }

            return (
                String(user.name || "")
                    .toLowerCase()
                    .includes(value)
                ||
                String(user.email || "")
                    .toLowerCase()
                    .includes(value)
                ||
                String(user.id || "")
                    .toLowerCase()
                    .includes(value)
            );
        });


    // =====================================================
    // ADD
    // =====================================================

    function handleAdd() {

        setEditingUser(null);

        setShowForm(true);
    }


    // =====================================================
    // EDIT
    // =====================================================

    function handleEdit(user) {

        setEditingUser(user);

        setShowForm(true);
    }


    // =====================================================
    // DELETE
    // =====================================================

    async function handleDelete(user) {

        const confirmed =
            window.confirm(
                `Delete member "${user.name}"?`
            );

        if (!confirmed) {
            return;
        }


        try {

            setError("");

            await api.users.delete(
                user.id
            );

            await loadUsers();

        } catch (err) {

            setError(
                err.message ||
                "Unable to delete member."
            );
        }
    }


    // =====================================================
    // FORM SUCCESS
    // =====================================================

    async function handleSuccess() {

        setShowForm(false);

        setEditingUser(null);

        await loadUsers();
    }


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
                    max-w-7xl
                    px-4
                    py-8
                    sm:px-6
                    lg:px-8
                "
            >

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
                            Members
                        </h1>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-[#735e50]
                            "
                        >
                            Manage library members and users.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleAdd}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-[#a8652c]
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            hover:bg-[#8f501e]
                        "
                    >

                        <Plus className="h-4 w-4" />

                        Add Member

                    </button>

                </div>


                {/* =================================================
                    ERROR
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

                        <span>
                            {error}
                        </span>


                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                        >

                            <X className="h-4 w-4" />

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
                        border-[#e5d7c5]
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
                                text-[#9a8778]
                            "
                        />


                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search by name, email or member ID..."
                            className="
                                w-full
                                rounded-lg
                                border
                                border-[#ddd0c1]
                                bg-[#fffdfb]
                                py-2.5
                                pl-9
                                pr-3
                                text-sm
                                outline-none
                                focus:border-[#a8652c]
                            "
                        />

                    </div>

                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                <div
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#e5d7c5]
                        bg-white
                        shadow-sm
                    "
                >

                    {loading ? (

                        <div
                            className="
                                flex
                                min-h-64
                                items-center
                                justify-center
                                text-sm
                                text-[#735e50]
                            "
                        >
                            Loading members...
                        </div>

                    ) : filteredUsers.length === 0 ? (

                        <div
                            className="
                                flex
                                min-h-64
                                flex-col
                                items-center
                                justify-center
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
                                    bg-[#f1e3d3]
                                    text-[#a8652c]
                                "
                            >

                                <Users className="h-5 w-5" />

                            </div>


                            <h3
                                className="
                                    font-medium
                                    text-[#2a1d15]
                                "
                            >
                                No members found
                            </h3>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="min-w-full">

                                <thead
                                    className="
                                        border-b
                                        border-[#e5d7c5]
                                        bg-[#fcf8f3]
                                    "
                                >

                                    <tr>

                                        <th
                                            className="
                                                px-5
                                                py-3
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-[#735e50]
                                            "
                                        >
                                            Member
                                        </th>


                                        <th
                                            className="
                                                px-5
                                                py-3
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-[#735e50]
                                            "
                                        >
                                            Email
                                        </th>


                                        <th
                                            className="
                                                px-5
                                                py-3
                                                text-left
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-[#735e50]
                                            "
                                        >
                                            Role
                                        </th>


                                        <th
                                            className="
                                                px-5
                                                py-3
                                                text-right
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-[#735e50]
                                            "
                                        >
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredUsers.map(
                                        (user) => (

                                            <tr
                                                key={user.id}
                                                className="
                                                    border-b
                                                    border-[#eee5dc]
                                                    last:border-0
                                                    hover:bg-[#fffaf5]
                                                "
                                            >

                                                {/* MEMBER */}

                                                <td className="px-5 py-4">

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
                                                                h-9
                                                                w-9
                                                                items-center
                                                                justify-center
                                                                rounded-full
                                                                bg-[#f1e3d3]
                                                                text-sm
                                                                font-semibold
                                                                text-[#a8652c]
                                                            "
                                                        >

                                                            {(
                                                                user.name ||
                                                                "U"
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}

                                                        </div>


                                                        <div>

                                                            <p
                                                                className="
                                                                    text-sm
                                                                    font-medium
                                                                    text-[#2a1d15]
                                                                "
                                                            >
                                                                {user.name}
                                                            </p>


                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-[#9a8778]
                                                                "
                                                            >
                                                                ID: {user.id}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* EMAIL */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-[#735e50]
                                                    "
                                                >
                                                    {user.email}
                                                </td>


                                                {/* ROLE */}

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`
                                                            inline-flex
                                                            rounded-full
                                                            px-2.5
                                                            py-1
                                                            text-xs
                                                            font-medium
                                                            ${
                                                                user.role ===
                                                                "ADMIN"
                                                                    ? "bg-purple-50 text-purple-700"
                                                                    : "bg-green-50 text-green-700"
                                                            }
                                                        `}
                                                    >
                                                        {user.role}
                                                    </span>

                                                </td>


                                                {/* ACTIONS */}

                                                <td className="px-5 py-4">

                                                    <div
                                                        className="
                                                            flex
                                                            justify-end
                                                            gap-2
                                                        "
                                                    >

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    user
                                                                )
                                                            }
                                                            className="
                                                                flex
                                                                h-8
                                                                w-8
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                text-[#73533b]
                                                                hover:bg-[#f1e3d3]
                                                            "
                                                        >

                                                            <Pencil className="h-4 w-4" />

                                                        </button>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user
                                                                )
                                                            }
                                                            className="
                                                                flex
                                                                h-8
                                                                w-8
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                text-red-500
                                                                hover:bg-red-50
                                                            "
                                                        >

                                                            <Trash2 className="h-4 w-4" />

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


            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            {showForm && (

                <UserForm
                    user={editingUser}
                    onSuccess={handleSuccess}
                    onCancel={() => {

                        setShowForm(false);

                        setEditingUser(null);

                    }}
                />

            )}

        </div>
    );
}


// =========================================================
// USER FORM
// =========================================================

function UserForm({
    user,
    onSuccess,
    onCancel,
}) {

    const editing =
        Boolean(user);


    const [name, setName] =
        useState(
            user?.name || ""
        );


    const [email, setEmail] =
        useState(
            user?.email || ""
        );


    const [password, setPassword] =
        useState("");


    const [role, setRole] =
        useState(
            user?.role || "USER"
        );


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    // =====================================================
    // SUBMIT
    // =====================================================

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");


        if (!name.trim()) {

            setError(
                "Name is required."
            );

            return;
        }


        if (!email.trim()) {

            setError(
                "Email is required."
            );

            return;
        }


        /*
         * Password is required only while
         * creating a new member.
         */

        if (!editing && !password.trim()) {

            setError(
                "Password is required."
            );

            return;
        }


        try {

            setLoading(true);


            const data = {

                name:
                    name.trim(),

                email:
                    email.trim(),

                role,

            };


            /*
             * Only send password when it is provided.
             */

            if (password.trim()) {

                data.password =
                    password;
            }


            if (editing) {

                await api.users.update(
                    user.id,
                    data
                );

            } else {

                await api.users.create(
                    data
                );
            }


            onSuccess();

        } catch (err) {

            setError(
                err.message ||
                "Unable to save member."
            );

        } finally {

            setLoading(false);
        }
    }


    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                px-4
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    rounded-xl
                    border
                    border-[#e5d7c5]
                    bg-[#faf4ec]
                    p-6
                    shadow-2xl
                "
            >

                {/* HEADER */}

                <div
                    className="
                        mb-5
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div>

                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-[#2a1d15]
                            "
                        >
                            {editing
                                ? "Edit Member"
                                : "Add Member"}
                        </h2>


                        <p
                            className="
                                mt-1
                                text-xs
                                text-[#735e50]
                            "
                        >
                            Enter member information.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onCancel}
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-[#735e50]
                            hover:bg-[#eee2d5]
                        "
                    >

                        <X className="h-4 w-4" />

                    </button>

                </div>


                {/* ERROR */}

                {error && (

                    <div
                        className="
                            mb-4
                            rounded-lg
                            border
                            border-red-200
                            bg-red-50
                            px-3
                            py-2
                            text-xs
                            text-red-700
                        "
                    >
                        {error}
                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    {/* NAME */}

                    <div>

                        <label
                            className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-[#463529]
                            "
                        >
                            Name
                        </label>


                        <input
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            placeholder="Enter member name"
                            disabled={loading}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-[#ddd0c1]
                                bg-white
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                                focus:border-[#a8652c]
                            "
                        />

                    </div>


                    {/* EMAIL */}

                    <div>

                        <label
                            className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-[#463529]
                            "
                        >
                            Email
                        </label>


                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            placeholder="Enter email"
                            disabled={loading}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-[#ddd0c1]
                                bg-white
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                                focus:border-[#a8652c]
                            "
                        />

                    </div>


                    {/* PASSWORD */}

                    <div>

                        <label
                            className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-[#463529]
                            "
                        >
                            Password
                        </label>


                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder={
                                editing
                                    ? "Leave blank to keep current password"
                                    : "Enter password"
                            }
                            disabled={loading}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-[#ddd0c1]
                                bg-white
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                                focus:border-[#a8652c]
                            "
                        />

                    </div>


                    {/* ROLE */}

                    <div>

                        <label
                            className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-[#463529]
                            "
                        >
                            Role
                        </label>


                        <select
                            value={role}
                            onChange={(e) =>
                                setRole(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-[#ddd0c1]
                                bg-white
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                                focus:border-[#a8652c]
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


                    {/* BUTTONS */}

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
                            onClick={onCancel}
                            disabled={loading}
                            className="
                                rounded-lg
                                border
                                border-[#ddd0c1]
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-[#73533b]
                                hover:bg-[#f5ede3]
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                rounded-lg
                                bg-[#a8652c]
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                hover:bg-[#8f501e]
                                disabled:opacity-50
                            "
                        >

                            {loading
                                ? "Saving..."
                                : editing
                                    ? "Update Member"
                                    : "Add Member"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}