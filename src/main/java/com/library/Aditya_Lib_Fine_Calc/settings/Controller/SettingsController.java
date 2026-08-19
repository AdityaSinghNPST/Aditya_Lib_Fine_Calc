package com.library.Aditya_Lib_Fine_Calc.settings.Controller;

import com.library.Aditya_Lib_Fine_Calc.settings.model.Settings;
import com.library.Aditya_Lib_Fine_Calc.settings.service.SettingsService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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