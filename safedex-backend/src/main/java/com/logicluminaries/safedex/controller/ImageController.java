package com.logicluminaries.safedex.controller;

import com.logicluminaries.safedex.model.Image;
import com.logicluminaries.safedex.service.ImageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;

    @PostMapping
    Image addImage(@Valid @RequestBody Image image) {
        return imageService.save(image);
    }
    @PostMapping("/bulk")
    List<Image> addImages(@Valid @RequestBody List<Image> images) {
        return imageService.saveAll(images);
    }
}
