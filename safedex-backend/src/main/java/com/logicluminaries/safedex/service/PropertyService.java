package com.logicluminaries.safedex.service;

import com.logicluminaries.safedex.model.Property;
import com.logicluminaries.safedex.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {
    private final PropertyRepository propertyRepository;

    //adds entry
    public Property save(Property property) {
        return propertyRepository.save(property);
    }

    //gets all entries
    public List<Property> getAll() {
        return propertyRepository.findAll();
    }

    //gets specific entry by id
    public Property getById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() ->//may make function later if need multiple times
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found"));
    }

}
