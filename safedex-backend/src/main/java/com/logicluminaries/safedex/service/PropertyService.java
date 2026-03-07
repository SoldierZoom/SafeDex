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
    private static final int ITEMS_PER_PAGE = 2;//wil obviously increase later

    //adds entry
    public Property save(Property property) {
        return propertyRepository.save(property);
    }

    //gets page of entries
    public List<Property> getPage(int pageNum) {
        List<Property> all = propertyRepository.findAll();//gets all entries

        int start = (pageNum - 1) * ITEMS_PER_PAGE;
        int end = Math.min(start + ITEMS_PER_PAGE, all.size());

        List<Property> page = all.subList(start, end);
        return page;
    }

    //gets specific entry by id
    public Property getById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() ->//may make function later if need multiple times
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found"));
    }

}
