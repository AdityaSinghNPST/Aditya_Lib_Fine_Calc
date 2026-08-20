package com.library.Aditya_Lib_Fine_Calc.settings.service;

import com.library.Aditya_Lib_Fine_Calc.settings.model.Settings;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    private final SettingsStorageService settingsStorageService;

    public SettingsService(
            SettingsStorageService settingsStorageService
    ) {
        this.settingsStorageService = settingsStorageService;
    }

    // Get current application settings.
    public Settings getSettings() {

        return settingsStorageService.getSettings();
    }

    // Get the current fine rate.
    public double getFinePerDay() {

        return getSettings().getFinePerDay();
    }

    // Get the current borrowing period.
    public int getBorrowingPeriodDays() {

        return getSettings().getBorrowingPeriodDays();
    }

    // Update application settings.
    public Settings updateSettings(Settings settings) {

        if (settings.getFinePerDay() < 0) {

            throw new IllegalArgumentException(
                    "Fine per day cannot be negative"
            );
        }

        if (settings.getBorrowingPeriodDays() <= 0) {

            throw new IllegalArgumentException(
                    "Borrowing period must be greater than zero"
            );
        }

        settingsStorageService.saveSettings(settings);

        return settings;
    }
}