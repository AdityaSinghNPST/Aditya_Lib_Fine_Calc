package com.library.Aditya_Lib_Fine_Calc.fine.service;

import com.library.Aditya_Lib_Fine_Calc.fine.model.Fine;
import org.springframework.stereotype.Service;
import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
public class FineStorageService {

    // Converts Java objects to JSON and JSON to Java objects.
    private final JsonMapper objectMapper = JsonMapper.builder().build();

    // Location of the fines JSON file.
    private final String filePath =
            "src/main/resources/data/fines.json";

    // Read all fines from fines.json.
    public List<Fine> getAllFines() {

        try {

            File file = new File(filePath);

            // Return an empty list if the file doesn't exist.
            if (!file.exists()) {
                return new ArrayList<>();
            }

            return objectMapper.readValue(
                    file,
                    new TypeReference<List<Fine>>() {}
            );

        } catch (JacksonException e) {

            throw new RuntimeException(
                    "Unable to read fines.json",
                    e
            );
        }
    }

    // Save all fines to fines.json.
    public void saveAllFines(List<Fine> fines) {

        try {

            File file = new File(filePath);

            File parentDirectory = file.getParentFile();

            // Create the data directory if necessary.
            if (parentDirectory != null
                    && !parentDirectory.exists()) {

                if (!parentDirectory.mkdirs()
                        && !parentDirectory.exists()) {

                    throw new RuntimeException(
                            "Unable to create data directory"
                    );
                }
            }

            // Write nicely formatted JSON.
            objectMapper
                    .writerWithDefaultPrettyPrinter()
                    .writeValue(file, fines);

        } catch (JacksonException e) {

            throw new RuntimeException(
                    "Unable to save fines.json",
                    e
            );
        }
    }
}