package com.logicluminaries.safedex.service;

import com.logicluminaries.safedex.model.Property;
import com.logicluminaries.safedex.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {
    private final PropertyRepository propertyRepository;
    private static final int ITEMS_PER_PAGE = 10;//wil obviously increase later

    //adds entry
    public Property save(Property property) {
        return propertyRepository.save(property);
    }

    //gets page of filtered entries
    public List<Property> getPage(int pageNum, String query, Integer minPrice, Integer maxPrice, Integer minSafetyScore, String sortBy, String order) {
        //adjust sortBy cause safetyScore in neighbourhood table
        String actualSortField;
        if (sortBy.equals("safetyScore")) {
            actualSortField = "neighbourhood.safetyScore";
        } else {
            actualSortField = sortBy;
        }

        //make sort
        Sort sort;
        if (order.equalsIgnoreCase("desc")) {
            sort = Sort.by(actualSortField).descending();
        } else {
            sort = Sort.by(actualSortField).ascending();
        }
        //get list of sorted properties
        List<Property> all = propertyRepository.findAll(sort);//gets all entries
        //filter properties
        all.removeIf(property -> {
            float price = property.getPpm();
            //removes if out of price range
            if(minPrice != null && price < minPrice) {
                return true;
            }
            if(maxPrice != null && price > maxPrice) {
                return true;
            }
            //remove if safety score below minimum
            if(minSafetyScore != null && property.getNeighbourhood().getSafetyScore() < minSafetyScore) {
                return true;
            }
            //remove if query doesn't match name - may improve later
            if(query != null && !query.isEmpty()) {
                if(!property.getName().toLowerCase().contains(query.toLowerCase())) {
                    return true;
                }
            }
            return false;
        });
        //get page
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
