package com.library.Aditya_Lib_Fine_Calc.book.service;

import com.library.Aditya_Lib_Fine_Calc.book.model.Book;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BookService {

    private final BookStorageService bookStorageService;

    public BookService(BookStorageService bookStorageService) {
        this.bookStorageService = bookStorageService;
    }

    // =========================================================
    // GET ALL BOOKS
    // =========================================================

    public List<Book> getAllBooks() {

        return bookStorageService.getAllBooks();
    }

    // =========================================================
    // GET BOOKS WITH PAGINATION AND FILTERING
    // =========================================================

    public List<Book> getBooks(
            int page,
            int size,
            String title,
            String author
    ) {

        // Prevent invalid page number.
        if (page < 0) {

            throw new IllegalArgumentException(
                    "Page number cannot be negative"
            );
        }

        // Prevent invalid page size.
        if (size <= 0) {

            throw new IllegalArgumentException(
                    "Page size must be greater than zero"
            );
        }

        // Get all books.
        List<Book> allBooks =
                bookStorageService.getAllBooks();

        // List that will contain filtered books.
        List<Book> filteredBooks =
                new ArrayList<>();

        // Filter books.
        for (Book book : allBooks) {

            // Assume the book matches initially.
            boolean matches = true;

            // Filter by title if provided.
            if (title != null
                    && !title.trim().isEmpty()) {

                if (book.getTitle() == null
                        || !book.getTitle()
                        .toLowerCase()
                        .contains(
                                title.trim().toLowerCase()
                        )) {

                    matches = false;
                }
            }

            // Filter by author if provided.
            if (author != null
                    && !author.trim().isEmpty()) {

                if (book.getAuthor() == null
                        || !book.getAuthor()
                        .toLowerCase()
                        .contains(
                                author.trim().toLowerCase()
                        )) {

                    matches = false;
                }
            }

            // Add matching book.
            if (matches) {

                filteredBooks.add(book);
            }
        }

        // Calculate the starting index.
        int start =
                page * size;

        // If page is beyond available results,
        // return an empty list.
        if (start >= filteredBooks.size()) {

            return new ArrayList<>();
        }

        // Calculate the ending index.
        int end =
                Math.min(
                        start + size,
                        filteredBooks.size()
                );

        // Return only the requested page.
        return new ArrayList<>(
                filteredBooks.subList(
                        start,
                        end
                )
        );
    }

    // =========================================================
    // FIND BOOK BY ID
    // =========================================================

    public Book findBookById(Long id) {

        List<Book> books =
                bookStorageService.getAllBooks();

        for (Book book : books) {

            if (book.getId() != null
                    && book.getId().equals(id)) {

                return book;
            }
        }

        return null;
    }

    // =========================================================
    // CREATE BOOK
    // =========================================================

    public Book createBook(
            String title,
            String author,
            String isbn
    ) {

        // Validate title.
        if (title == null
                || title.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Book title cannot be empty"
            );
        }

        // Validate author.
        if (author == null
                || author.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Book author cannot be empty"
            );
        }

        // Validate ISBN.
        if (isbn == null
                || isbn.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "ISBN cannot be empty"
            );
        }

        List<Book> books =
                bookStorageService.getAllBooks();

        // Start IDs from 1.
        long nextId = 1;

        // Find the highest existing ID.
        for (Book book : books) {

            if (book.getId() != null
                    && book.getId() >= nextId) {

                nextId =
                        book.getId() + 1;
            }
        }

        // Create the new book.
        Book newBook =
                new Book(
                        nextId,
                        title.trim(),
                        author.trim(),
                        isbn.trim(),
                        true
                );

        // Add the book.
        books.add(newBook);

        // Save the updated list.
        bookStorageService.saveAllBooks(books);

        return newBook;
    }

    // =========================================================
    // UPDATE BOOK
    // =========================================================

    public Book updateBook(Book updatedBook) {

        if (updatedBook == null
                || updatedBook.getId() == null) {

            throw new IllegalArgumentException(
                    "Book ID is required"
            );
        }

        if (updatedBook.getTitle() == null
                || updatedBook.getTitle().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Book title cannot be empty"
            );
        }

        if (updatedBook.getAuthor() == null
                || updatedBook.getAuthor().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Book author cannot be empty"
            );
        }

        if (updatedBook.getIsbn() == null
                || updatedBook.getIsbn().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "ISBN cannot be empty"
            );
        }

        List<Book> books =
                bookStorageService.getAllBooks();

        // Search for the book.
        for (int i = 0;
             i < books.size();
             i++) {

            Book existingBook =
                    books.get(i);

            if (existingBook.getId() != null
                    && existingBook.getId()
                    .equals(updatedBook.getId())) {

                // Preserve the current availability.
                //
                // This is important because BorrowingService
                // changes availability when a book is borrowed.
                updatedBook.setAvailable(
                        existingBook.isAvailable()
                );

                // Replace the old book.
                books.set(
                        i,
                        updatedBook
                );

                // Save changes.
                bookStorageService.saveAllBooks(
                        books
                );

                return updatedBook;
            }
        }

        return null;
    }
}