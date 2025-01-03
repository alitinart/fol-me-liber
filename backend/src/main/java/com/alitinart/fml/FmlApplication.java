package com.alitinart.fml;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class FmlApplication {

	public static void main(String[] args) {
		SpringApplication.run(FmlApplication.class, args);
	}

}
