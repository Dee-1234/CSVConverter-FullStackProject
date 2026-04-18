package com.deepika.CSVConverter.controller;

import com.deepika.CSVConverter.model.AiInstruction;
import com.deepika.CSVConverter.service.AiService;
import com.deepika.CSVConverter.service.CsvService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "http://localhost:5175")
public class DataController {

    @Autowired
    private CsvService csvService;

    @Autowired
    private AiService aiService;

    private List<Map<String,String>>lastUploadedData = new ArrayList<>();

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file){
        try {
            lastUploadedData = csvService.parseCsv(file);
            List<String> headers = csvService.getHeaders(lastUploadedData);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully file uploaded");
            response.put("rowCount", lastUploadedData.size());
            response.put("headers", headers);
            return ResponseEntity.ok(response);
        }catch(Exception e){
            return ResponseEntity.badRequest().body("Upload Error: "+e.getMessage());
        }
    }
    @PostMapping("/query")
    public ResponseEntity<?> askQuestion(@RequestBody Map<String, String> payload) {
        try {
            String userQuery = payload.get("query");
            if (lastUploadedData.isEmpty()) {
                return ResponseEntity.badRequest().body("No data uploaded. Please upload a CSV first.");
            }List<String> headers = csvService.getHeaders(lastUploadedData);
            AiInstruction instruction = aiService.getInstructions(userQuery, headers);
            List<Map<String, Object>> chartData = processData(lastUploadedData, instruction);
            Map<String, Object> response = new HashMap<>();
            response.put("chartData", chartData);
            response.put("summary", instruction.getSummary());
            response.put("chartType", instruction.getChartType().toLowerCase());
            response.put("operationUsed", instruction.getOperation());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Query Error: " + e.getMessage());
        }
    }

    private List<Map<String, Object>> processData(List<Map<String, String>> rawData, AiInstruction instruction) {
        Map<String, Double> aggregatedMap;
        if ("SUM".equalsIgnoreCase(instruction.getOperation())) {
            aggregatedMap = rawData.stream()
                    .filter(row -> row.get(instruction.getTarget()) != null)
                    .collect(Collectors.groupingBy(
                            row -> row.get(instruction.getGroupBy()),
                            Collectors.summingDouble(row -> safeParseDouble(row.get(instruction.getTarget())))
                    ));
        } else if ("AVG".equalsIgnoreCase(instruction.getOperation())) {
            aggregatedMap = rawData.stream()
                    .filter(row -> row.get(instruction.getTarget()) != null)
                    .collect(Collectors.groupingBy(
                            row -> row.get(instruction.getGroupBy()),
                            Collectors.averagingDouble(row -> safeParseDouble(row.get(instruction.getTarget())))
                    ));
        } else {
            Map<String, Long> counts = rawData.stream()
                    .collect(Collectors.groupingBy(
                            row -> row.get(instruction.getGroupBy()),
                            Collectors.counting()
                    ));
            aggregatedMap = counts.entrySet().stream()
                    .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().doubleValue()));
        } return aggregatedMap.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> point = new HashMap<>();
                    point.put("name", entry.getKey());
                    point.put("value", entry.getValue());
                    return point;
                })
                .collect(Collectors.toList());
    }

    private double safeParseDouble(String value) {
        try {
            if (value == null || value.isBlank()) return 0.0;
            return Double.parseDouble(value.replaceAll("[^\\d.]", ""));
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }
}