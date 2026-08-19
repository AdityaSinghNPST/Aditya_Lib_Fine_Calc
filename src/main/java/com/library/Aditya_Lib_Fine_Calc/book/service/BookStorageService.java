package com.library.Aditya_Lib_Fine_Calc.book.service;

import com.library.Aditya_Lib_Fine_Calc.book.model.Book;
import org.springframework.stereotype.Service;
import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookStorageService {

    private final JsonMapper objectMapper = JsonMapper.builder().build();

    private final String filePath =
            "src/main/resources/data/books.json";

    public List<Book> getAllBooks() {

        try {

            File file = new File(filePath);

            if (!file.exists()) {
                return new ArrayList<>();
            }

            return objectMapper.readValue(
                    file,
                    new TypeReference<List<Book>>() {}
            );

        } catch (JacksonException e) {

            throw new RuntimeException(
                    "Unable to read books.json",
                    e
            );
        }
    }

    public void saveAllBooks(List<Book> books) {

        try {

            File file = new File(filePath);

            File parentDirectory = file.getParentFile();

            if (parentDirectory != null && !parentDirectory.exists()) {

                if (!parentDirectory.mkdirs()
                        && !parentDirectory.exists()) {

                    throw new RuntimeException(
                            "Unable to create data directory"
                    );
                }
            }

            objectMapper
                    .writerWithDefaultPrettyPrinter()
                    .writeValue(file, books);

        } catch (JacksonException e) {

            throw new RuntimeException(
                    "Unable to save books.json",
                    e
            );
        }
    }
}