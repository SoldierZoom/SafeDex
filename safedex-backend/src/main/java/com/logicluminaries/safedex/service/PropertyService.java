package com.logicluminaries.safedex.service;

import com.logicluminaries.safedex.enums.HouseType;
import com.logicluminaries.safedex.enums.OrderType;
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
    //adds list of entries
    public List<Property> saveAll(List<Property> properties) {
        return propertyRepository.saveAll(properties);
    }

    //gets page of filtered entries
    public List<Property> getPage(int pageNum, String query, Integer minPrice, Integer maxPrice, Integer minSafetyScore, Integer minBedroom, Integer maxBedroom, Integer minBathroom, Integer maxBathroom, List<HouseType> types, String sortBy, OrderType order) {
        //adjust sortBy cause safetyScore in neighbourhood table
        String actualSortField;
        if (sortBy.equals("safetyScore")) {
            actualSortField = "neighbourhood.safetyScore";
        } else {
            actualSortField = sortBy;
        }

        //make sort
        Sort sort;
        if (order.toString().equals("DESC")) {
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
            //remove if bedrooms out of range
            Integer bedNum = property.getBedrooms();
            if(minBedroom != null && bedNum < minBedroom) {
                return true;
            }
            if(maxBedroom != null && bedNum > maxBedroom) {
                return true;
            }
            //remove if bathrooms out of range
            Integer bathNum = property.getBathrooms();
            if(minBathroom != null && bathNum < minBathroom) {
                return true;
            }
            if(maxBathroom != null && bathNum > maxBathroom) {
                return true;
            }
            //remove if query doesn't match location
            if(query != null && !query.isEmpty()) {
                String location = property.getRoad().concat(property.getNeighbourhood().getName()).concat(property.getPostcode());
                String[] parts = query.split(" ");
                for(String part : parts) {
                    if(!location.toLowerCase().contains(part.toLowerCase())) {
                        return true;
                    }
                }
            }
            //remove excluded house types
            if(types != null && !types.isEmpty()) {
                if(!types.contains(property.getType())) {
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
