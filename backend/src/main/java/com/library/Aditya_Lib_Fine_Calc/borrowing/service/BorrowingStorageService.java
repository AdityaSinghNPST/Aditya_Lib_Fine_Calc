package com.library.Aditya_Lib_Fine_Calc.borrowing.service;

import com.library.Aditya_Lib_Fine_Calc.borrowing.model.Borrowing;
import org.springframework.stereotype.Service;
import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
public class BorrowingStorageService {

    // Object used to convert between Java objects and JSON.
    private final JsonMapper objectMapper = JsonMapper.builder().build();

    // Location of the borrowing JSON file.
    private final String filePath =
            "src/main/resources/data/borrowings.json";

    // Read all borrowings from the JSON file.
    public List<Borrowing> getAllBorrowings() {

        try {

            File file = new File(filePath);

            // If the file does not exist, return an empty list.
            if (!file.exists()) {
                return new ArrayList<>();
            }

            // Convert JSON into a list of Borrowing objects.
            return objectMapper.readValue(
                    file,
                    new TypeReference<List<Borrowing>>() {}
            );

        } catch (JacksonException e) {

            // Convert the JSON error into a runtime exception.
            throw new RuntimeException(
                    "Unable to read borrowings.json",
                    e
            );
        }
    }

    // Save all borrowings to the JSON file.
    public void saveAllBorrowings(List<Borrowing> borrowings) {

        try {

            File file = new File(filePath);

            // Get the parent data directory.
            File parentDirectory = file.getParentFile();

            // Create the directory if it does not exist.
            if (parentDirectory != null
                    && !parentDirectory.exists()) {

                if (!parentDirectory.mkdirs()
                        && !parentDirectory.exists()) {

                    throw new RuntimeException(
                            "Unable to create data directory"
                    );
                }
            }

            // Convert the list into formatted JSON.
            objectMapper
                    .writerWithDefaultPrettyPrinter()
                    .writeValue(file, borrowings);

        } catch (JacksonException e) {

            throw new RuntimeException(
                    "Unable to save borrowings.json",
                    e
            );
        }
    }
}