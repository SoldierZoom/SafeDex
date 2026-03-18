package com.logicluminaries.safedex.controller;

import com.logicluminaries.safedex.model.Neighbourhood;
import com.logicluminaries.safedex.service.NeighbourhoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/neighbourhoods")
@RequiredArgsConstructor
public class NeighbourhoodController {
    private final NeighbourhoodService neighbourhoodService;

    //adds neighbourhood to db, for testing say may remove
    @PostMapping
    Neighbourhood addNeighbourhood(@Valid @RequestBody Neighbourhood neighbourhood) throws InterruptedException {
        return neighbourhoodService.addNeighbourhood(neighbourhood);
    }
    @PostMapping("/bulk")
    //add list of neighbourhoods for ease of use
    List<Neighbourhood> addNeighbourhoods(@Valid @RequestBody List<Neighbourhood> neighbourhoods) throws InterruptedException {
        return neighbourhoodService.addNeighbourhoods(neighbourhoods);
    }

    //gets all neighbourhoods in db
    @GetMapping
    List<Neighbourhood> getAllNeighbourhoods() {
        return neighbourhoodService.getAll();
    }

    //gets specific neighbourhood with its unique id
    @GetMapping("/{id}")
    Neighbourhood getNeighbourhoodById(@PathVariable Long id) {
        return neighbourhoodService.getById(id);
    }
}
