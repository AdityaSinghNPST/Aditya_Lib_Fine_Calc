package com.library.Aditya_Lib_Fine_Calc.borrowing.model;

import java.time.LocalDate;

public class Borrowing {

    // Unique borrowing ID.
    private Long id;

    // ID of the book being borrowed.
    private Long bookId;

    // ID of the member/user who borrowed the book.
    private Long userId;

    // Date on which the book was borrowed.
    private LocalDate issueDate;

    // Date by which the book should be returned.
    private LocalDate dueDate;

    // Actual return date.
    // It is null while the book is still borrowed.
    private LocalDate returnDate;

    // Current status of the borrowing.
    private BorrowingStatus status;

    public Borrowing() {
    }

    public Borrowing(
            Long id,
            Long bookId,
            Long userId,
            LocalDate issueDate,
            LocalDate dueDate,
            LocalDate returnDate,
            BorrowingStatus status
    ) {
        this.id = id;
        this.bookId = bookId;
        this.userId = userId;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public BorrowingStatus getStatus() {
        return status;
    }

    public void setStatus(BorrowingStatus status) {
        this.status = status;
    }
}