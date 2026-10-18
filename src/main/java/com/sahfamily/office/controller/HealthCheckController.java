package com.sahfamily.office.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController {
    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of("application", "Sah Family Office API", "status", "running");
    }
}
