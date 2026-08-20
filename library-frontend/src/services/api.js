// =========================================================
// API CONFIGURATION
// =========================================================

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080";


// =========================================================
// GET TOKEN
// =========================================================

function getToken() {

    return localStorage.getItem("token");
}


// =========================================================
// MAIN REQUEST FUNCTION
// =========================================================

async function request(
    endpoint,
    options = {}
) {

    const token =
        getToken();

    const headers = {

        "Content-Type":
            "application/json",

        ...(options.headers || {}),

    };

    if (token) {

        headers.Authorization =
            `Bearer ${token}`;
    }

    let response;

    try {

        response =
            await fetch(
                `${API_BASE_URL}${endpoint}`,
                {
                    ...options,
                    headers,
                }
            );

    } catch (error) {

        console.error(
            "API connection error:",
            error
        );

        throw new Error(
            "Failed to fetch. Make sure the backend is running."
        );
    }

    const contentType =
        response.headers.get(
            "content-type"
        );

    let data = null;

    if (
        contentType &&
        contentType.includes(
            "application/json"
        )
    ) {

        data =
            await response.json();

    } else {

        const text =
            await response.text();

        data =
            text || null;
    }

    if (
        response.status === 401
    ) {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        throw new Error(
            "Your session has expired. Please login again."
        );
    }

    if (
        response.status === 403
    ) {

        throw new Error(
            "You do not have permission to perform this action."
        );
    }

    if (!response.ok) {

        let message =
            "Something went wrong.";

        if (
            typeof data ===
            "string" &&
            data.trim()
        ) {

            message = data;

        } else if (
            data?.message
        ) {

            message =
                data.message;

        } else if (
            data?.error
        ) {

            message =
                data.error;
        }

        throw new Error(
            message
        );
    }

    return data;
}


// =========================================================
// AUTH API
// =========================================================

const auth = {

    login: (
        email,
        password
    ) =>

        request(
            "/api/auth/login",
            {
                method: "POST",

                body:
                    JSON.stringify({
                        email,
                        password,
                    }),
            }
        ),
};


// =========================================================
// BOOK API
// =========================================================

const books = {

    getAll: ({
        page = 0,
        size = 10,
        title = "",
        author = "",
    } = {}) => {

        const params =
            new URLSearchParams();

        params.append(
            "page",
            page
        );

        params.append(
            "size",
            size
        );

        if (title) {

            params.append(
                "title",
                title
            );
        }

        if (author) {

            params.append(
                "author",
                author
            );
        }

        return request(
            `/api/books?${params.toString()}`
        );
    },

    getById: (id) =>

        request(
            `/api/books/${id}`
        ),

    create: (book) =>

        request(
            "/api/books",
            {
                method: "POST",

                body:
                    JSON.stringify(book),
            }
        ),

    update: (
        id,
        book
    ) =>

        request(
            `/api/books/${id}`,
            {
                method: "PUT",

                body:
                    JSON.stringify(book),
            }
        ),

    delete: (id) =>

        request(
            `/api/books/${id}`,
            {
                method: "DELETE",
            }
        ),
};


// =========================================================
// USER API
// =========================================================

const users = {

    getAll: () =>

        request(
            "/api/users"
        ),

    getById: (id) =>

        request(
            `/api/users/${id}`
        ),

    create: (user) =>

        request(
            "/api/users",
            {
                method: "POST",

                body:
                    JSON.stringify(user),
            }
        ),

    update: (
        id,
        user
    ) =>

        request(
            `/api/users/${id}`,
            {
                method: "PUT",

                body:
                    JSON.stringify(user),
            }
        ),

    delete: (id) =>

        request(
            `/api/users/${id}`,
            {
                method: "DELETE",
            }
        ),
};


// =========================================================
// BORROWING API
// =========================================================

const borrowings = {

    getAll: () =>

        request(
            "/api/borrowings"
        ),

    borrow: (bookId) =>

        request(
            "/api/borrowings",
            {
                method: "POST",

                body:
                    JSON.stringify({
                        bookId,
                    }),
            }
        ),

    returnBook: (id) =>

        request(
            `/api/borrowings/${id}/return`,
            {
                method: "PUT",
            }
        ),
};


// =========================================================
// FINE API
// =========================================================

const fines = {

    getAll: () =>

        request(
            "/api/fines"
        ),

    getByUserId: (userId) =>

        request(
            `/api/fines/user/${userId}`
        ),
};


// =========================================================
// SETTINGS API
// =========================================================

const settings = {

    get: () =>

        request(
            "/api/settings"
        ),

    update: (data) =>

        request(
            "/api/settings",
            {
                method: "PUT",

                body:
                    JSON.stringify(data),
            }
        ),
};


// =========================================================
// EXPORT
// =========================================================

const api = {

    auth,

    books,

    users,

    borrowings,

    fines,

    settings,

};


export default api;
