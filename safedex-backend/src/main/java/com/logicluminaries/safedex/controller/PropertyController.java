package com.logicluminaries.safedex.controller;

import com.logicluminaries.safedex.model.Property;
import com.logicluminaries.safedex.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {
    private final PropertyService propertyService;

    //adds property to db
    @PostMapping
    Property addProperty(@RequestBody Property property) {
        return propertyService.save(property);
    }
    //gets page of properties
    @GetMapping
    public List<Property> getProperties(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer minSafetyScore,
            @RequestParam(defaultValue = "ppm") String sortBy,
            @RequestParam(defaultValue = "asc") String order
    ) {
        return propertyService.getPage(page,query,minPrice,maxPrice,minSafetyScore,sortBy,order);
    }

    //gets specific property with its unique id
    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable Long id) {
        return propertyService.getById(id);
    }
}
