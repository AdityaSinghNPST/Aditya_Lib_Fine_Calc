package com.library.Aditya_Lib_Fine_Calc.fine.service;

import com.library.Aditya_Lib_Fine_Calc.fine.model.Fine;
import com.library.Aditya_Lib_Fine_Calc.settings.service.SettingsService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FineService {

    private final FineStorageService fineStorageService;

    private final SettingsService settingsService;

    public FineService(
            FineStorageService fineStorageService,
            SettingsService settingsService
    ) {
        this.fineStorageService = fineStorageService;
        this.settingsService = settingsService;
    }

    // Get all fines.
    public List<Fine> getAllFines() {

        return fineStorageService.getAllFines();
    }

    // Get fines belonging to one member.
    public List<Fine> getFinesByUserId(Long userId) {

        List<Fine> allFines =
                fineStorageService.getAllFines();

        List<Fine> userFines =
                new ArrayList<>();

        for (Fine fine : allFines) {

            if (fine.getUserId() != null
                    && fine.getUserId().equals(userId)) {

                userFines.add(fine);
            }
        }

        return userFines;
    }

    // Create a fine after a late book return.
    public Fine createFine(
            Long borrowingId,
            Long userId,
            long overdueDays
    ) {

        List<Fine> fines =
                fineStorageService.getAllFines();

        // Prevent duplicate fines for the same borrowing.
        for (Fine existingFine : fines) {

            if (existingFine.getBorrowingId() != null
                    && existingFine.getBorrowingId()
                    .equals(borrowingId)) {

                return existingFine;
            }
        }

        // Generate the next fine ID.
        long nextId = 1;

        for (Fine fine : fines) {

            if (fine.getId() != null
                    && fine.getId() >= nextId) {

                nextId = fine.getId() + 1;
            }
        }

        // Get the fine rate configured by Admin.
        double finePerDay =
                settingsService.getFinePerDay();

        // Calculate the fine.
        double amount =
                overdueDays * finePerDay;

        // Create the fine.
        Fine fine = new Fine(
                nextId,
                borrowingId,
                userId,
                overdueDays,
                amount
        );

        // Add the fine.
        fines.add(fine);

        // Save the updated fines.
        fineStorageService.saveAllFines(fines);

        return fine;
    }
}