package com.logicluminaries.safedex.controller;

import com.logicluminaries.safedex.model.Neighbourhood;
import com.logicluminaries.safedex.service.NeighbourhoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/neighbourhoods")
@RequiredArgsConstructor
public class NeighbourhoodController {
    private final NeighbourhoodService neighbourhoodService;

    @PostMapping
    Neighbourhood addNeighbourhood(@RequestBody Neighbourhood neighbourhood) {
        return neighbourhoodService.save(neighbourhood);
    }

    @GetMapping
    List<Neighbourhood> getAllNeighbourhoods() {
        return neighbourhoodService.getAll();
    }

    @GetMapping("/{id}")
    Neighbourhood getNeighbourhoodById(@PathVariable Long id) {
        return neighbourhoodService.getById(id);
    }

}
