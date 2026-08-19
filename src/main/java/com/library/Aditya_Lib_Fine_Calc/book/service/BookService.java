package com.library.Aditya_Lib_Fine_Calc.book.service;

import com.library.Aditya_Lib_Fine_Calc.book.model.Book;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookStorageService bookStorageService;

    public BookService(BookStorageService bookStorageService) {
        this.bookStorageService = bookStorageService;
    }

    // Get all books.
    public List<Book> getAllBooks() {

        return bookStorageService.getAllBooks();
    }

    // Find a book using its ID.
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

    // Create a new book.
    public Book createBook(
            String title,
            String author,
            String isbn
    ) {

        List<Book> books =
                bookStorageService.getAllBooks();

        // Start IDs from 1.
        long nextId = 1;

        // Find the highest existing ID.
        for (Book book : books) {

            if (book.getId() != null
                    && book.getId() >= nextId) {

                nextId = book.getId() + 1;
            }
        }

        // Create the new book.
        Book newBook = new Book(
                nextId,
                title,
                author,
                isbn,
                true
        );

        // Add the book to the list.
        books.add(newBook);

        // Save the updated list.
        bookStorageService.saveAllBooks(books);

        return newBook;
    }

    // Update an existing book.
    public Book updateBook(Book updatedBook) {

        List<Book> books =
                bookStorageService.getAllBooks();

        // Search for the book that needs to be updated.
        for (int i = 0; i < books.size(); i++) {

            Book existingBook = books.get(i);

            // Compare the IDs.
            if (existingBook.getId() != null
                    && existingBook.getId().equals(updatedBook.getId())) {

                // Replace the old book with the updated book.
                books.set(i, updatedBook);

                // Save the updated list to books.json.
                bookStorageService.saveAllBooks(books);

                return updatedBook;
            }
        }

        // Book was not found.
        return null;
    }
}