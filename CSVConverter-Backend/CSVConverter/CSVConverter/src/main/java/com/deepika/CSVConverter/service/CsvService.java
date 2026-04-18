package com.deepika.CSVConverter.service;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

@Service
public class CsvService {

    public List<Map<String, String>> parseCsv(MultipartFile file) throws Exception {
        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"));
             CSVParser csvParser = new CSVParser(fileReader,
                     CSVFormat.RFC4180.builder()
                             .setHeader()
                             .setSkipHeaderRecord(true)
                             .setIgnoreHeaderCase(true)
                             .setTrim(true)
                             .setIgnoreSurroundingSpaces(true)
                             .build())) {
            List<Map<String, String>> data = new ArrayList<>();
            var iterator = csvParser.iterator();
            while (iterator.hasNext()) {
                try {
                    data.add(iterator.next().toMap());
                } catch (Exception e) {
                    System.out.println("Skipping a malformed line: " + e.getMessage());
                }
            }
            return data;
        }
    }

    public List<String> getHeaders(List<Map<String, String>> data) {
        if (data.isEmpty()) return Collections.emptyList();
        return new ArrayList<>(data.get(0).keySet());
    }
}