package com.logicluminaries.safedex.service;

import com.logicluminaries.safedex.model.Neighbourhood;
import com.logicluminaries.safedex.model.Property;
import com.logicluminaries.safedex.repository.NeighbourhoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NeighbourhoodService {
    private final NeighbourhoodRepository neighbourhoodRepository;


    public Neighbourhood save(Neighbourhood neighbourhood) {
        return neighbourhoodRepository.save(neighbourhood);
    }

    public List<Neighbourhood> getAll() {
        return neighbourhoodRepository.findAll();
    }

    public Neighbourhood getById(Long id) {
        return neighbourhoodRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Neighbourhood not found"));
    }
}
