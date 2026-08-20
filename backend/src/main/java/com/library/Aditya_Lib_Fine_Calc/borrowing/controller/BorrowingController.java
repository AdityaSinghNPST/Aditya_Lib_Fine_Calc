package com.library.Aditya_Lib_Fine_Calc.borrowing.controller;

import com.library.Aditya_Lib_Fine_Calc.borrowing.dto.BorrowBookRequest;
import com.library.Aditya_Lib_Fine_Calc.borrowing.model.Borrowing;
import com.library.Aditya_Lib_Fine_Calc.borrowing.service.BorrowingService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrowings")
public class BorrowingController {

    private final BorrowingService borrowingService;

    public BorrowingController(BorrowingService borrowingService) {
        this.borrowingService = borrowingService;
    }

    // =========================================================
    // GET ALL / USER'S BORROWINGS
    // =========================================================
    //
    // ADMIN  -> sees all borrowings.
    // USER   -> sees only their own borrowings.
    //
    @GetMapping
    public ResponseEntity<List<Borrowing>> getBorrowings(
            Authentication authentication
    ) {

        // Check whether the logged-in user is an Admin.
        boolean isAdmin =
                authentication.getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .anyMatch("ROLE_ADMIN"::equals);

        // Admin can see all borrowings.
        if (isAdmin) {

            return ResponseEntity.ok(
                    borrowingService.getAllBorrowings()
            );
        }

        // Get the logged-in user's ID from the JWT.
        Long userId =
                (Long) authentication.getCredentials();

        // Member can see only their own borrowings.
        return ResponseEntity.ok(
                borrowingService.getBorrowingsByUserId(userId)
        );
    }

    // =========================================================
    // BORROW A BOOK
    // =========================================================
    //
    // The userId is NOT received from the request.
    // It is taken from the logged-in user's JWT.
    //
    // Request:
    //
    // POST /api/borrowings
    //
    // {
    //     "bookId": 1
    // }
    //
    @PostMapping
    public ResponseEntity<Borrowing> borrowBook(
            @RequestBody BorrowBookRequest request,
            Authentication authentication
    ) {

        // Get the logged-in user's ID from the JWT.
        Long userId =
                (Long) authentication.getCredentials();

        // Borrow the book for the logged-in user.
        Borrowing borrowing =
                borrowingService.borrowBook(
                        userId,
                        request.bookId()
                );

        return ResponseEntity.ok(borrowing);
    }

    // =========================================================
    // RETURN A BOOK
    // =========================================================
    //
    // The borrowing ID identifies which borrowing is being
    // returned.
    //
    // The service should verify that the borrowing belongs
    // to the logged-in user.
    //
    @PutMapping("/{id}/return")
    public ResponseEntity<Borrowing> returnBook(
            @PathVariable Long id,
            Authentication authentication
    ) {

        // Get the logged-in user's ID.
        Long userId =
                (Long) authentication.getCredentials();

        // Return the book.
        Borrowing borrowing =
                borrowingService.returnBook(
                        id,
                        userId
                );

        return ResponseEntity.ok(borrowing);
    }
}