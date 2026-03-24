package com.logicluminaries.safedex.service;

import com.logicluminaries.safedex.model.Image;
import com.logicluminaries.safedex.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {
    private final ImageRepository imageRepository;

    public Image save(Image image) {
        //if property is null
        if(image.getProperty() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Property is null");
        }
        //set creation date
        image.setCreationDate(LocalDate.now());
        //set path
        image.setPath(String.format("/safedex-images/listing%d_%d.jpg",image.getProperty().getId(),image.getPosition()));
        //saves it
        return imageRepository.save(image);
    }

    public List<Image> saveAll(List<Image> images) {
        List<Image> savedImages = new ArrayList<>();
        for(Image image : images) {
            savedImages.add(save(image));
        }
        return savedImages;
    }


}
