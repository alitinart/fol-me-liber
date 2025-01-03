package com.alitinart.fml.book.collection.service;

import com.alitinart.fml.book.collection.domain.Book;
import com.alitinart.fml.book.collection.repo.BookRepo;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepo bookRepo;

    public BookServiceImpl(BookRepo bookRepo) {
        this.bookRepo = bookRepo;
    }

    @Override
    public List<Book> getAllBooks() {
        return bookRepo.findAll();
    }

    @Override
    public void deleteCollection(String id) {
        bookRepo.deleteById(id);
    }
}
