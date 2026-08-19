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

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {

        return ResponseEntity.ok(
                bookService.getAllBooks()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(
            @PathVariable Long id
    ) {

        Book book = bookService.findBookById(id);

        if (book == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(book);
    }

    @PostMapping
    public ResponseEntity<Book> createBook(
            @RequestBody CreateBookRequest request
    ) {

        Book book = bookService.createBook(
                request.title(),
                request.author(),
                request.isbn()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(book);
    }

    public record CreateBookRequest(
            String title,
            String author,
            String isbn
    ) {
    }
}