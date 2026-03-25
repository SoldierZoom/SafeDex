package com.logicluminaries.safedex.controller;

import com.logicluminaries.safedex.enums.HouseType;
import com.logicluminaries.safedex.enums.OrderType;
import com.logicluminaries.safedex.enums.SortType;
import com.logicluminaries.safedex.model.PagedProperties;
import com.logicluminaries.safedex.model.Property;
import com.logicluminaries.safedex.service.PropertyService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@Validated
public class PropertyController {
    private final PropertyService propertyService;
    
    //adds property to db
    /*@PostMapping
    Property addProperty(@Valid @RequestBody Property property) {
        return propertyService.save(property);
    }
    //add list of properties to db
    @PostMapping("/bulk")
    List<Property> addProperties(@Valid @RequestBody List<Property> properties) {
        return propertyService.saveAll(properties);
    }*/

    //gets page of properties
    @GetMapping
    public PagedProperties getProperties(
            @RequestParam(defaultValue = "1") @Min(1) int page,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) @Min(0) Integer minPrice,
            @RequestParam(required = false) @Min(0) Integer maxPrice,
            @RequestParam(required = false) @Min(0) Integer minSafetyScore,
            @RequestParam(required = false) @Min(1) Integer minBedrooms,
            @RequestParam(required = false) @Min(1) Integer maxBedrooms,
            @RequestParam(required = false) @Min(1) Integer minBathrooms,
            @RequestParam(required = false) @Min(1) Integer maxBathrooms,
            @RequestParam(required = false) List<HouseType> types,
            @RequestParam(defaultValue = "price") SortType sortBy,
            @RequestParam(defaultValue = "ASC") OrderType order
    ) {
        return propertyService.getPage(page,query,minPrice,maxPrice,minSafetyScore,minBedrooms,maxBedrooms,minBathrooms,maxBathrooms,types,sortBy,order);
    }

    //gets specific property with its unique id
    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable Long id) {
        return propertyService.getById(id);
    }
}
