package com.logicluminaries.safedex.controller;

import com.logicluminaries.safedex.model.Property;
import com.logicluminaries.safedex.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {
    private final PropertyService propertyService;

    //adds property to db, using for testing so may delete later
    @PostMapping
    Property addProperty(@RequestBody Property property) {
        return propertyService.save(property);
    }
    //gets page of properties
    @GetMapping
    public List<Property> getProperties(@RequestParam(defaultValue = "1") int page) {
        return propertyService.getPage(page);
    }

    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable Long id) {
        return propertyService.getById(id);
    }
}
