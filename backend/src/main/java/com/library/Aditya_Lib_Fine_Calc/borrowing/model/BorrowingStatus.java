package com.library.Aditya_Lib_Fine_Calc.borrowing.model;

public enum BorrowingStatus {

    // Book is currently with the member.
    BORROWED,

    // Book has passed its due date and has not been returned.
    OVERDUE,

    // Book has been returned.
    RETURNED
}