package com.deepika.CSVConverter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class CsvConverterApplication {

	public static void main(String[] args) {
		SpringApplication.run(CsvConverterApplication.class, args);
	}

}
