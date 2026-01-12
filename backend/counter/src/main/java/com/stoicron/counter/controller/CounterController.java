package com.stoicron.counter.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1/counter")
public class CounterController {
    @GetMapping
    public String getCounter() {
        return new String();
    }
    
}
