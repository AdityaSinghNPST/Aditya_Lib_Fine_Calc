package com.library.Aditya_Lib_Fine_Calc.book.controller;

import com.library.Aditya_Lib_Fine_Calc.book.model.Book;
import com.library.Aditya_Lib_Fine_Calc.book.service.BookService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // =========================================================
    // GET BOOKS
    // =========================================================
    //
    // Examples:
    //
    // GET /api/books
    //
    // GET /api/books?page=0&size=10
    //
    // GET /api/books?page=0&size=10&title=java
    //
    // GET /api/books?page=0&size=10&author=martin
    //

    @GetMapping
    public ResponseEntity<List<Book>> getBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author
    ) {

        return ResponseEntity.ok(
                bookService.getBooks(
                        page,
                        size,
                        title,
                        author
                )
        );
    }

    // =========================================================
    // GET BOOK BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(
            @PathVariable Long id
    ) {

        Book book =
                bookService.findBookById(id);

        if (book == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(book);
    }

    // =========================================================
    // CREATE BOOK
    // =========================================================

    @PostMapping
    public ResponseEntity<Book> createBook(
            @RequestBody CreateBookRequest request
    ) {

        Book book =
                bookService.createBook(
                        request.title(),
                        request.author(),
                        request.isbn()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(book);
    }

    // =========================================================
    // UPDATE BOOK
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(
            @PathVariable Long id,
            @RequestBody UpdateBookRequest request
    ) {

        // Create updated book using the URL ID.
        Book updatedBook =
                new Book(
                        id,
                        request.title(),
                        request.author(),
                        request.isbn(),
                        true
                );

        Book result =
                bookService.updateBook(
                        updatedBook
                );

        if (result == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(result);
    }

    // =========================================================
    // CREATE REQUEST
    // =========================================================

    public record CreateBookRequest(
            String title,
            String author,
            String isbn
    ) {
    }

    // =========================================================
    // UPDATE REQUEST
    // =========================================================

    public record UpdateBookRequest(
            String title,
            String author,
            String isbn
    ) {
    }
}