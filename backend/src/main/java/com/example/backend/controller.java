package com.example.backend;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("")
public class controller {
    @GetMapping("/")
    public String getBook() {
        return "hello this is my test";
    }
}