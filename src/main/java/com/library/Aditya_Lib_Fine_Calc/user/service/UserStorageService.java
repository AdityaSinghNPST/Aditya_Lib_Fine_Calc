package com.library.Aditya_Lib_Fine_Calc.user.service;

import com.library.Aditya_Lib_Fine_Calc.user.model.User;
import org.springframework.stereotype.Service;
import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserStorageService {

    // JsonMapper converts Java objects into JSON
    // and converts JSON back into Java objects.
    private final JsonMapper objectMapper = JsonMapper.builder().build();

    // Path of the JSON file where users are stored.
    private final String filePath = "src/main/resources/data/users.json";

    // Read all users from users.json.
    public List<User> getAllUsers() {

        try {

            // Create a File object pointing to users.json.
            File file = new File(filePath);

            // If the file does not exist,
            // return an empty list instead of crashing.
            if (!file.exists()) {
                return new ArrayList<>();
            }

            // Convert the JSON array into List<User>.
            return objectMapper.readValue(
                    file,
                    new TypeReference<List<User>>() {}
            );

        } catch (JacksonException e) {

            // Handle JSON parsing or mapping errors.
            throw new RuntimeException(
                    "Unable to read users.json",
                    e
            );
        }
    }

    // Save all users into users.json.
    public void saveAllUsers(List<User> users) {

        try {

            // Create a File object pointing to users.json.
            File file = new File(filePath);

            // Make sure the parent directory exists.
            File parentDirectory = file.getParentFile();

//            if (parentDirectory != null && !parentDirectory.exists()) {
//                parentDirectory.mkdirs();}

            if (parentDirectory != null && !parentDirectory.exists()) {
                if (!parentDirectory.mkdirs() && !parentDirectory.exists()) {
                    throw new RuntimeException("Unable to create data directory");
                }
            }

            // Convert the List<User> into formatted JSON
            // and write it to the file.
            objectMapper
                    .writerWithDefaultPrettyPrinter()
                    .writeValue(file, users);

        } catch (JacksonException e) {

            // Handle JSON serialization errors.
            throw new RuntimeException(
                    "Unable to save users.json",
                    e
            );
        }
    }
}