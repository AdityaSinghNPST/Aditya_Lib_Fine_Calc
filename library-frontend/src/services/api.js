/**
 * Central API Service
 *
 * This file is responsible for communicating
 * with the Spring Boot backend.
 *
 * All components use this file instead of
 * calling fetch() directly.
 */


// =========================================================
// BACKEND BASE URL
// =========================================================
//
// Development:
// VITE_API_BASE_URL=http://localhost:8080
//
// When deployed, change the value in the environment
// without changing this file.
//

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080";


// =========================================================
// LOCAL STORAGE KEYS
// =========================================================

const STORAGE_KEYS = {

    TOKEN: "aditya_lib_token",

    USER: "aditya_lib_user",
};


// =========================================================
// AUTHENTICATION STORAGE
// =========================================================


// Get JWT token.
export const getStoredToken = () => {

    return (
        localStorage.getItem(
            STORAGE_KEYS.TOKEN
        ) || ""
    );
};


// Get logged-in user.
export const getStoredUser = () => {

    try {

        const raw =
            localStorage.getItem(
                STORAGE_KEYS.USER
            );

        return raw
            ? JSON.parse(raw)
            : null;

    } catch {

        return null;
    }
};


// Save authentication session.
export const setAuthSession = (
    token,
    user
) => {

    localStorage.setItem(
        STORAGE_KEYS.TOKEN,
        token
    );

    localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(user)
    );
};


// Remove authentication session.
export const clearAuthSession = () => {

    localStorage.removeItem(
        STORAGE_KEYS.TOKEN
    );

    localStorage.removeItem(
        STORAGE_KEYS.USER
    );
};


// =========================================================
// COMMON HTTP REQUEST FUNCTION
// =========================================================

async function request(
    endpoint,
    options = {}
) {

    // Get the currently stored JWT.
    const token =
        getStoredToken();


    // Create request headers.
    const headers = {

        "Content-Type":
            "application/json",


        /*
         * Attach JWT when the user is logged in.
         */
        ...(token
            ? {
                Authorization:
                    `Bearer ${token}`,
            }
            : {}),


        /*
         * Allow individual requests
         * to add custom headers.
         */
        ...options.headers,
    };


    try {

        // =================================================
        // SEND REQUEST TO SPRING BOOT
        // =================================================

        const response =
            await fetch(
                `${API_BASE_URL}${endpoint}`,
                {
                    ...options,
                    headers,
                }
            );


        // =================================================
        // EMPTY RESPONSE
        // =================================================

        /*
         * DELETE endpoints may return
         * 204 No Content.
         */
        if (
            response.status === 204
        ) {

            return null;
        }


        // =================================================
        // READ RESPONSE
        // =================================================

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
                await response
                    .json()
                    .catch(() => null);

        } else {

            const text =
                await response
                    .text()
                    .catch(() => "");


            /*
             * Some responses may still contain JSON
             * even when the content type is missing.
             */

            try {

                data =
                    text
                        ? JSON.parse(text)
                        : null;

            } catch {

                data = text;
            }
        }


        // =================================================
        // HANDLE HTTP ERRORS
        // =================================================

        if (!response.ok) {

            /*
             * Your backend GlobalExceptionHandler
             * returns a "message" field.
             */

            const errorMessage =

                (
                    data &&
                    typeof data === "object" &&
                    (
                        data.message ||
                        data.error
                    )
                )

                ||

                (
                    typeof data === "string" &&
                    data
                )

                ||

                `Request failed with status ${response.status}`;


            const error =
                new Error(
                    errorMessage
                );


            // Keep status available to components.
            error.status =
                response.status;


            // Keep backend response available.
            error.data =
                data;


            throw error;
        }


        // Return successful response.
        return data;

    } catch (error) {

        console.error(
            `API Error [${options.method || "GET"}] ${endpoint}:`,
            error
        );

        throw error;
    }
}


// =========================================================
// API
// =========================================================

export const api = {


    // =====================================================
    // AUTHENTICATION
    // =====================================================

    auth: {

        /*
         * POST /api/auth/login
         *
         * Request:
         *
         * {
         *     email,
         *     password
         * }
         *
         * Response:
         *
         * {
         *     token,
         *     userId,
         *     name,
         *     email,
         *     role
         * }
         */

        login: (
            credentials
        ) =>

            request(
                "/api/auth/login",
                {
                    method: "POST",

                    body:
                        JSON.stringify(
                            credentials
                        ),
                }
            ),
    },


    // =====================================================
    // BOOKS
    // =====================================================

    books: {

        /*
         * Get books.
         *
         * Backend supports:
         *
         * page
         * size
         * title
         * author
         *
         * Example:
         *
         * /api/books?page=0&size=10
         */

        getAll: ({
            page = 0,
            size = 10,
            title = "",
            author = "",
        } = {}) => {

            const params =
                new URLSearchParams();


            params.set(
                "page",
                page
            );


            params.set(
                "size",
                size
            );


            // Add title filter if supplied.
            if (
                title &&
                title.trim()
            ) {

                params.set(
                    "title",
                    title.trim()
                );
            }


            // Add author filter if supplied.
            if (
                author &&
                author.trim()
            ) {

                params.set(
                    "author",
                    author.trim()
                );
            }


            return request(
                `/api/books?${params.toString()}`
            );
        },


        /*
         * Get one book.
         *
         * GET /api/books/{id}
         */

        getById: (
            id
        ) =>

            request(
                `/api/books/${id}`
            ),


        /*
         * Create book.
         *
         * POST /api/books
         */

        create: (
            book
        ) =>

            request(
                "/api/books",
                {
                    method: "POST",

                    body:
                        JSON.stringify(
                            book
                        ),
                }
            ),


        /*
         * Update book.
         *
         * PUT /api/books/{id}
         */

        update: (
            id,
            book
        ) =>

            request(
                `/api/books/${id}`,
                {
                    method: "PUT",

                    body:
                        JSON.stringify(
                            book
                        ),
                }
            ),


        /*
         * DELETE BOOK
         *
         * The frontend is ready for this.
         *
         * The current backend does not yet expose
         * DELETE /api/books/{id}.
         */

        delete: (
            id
        ) =>

            request(
                `/api/books/${id}`,
                {
                    method: "DELETE",
                }
            ),
    },


    // =====================================================
    // BORROWINGS
    // =====================================================

    borrowings: {

        /*
         * GET /api/borrowings
         *
         * Admin receives all borrowings.
         *
         * Normal user receives their own
         * borrowings according to backend logic.
         */

        getAll: () =>

            request(
                "/api/borrowings"
            ),


        /*
         * Borrow a book.
         *
         * POST /api/borrowings
         *
         * Only bookId is sent.
         *
         * The backend determines the user
         * from the authenticated JWT.
         */

        borrow: (
            bookId
        ) =>

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


        /*
         * Return a book.
         *
         * PUT /api/borrowings/{id}/return
         */

        returnBook: (
            borrowingId
        ) =>

            request(
                `/api/borrowings/${borrowingId}/return`,
                {
                    method: "PUT",
                }
            ),
    },


    // =====================================================
    // FINES
    // =====================================================

    fines: {

        /*
         * Admin:
         *
         * GET /api/fines
         */

        getAll: () =>

            request(
                "/api/fines"
            ),


        /*
         * Member:
         *
         * GET /api/fines/user/{userId}
         */

        getByUserId: (
            userId
        ) =>

            request(
                `/api/fines/user/${userId}`
            ),
    },


    // =====================================================
    // SETTINGS
    // =====================================================

    settings: {

        /*
         * GET /api/settings
         */

        get: () =>

            request(
                "/api/settings"
            ),


        /*
         * PUT /api/settings
         */

        update: (
            settings
        ) =>

            request(
                "/api/settings",
                {
                    method: "PUT",

                    body:
                        JSON.stringify(
                            settings
                        ),
                }
            ),
    },


    // =====================================================
    // USERS / MEMBERS
    // =====================================================

    users: {

        /*
         * GET /api/users
         */

        getAll: () =>

            request(
                "/api/users"
            ),


        /*
         * GET /api/users/{id}
         */

        getById: (
            id
        ) =>

            request(
                `/api/users/${id}`
            ),


        /*
         * POST /api/users
         */

        create: (
            user
        ) =>

            request(
                "/api/users",
                {
                    method: "POST",

                    body:
                        JSON.stringify(
                            user
                        ),
                }
            ),


        /*
         * PUT /api/users/{id}
         */

        update: (
            id,
            user
        ) =>

            request(
                `/api/users/${id}`,
                {
                    method: "PUT",

                    body:
                        JSON.stringify(
                            user
                        ),
                }
            ),


        /*
         * DELETE /api/users/{id}
         */

        delete: (
            id
        ) =>

            request(
                `/api/users/${id}`,
                {
                    method: "DELETE",
                }
            ),
    },
};


// =========================================================
// DEFAULT EXPORT
// =========================================================

export default api;