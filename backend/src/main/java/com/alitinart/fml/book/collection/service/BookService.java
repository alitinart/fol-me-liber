package com.alitinart.fml.book.collection.service;

import com.alitinart.fml.book.collection.domain.Book;

import java.util.List;

public interface BookService {
    List<Book> getAllBooks();

    void deleteCollection(String id);
}
