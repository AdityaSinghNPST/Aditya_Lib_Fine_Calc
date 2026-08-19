package com.library.Aditya_Lib_Fine_Calc.borrowing.controller;

import com.library.Aditya_Lib_Fine_Calc.borrowing.model.Borrowing;
import com.library.Aditya_Lib_Fine_Calc.borrowing.service.BorrowingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrowings")
public class BorrowingController {

    private final BorrowingService borrowingService;

    public BorrowingController(
            BorrowingService borrowingService
    ) {
        this.borrowingService = borrowingService;
    }

    // Get all borrowing records.
    @GetMapping
    public ResponseEntity<List<Borrowing>> getAllBorrowings() {

        return ResponseEntity.ok(
                borrowingService.getAllBorrowings()
        );
    }

    // Get one borrowing by ID.
    @GetMapping("/{id}")
    public ResponseEntity<Borrowing> getBorrowingById(
            @PathVariable Long id
    ) {

        Borrowing borrowing =
                borrowingService.findBorrowingById(id);

        if (borrowing == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(borrowing);
    }

    // Borrow a book.
    @PostMapping
    public ResponseEntity<Borrowing> borrowBook(
            @RequestBody BorrowBookRequest request
    ) {

        Borrowing borrowing =
                borrowingService.borrowBook(
                        request.userId(),
                        request.bookId()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(borrowing);
    }

    // Return a book.
    @PutMapping("/{id}/return")
    public ResponseEntity<Borrowing> returnBook(
            @PathVariable Long id
    ) {

        Borrowing borrowing =
                borrowingService.returnBook(id);

        return ResponseEntity.ok(borrowing);
    }

    // Request body for borrowing a book.
    public record BorrowBookRequest(
            Long userId,
            Long bookId
    ) {
    }
}