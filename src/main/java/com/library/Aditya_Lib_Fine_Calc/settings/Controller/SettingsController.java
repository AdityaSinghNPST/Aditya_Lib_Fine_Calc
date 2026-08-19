package com.library.Aditya_Lib_Fine_Calc.settings.controller;

import com.library.Aditya_Lib_Fine_Calc.settings.model.Settings;
import com.library.Aditya_Lib_Fine_Calc.settings.service.SettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    // Get current library settings.
    @GetMapping
    public ResponseEntity<Settings> getSettings() {

        return ResponseEntity.ok(
                settingsService.getSettings()
        );
    }

    // Update library settings.
    @PutMapping
    public ResponseEntity<Settings> updateSettings(
            @RequestBody Settings settings
    ) {

        return ResponseEntity.ok(
                settingsService.updateSettings(settings)
        );
    }
}