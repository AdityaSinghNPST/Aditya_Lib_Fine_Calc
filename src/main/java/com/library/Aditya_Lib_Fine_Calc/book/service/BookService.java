package com.library.Aditya_Lib_Fine_Calc.book.service;

import com.library.Aditya_Lib_Fine_Calc.book.model.Book;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookStorageService bookStorageService;

    public BookService(BookStorageService bookStorageService) {
        this.bookStorageService = bookStorageService;
    }

    public List<Book> getAllBooks() {
        return bookStorageService.getAllBooks();
    }

    public Book findBookById(Long id) {

        List<Book> books = bookStorageService.getAllBooks();

        for (Book book : books) {

            if (book.getId() != null
                    && book.getId().equals(id)) {

                return book;
            }
        }

        return null;
    }

    public Book createBook(
            String title,
            String author,
            String isbn
    ) {

        List<Book> books =
                bookStorageService.getAllBooks();

        long nextId = 1;

        if (!books.isEmpty()) {

            long maxId = 0;

            for (Book book : books) {

                if (book.getId() != null
                        && book.getId() > maxId) {

                    maxId = book.getId();
                }
            }

            nextId = maxId + 1;
        }

        Book newBook = new Book(
                nextId,
                title,
                author,
                isbn,
                true
        );

        books.add(newBook);

        bookStorageService.saveAllBooks(books);

        return newBook;
    }
}