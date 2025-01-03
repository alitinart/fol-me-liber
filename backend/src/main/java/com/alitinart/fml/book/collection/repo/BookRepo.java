package com.alitinart.fml.book.collection.repo;

import com.alitinart.fml.book.collection.domain.Book;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookRepo extends MongoRepository<Book, String> {
    @Query(value = "{'title': '?0'}", delete = true)
    void deleteBookCollectionByTitle(String title);

    @Query(value = "{'collectionName': '?0'}", delete = true)
    void deleteBookCollectionByCollectionName(String title);

    @Query("{'collectionName': '?0'}")
    Optional<Book> findBookCollectionByCollectionName(String collectionName);

    @Override
    Optional<Book> findById(String s);

    @Override
    void deleteById(String s);
}
