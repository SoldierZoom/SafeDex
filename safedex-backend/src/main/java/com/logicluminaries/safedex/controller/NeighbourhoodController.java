package com.logicluminaries.safedex.controller;

import com.logicluminaries.safedex.model.CrimeRecord;
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

    //helper functions I used to add entries to db

    //adds neighbourhood to db
    /*@PostMapping
    Neighbourhood addNeighbourhood(@Valid @RequestBody Neighbourhood neighbourhood) throws InterruptedException {
        return neighbourhoodService.addNeighbourhood(neighbourhood);
    }
    //add list of neighbourhoods for ease of use
    @PostMapping("/bulk")
    List<Neighbourhood> addNeighbourhoods(@Valid @RequestBody List<Neighbourhood> neighbourhoods) throws InterruptedException {
        return neighbourhoodService.addNeighbourhoods(neighbourhoods);
    }

    //update entries to include boundary points
    @PostMapping("/boundary")
    List<Neighbourhood> addBoundaries() throws InterruptedException {
        return neighbourhoodService.addBoundaries();
    }*/

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

    //gets latest month crimes for a specific neighbourhood
    @GetMapping("/{id}/recentCrimes")
    List<CrimeRecord> getRecentCrimes(@PathVariable Long id, @RequestParam(defaultValue = "1") int page) {
        return neighbourhoodService.getRecentCrimesPage(id, page);
    }
}
