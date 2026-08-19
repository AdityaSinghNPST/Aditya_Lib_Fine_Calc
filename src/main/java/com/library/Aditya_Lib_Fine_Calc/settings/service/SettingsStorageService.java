package com.library.Aditya_Lib_Fine_Calc.settings.service;

import com.library.Aditya_Lib_Fine_Calc.settings.model.Settings;
import org.springframework.stereotype.Service;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.json.JsonMapper;

import java.io.File;

@Service
public class SettingsStorageService {

    private final JsonMapper objectMapper = JsonMapper.builder().build();

    private final String filePath =
            "src/main/resources/data/settings.json";

    // Read application settings.
    public Settings getSettings() {

        try {

            File file = new File(filePath);

            // Create default settings if the file doesn't exist.
            if (!file.exists()) {

                Settings defaultSettings =
                        new Settings(10, 7);

                saveSettings(defaultSettings);

                return defaultSettings;
            }

            return objectMapper.readValue(
                    file,
                    Settings.class
            );

        } catch (JacksonException e) {

            throw new RuntimeException(
                    "Unable to read settings.json",
                    e
            );
        }
    }

    // Save application settings.
    public void saveSettings(Settings settings) {

        try {

            File file = new File(filePath);

            File parentDirectory = file.getParentFile();

            if (parentDirectory != null
                    && !parentDirectory.exists()) {

                if (!parentDirectory.mkdirs()
                        && !parentDirectory.exists()) {

                    throw new RuntimeException(
                            "Unable to create data directory"
                    );
                }
            }

            objectMapper
                    .writerWithDefaultPrettyPrinter()
                    .writeValue(file, settings);

        } catch (JacksonException e) {

            throw new RuntimeException(
                    "Unable to save settings.json",
                    e
            );
        }
    }
}