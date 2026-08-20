package com.library.Aditya_Lib_Fine_Calc.borrowing.service;

import com.library.Aditya_Lib_Fine_Calc.book.model.Book;
import com.library.Aditya_Lib_Fine_Calc.book.service.BookService;
import com.library.Aditya_Lib_Fine_Calc.borrowing.model.Borrowing;
import com.library.Aditya_Lib_Fine_Calc.borrowing.model.BorrowingStatus;
import com.library.Aditya_Lib_Fine_Calc.fine.service.FineService;
import com.library.Aditya_Lib_Fine_Calc.settings.service.SettingsService;
import com.library.Aditya_Lib_Fine_Calc.user.model.User;
import com.library.Aditya_Lib_Fine_Calc.user.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.annotation.PostConstruct;

@Service
public class BorrowingService {

    private final BorrowingStorageService borrowingStorageService;

    private final BookService bookService;

    private final UserService userService;

    private final FineService fineService;

    private final SettingsService settingsService;

    public BorrowingService(
            BorrowingStorageService borrowingStorageService,
            BookService bookService,
            UserService userService,
            FineService fineService,
            SettingsService settingsService
    ) {
        this.borrowingStorageService = borrowingStorageService;
        this.bookService = bookService;
        this.userService = userService;
        this.fineService = fineService;
        this.settingsService = settingsService;
    }

    // =========================================================
    // SYNC BOOK AVAILABILITY ON STARTUP
    // =========================================================

    @PostConstruct
    public void syncBookAvailabilityOnStartup() {

        syncAllBookAvailability();
    }

    // =========================================================
    // SYNC ALL BOOK AVAILABILITY
    // =========================================================

    public void syncAllBookAvailability() {

        Set<Long> borrowedBookIds =
                getActiveBorrowedBookIds();

        bookService.syncAvailability(
                borrowedBookIds
        );
    }

    // =========================================================
    // ACTIVE BORROWING HELPERS
    // =========================================================

    public boolean hasActiveBorrowingForBook(
            Long bookId
    ) {

        for (Borrowing borrowing :
                borrowingStorageService.getAllBorrowings()) {

            if (isActiveBorrowing(borrowing)
                    && bookId.equals(
                    borrowing.getBookId())) {

                return true;
            }
        }

        return false;
    }

    private boolean isActiveBorrowing(
            Borrowing borrowing
    ) {

        if (borrowing.getStatus()
                == BorrowingStatus.RETURNED) {

            return false;
        }

        if (borrowing.getReturnDate() != null) {

            return false;
        }

        return borrowing.getStatus()
                == BorrowingStatus.BORROWED
                || borrowing.getStatus()
                == BorrowingStatus.OVERDUE;
    }

    private Set<Long> getActiveBorrowedBookIds() {

        Set<Long> borrowedBookIds =
                new HashSet<>();

        for (Borrowing borrowing :
                borrowingStorageService.getAllBorrowings()) {

            if (isActiveBorrowing(borrowing)
                    && borrowing.getBookId()
                    != null) {

                borrowedBookIds.add(
                        borrowing.getBookId()
                );
            }
        }

        return borrowedBookIds;
    }

    // =========================================================
    // GET ALL BORROWINGS
    // =========================================================

    // Get all borrowing records.
    // Admin will use this method.
    public List<Borrowing> getAllBorrowings() {

        return borrowingStorageService.getAllBorrowings();
    }

    // =========================================================
    // FIND BORROWING BY ID
    // =========================================================

    // Find a borrowing using its ID.
    public Borrowing findBorrowingById(Long id) {

        List<Borrowing> borrowings =
                borrowingStorageService.getAllBorrowings();

        for (Borrowing borrowing : borrowings) {

            if (borrowing.getId() != null
                    && borrowing.getId().equals(id)) {

                return borrowing;
            }
        }

        return null;
    }

    // =========================================================
    // GET BORROWINGS FOR ONE USER
    // =========================================================

    // Get only the borrowings belonging to a particular user.
    // This is used for normal Members.
    public List<Borrowing> getBorrowingsByUserId(Long userId) {

        List<Borrowing> allBorrowings =
                borrowingStorageService.getAllBorrowings();

        List<Borrowing> userBorrowings =
                new ArrayList<>();

        for (Borrowing borrowing : allBorrowings) {

            if (borrowing.getUserId() != null
                    && borrowing.getUserId().equals(userId)) {

                userBorrowings.add(borrowing);
            }
        }

        return userBorrowings;
    }

    // =========================================================
    // BORROW BOOK
    // =========================================================

    // Borrow a book for a member.
    public Borrowing borrowBook(
            Long userId,
            Long bookId
    ) {

        // Check that the user exists.
        User user =
                userService.findUserById(userId);

        if (user == null) {

            throw new IllegalArgumentException(
                    "User not found"
            );
        }

        // Check that the book exists.
        Book book =
                bookService.findBookById(bookId);

        if (book == null) {

            throw new IllegalArgumentException(
                    "Book not found"
            );
        }

        // Check whether the book is available.
        if (!book.isAvailable()) {

            throw new IllegalStateException(
                    "Book is currently not available"
            );
        }

        // Prevent borrowing when an active record already exists.
        if (hasActiveBorrowingForBook(bookId)) {

            throw new IllegalStateException(
                    "Book is currently not available"
            );
        }

        // Prevent the same user from borrowing the same book twice.
        for (Borrowing existing :
                borrowingStorageService.getAllBorrowings()) {

            if (isActiveBorrowing(existing)
                    && bookId.equals(
                    existing.getBookId())
                    && userId.equals(
                    existing.getUserId())) {

                throw new IllegalStateException(
                        "You have already borrowed this book"
                );
            }
        }

        // Get all existing borrowings.
        List<Borrowing> borrowings =
                borrowingStorageService.getAllBorrowings();

        // Generate the next borrowing ID.
        long nextId = 1;

        for (Borrowing borrowing : borrowings) {

            if (borrowing.getId() != null
                    && borrowing.getId() >= nextId) {

                nextId =
                        borrowing.getId() + 1;
            }
        }

        // The book is borrowed today.
        LocalDate issueDate =
                LocalDate.now();

        // Get borrowing period configured by Admin.
        int borrowingPeriodDays =
                settingsService.getBorrowingPeriodDays();

        // Calculate the due date.
        LocalDate dueDate =
                issueDate.plusDays(
                        borrowingPeriodDays
                );

        // Create the borrowing record.
        Borrowing borrowing =
                new Borrowing(
                        nextId,
                        bookId,
                        userId,
                        issueDate,
                        dueDate,
                        null,
                        BorrowingStatus.BORROWED
                );

        // Add borrowing to the list.
        borrowings.add(borrowing);

        // Save borrowing records.
        borrowingStorageService.saveAllBorrowings(
                borrowings
        );

        // Mark the book as unavailable.
        bookService.setBookAvailability(
                bookId,
                false
        );

        return borrowing;
    }

    // =========================================================
    // RETURN BOOK
    // =========================================================

    // Return a borrowed book.
    //
    // IMPORTANT:
    // userId comes from the logged-in user's JWT.
    //
    // This prevents one Member from returning another
    // Member's borrowed book.
    public Borrowing returnBook(
            Long borrowingId,
            Long userId
    ) {

        // Find the borrowing.
        Borrowing borrowing =
                findBorrowingById(borrowingId);

        if (borrowing == null) {

            throw new IllegalArgumentException(
                    "Borrowing not found"
            );
        }

        // Check whether this borrowing belongs
        // to the logged-in user.
        if (borrowing.getUserId() == null
                || !borrowing.getUserId().equals(userId)) {

            throw new IllegalStateException(
                    "You cannot return a book borrowed by another user"
            );
        }

        // Prevent returning the same book twice.
        if (borrowing.getStatus()
                == BorrowingStatus.RETURNED) {

            throw new IllegalStateException(
                    "Book has already been returned"
            );
        }

        // Record today's date.
        LocalDate returnDate =
                LocalDate.now();

        borrowing.setReturnDate(
                returnDate
        );

        // Check if the book is overdue.
        if (returnDate.isAfter(
                borrowing.getDueDate()
        )) {

            long overdueDays =
                    ChronoUnit.DAYS.between(
                            borrowing.getDueDate(),
                            returnDate
                    );

            // Create the fine automatically.
            fineService.createFine(
                    borrowing.getId(),
                    borrowing.getUserId(),
                    overdueDays
            );
        }

        // Book has now been returned.
        borrowing.setStatus(
                BorrowingStatus.RETURNED
        );

        // Get all borrowings.
        List<Borrowing> borrowings =
                borrowingStorageService.getAllBorrowings();

        // Update the borrowing record.
        for (int i = 0;
             i < borrowings.size();
             i++) {

            if (borrowings.get(i).getId()
                    .equals(borrowing.getId())) {

                borrowings.set(
                        i,
                        borrowing
                );

                break;
            }
        }

        // Save updated borrowing records.
        borrowingStorageService.saveAllBorrowings(
                borrowings
        );

        // Make the book available again only when no
        // other active borrowing exists for it.
        Book book =
                bookService.findBookById(
                        borrowing.getBookId()
                );

        if (book != null
                && !hasActiveBorrowingForBook(
                book.getId())) {

            bookService.setBookAvailability(
                    book.getId(),
                    true
            );
        }

        return borrowing;
    }
}