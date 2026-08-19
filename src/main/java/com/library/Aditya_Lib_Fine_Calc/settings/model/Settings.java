package com.library.Aditya_Lib_Fine_Calc.settings.model;

public class Settings {

    // Fine charged for every overdue day.
    private double finePerDay;

    // Number of days a member can keep a book.
    private int borrowingPeriodDays;

    public Settings() {
    }

    public Settings(
            double finePerDay,
            int borrowingPeriodDays
    ) {
        this.finePerDay = finePerDay;
        this.borrowingPeriodDays = borrowingPeriodDays;
    }

    public double getFinePerDay() {
        return finePerDay;
    }

    public void setFinePerDay(double finePerDay) {
        this.finePerDay = finePerDay;
    }

    public int getBorrowingPeriodDays() {
        return borrowingPeriodDays;
    }

    public void setBorrowingPeriodDays(int borrowingPeriodDays) {
        this.borrowingPeriodDays = borrowingPeriodDays;
    }
}