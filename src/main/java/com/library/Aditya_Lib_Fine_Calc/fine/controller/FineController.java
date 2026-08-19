package com.library.Aditya_Lib_Fine_Calc.fine.controller;

import com.library.Aditya_Lib_Fine_Calc.fine.model.Fine;
import com.library.Aditya_Lib_Fine_Calc.fine.service.FineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fines")
public class FineController {

    private final FineService fineService;

    public FineController(FineService fineService) {
        this.fineService = fineService;
    }

    // Get all fines.
    @GetMapping
    public ResponseEntity<List<Fine>> getAllFines() {

        return ResponseEntity.ok(
                fineService.getAllFines()
        );
    }
    // Get fines belonging to a particular member.
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Fine>> getFinesByUserId(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                fineService.getFinesByUserId(userId)
        );
    }
}