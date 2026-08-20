package com.library.Aditya_Lib_Fine_Calc.fine.model;

public class Fine {

    // Unique fine ID.
    private Long id;

    // ID of the borrowing that caused this fine.
    private Long borrowingId;

    // ID of the member who has the fine.
    private Long userId;

    // Number of days the book was returned late.
    private long overdueDays;

    // Final fine amount.
    private double amount;

    public Fine() {
    }

    public Fine(
            Long id,
            Long borrowingId,
            Long userId,
            long overdueDays,
            double amount
    ) {
        this.id = id;
        this.borrowingId = borrowingId;
        this.userId = userId;
        this.overdueDays = overdueDays;
        this.amount = amount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBorrowingId() {
        return borrowingId;
    }

    public void setBorrowingId(Long borrowingId) {
        this.borrowingId = borrowingId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public long getOverdueDays() {
        return overdueDays;
    }

    public void setOverdueDays(long overdueDays) {
        this.overdueDays = overdueDays;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}